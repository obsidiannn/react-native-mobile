
import * as ImagePicker from 'expo-image-picker';
import { requestCameraPermission, requestDirectoryPermission, requestPhotoPermission } from '@/lib/permissions';
import s3Api from '../api/v2/s3';

import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';
import mime from 'mime/dist/src/index_lite';
import { EnFileCacheStorage, globalStorage } from '@/lib/storage';
import quickAes from '@/lib/quick-aes';
import crypto from 'react-native-quick-crypto';
import * as MediaLibrary from 'expo-media-library';
import ToastException from '@/exception/toast-exception';
import { Platform } from 'react-native';
import { StorageAccessFramework } from 'expo-file-system';
import * as RNFS from 'react-native-fs';
import * as Sharing from 'expo-sharing';
import toast from '@/lib/toast';
import { enc } from 'crypto-js';
import dayjs from 'dayjs';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

// 加解密的分片大小
const ENCODE_CHUNK = 65536
const DECODE_CHUNK = ENCODE_CHUNK + 16

export interface ChooseImageOption {
    aspect?: [number, number],
    quality: number,
}

export interface EncodeFileResult {
    path: string
    md5: string
    enc_md5: string
}

export const chooseMultipleImage = async (isCamera: boolean, option: ChooseImageOption, multiple: boolean = true, isEdit: boolean = false): Promise<string[] | null> => {
    if (multiple) {
        isEdit = false;
    }
    const params = {
        ...option,
        allowsEditing: isEdit,
        exif: false,
        chooseMultipleImage: multiple,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
    }
    if (!isCamera) {
        await requestPhotoPermission()
        const result = await ImagePicker.launchImageLibraryAsync(params);
        if (!result.canceled) {
            return result.assets.map(item => item.uri)
        }
        return null;
    }
    await requestCameraPermission();
    const result = await ImagePicker.launchCameraAsync(params);
    if (!result.canceled) {
        result.assets.map(item => item.uri)
    }
    return null;
}
export const chooseImage = async (isCamera: boolean, option: ChooseImageOption): Promise<string | null> => {
    const images = await chooseMultipleImage(isCamera, option, false, true);
    if (images && images.length > 0) {
        return images[0];
    }
    return null;
}

export const uploadFile = async (path: string, key: string): Promise<boolean> => {
    console.log('uploadFile', path, key);
    return new Promise(async (resolve, reject) => {
        const data = await s3Api.getPresignedUrl(key)
        try {

            const response = await FileSystem.uploadAsync(data.result, path, {
                httpMethod: 'PUT',
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            });
            if (!response) {
                reject(new Error('上传失败'));
            }
            response?.status === 200 ? resolve(true) : reject(new Error('上传失败'));
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })

};

/**
 * 上传本地图片，不加密
 * @param localImage 
 * @returns 
 */
export const uploadImage = async (localImage: string) =>{

    if (localImage.startsWith('file:/')) {
        const uuid = (await crypto.randomUUID()).replace(/-/g, '');
        const date = dayjs().format('YYYY/MM/DD');
        const key = `upload/avatar/${date}/${uuid}.webp`;
        const manipResult = await manipulateAsync(
            localImage,
            [
                { resize: { width: 200 } },
            ],
            { compress: 1, format: SaveFormat.JPEG }
        );
        const webpOutput = manipResult.uri.replace(/\.jpg$/, '.webp');
        if (await format(manipResult.uri, webpOutput)) {
            FileSystem.deleteAsync(localImage);
            localImage = webpOutput;
        }
        await uploadFile(localImage, key);
        return key;
    }
    return null
}

export const format = async (input: string, output: string): Promise<boolean> => {
    const cmd = `-i ${input} ${output}`;
    const session = await FFmpegKit.execute(cmd);
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) {
        return true;
    } else if (ReturnCode.isCancel(returnCode)) {
        throw new Error('转码取消');
    } else {
        throw new Error('转码失败');
    }
}

/**
 * 视频的转码
 * @param input 
 * @param output 
 * @returns 
 */
export const formatVideo = async (input: string, output: string): Promise<boolean> => {
    const cmd = `-i ${input} -c:v libx264 ${output}`;
    const session = await FFmpegKit.execute(cmd);
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) {
        return true;
    } else if (ReturnCode.isCancel(returnCode)) {
        throw new Error('转码取消');
    } else {
        console.log(cmd);
        throw new Error('转码失败');
    }
}

let baseUrl: string | undefined;
const getFullUrl = (key: string) => {
    if (!baseUrl) {
        baseUrl = globalStorage.getString('sys-static-url');
    }
    return `${baseUrl}${key}`;
}
const encryptFile = async (path: string, key: string): Promise<{
    path: string;
    enc_md5: string;
    md5: string;
}> => {
   const content = Buffer.from(await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
    }), 'base64');
    const md5 = crypto.Hash('md5').update(content).digest('hex');
    const newPath = `${FileSystem.cacheDirectory}${crypto.randomUUID()}.enc`;
    const encData = await quickAes.EnBuffer(content, key);
    await FileSystem.writeAsStringAsync(newPath, Buffer.from(encData).toString('base64'), {
        encoding: FileSystem.EncodingType.Base64,
    });
    const encMd5 = crypto.Hash('md5').update(encData).digest('hex');
    return {
        path: newPath,
        enc_md5: encMd5,
        md5: md5,
    };
}

const encryptVideo = async (path: string, key: string): Promise<{
    path: string;
    enc_md5: string;
    md5: string;
}> => {
    const content = Buffer.from(await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
    }), 'base64');
    const newPath = `${FileSystem.cacheDirectory}${crypto.randomUUID()}.enc`;
    const encData = await quickAes.En(content.toString('base64'), key);
    const md5 = crypto.Hash('md5').update(content).digest('hex');
    await FileSystem.writeAsStringAsync(newPath, encData, {
    });
    const encMd5 = crypto.Hash('md5').update(encData).digest('hex');
    return {
        path: newPath,
        enc_md5: encMd5,
        md5: md5,
    };
}

// 判断下载的文件是否存在
const checkDownloadFileExists = async (url: string) => {
    const key = crypto.Hash('sha256').update(url).digest('hex');
    const path = `${FileSystem.cacheDirectory}/${key}`;
    return await RNFS.exists(path);
}

const checkExist=async (path: string):Promise<boolean> =>{
    return await RNFS.exists(path);
}

const urlToPath = (url: string) =>{
    const key = crypto.Hash('sha256').update(url).digest('hex');
    return `${FileSystem.cacheDirectory}/${key}`;
}

const downloadFile = async (url: string, path: string = ''): Promise<string> => {
    if (!path) {
        const key = crypto.Hash('sha256').update(url).digest('hex');
        path = `${FileSystem.cacheDirectory}/${key}`;
    }
    // 判断文件是否存在
    if (await RNFS.exists(path)) {
        console.log('文件已存在', path);
        return path;
    }
    const result = await FileSystem.downloadAsync(url, path, {
        md5: true,
    });
    console.log('download result', result)
    if (result.status !== 200) {
        // 删除文件
        await RNFS.unlink(path);
        throw new Error('下载失败5');
    }
    // if (result.md5 !== md5) {
    //     // 删除文件
    //     await RNFS.unlink(path);
    //     throw new Error('下载失败6');
    // }
    return path;
}
const readFile = async (path: string): Promise<string> => {
    return await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
    });
}
const getEnFileContent = async (uri: string, encKey: string): Promise<string | null> => {
    if (!uri.startsWith('upload')) {
        throw new Error('不支持的文件');
    }
    const path = await downloadFile(getFullUrl(uri));
    const encData = await readFile(path);
    const decData = quickAes.DeBuffer(Buffer.from(encData, 'base64'), encKey);
    return Buffer.from(decData).toString('base64');
}

/**
 * 生成视频缩略图
 * @param videoPath 视频地址
 * @param mid 消息主键
 * @returns 
 */
const generateVideoThumbnail = async(videoPath: string,mid: string) =>{
    const thumbnailPath = FileSystem.cacheDirectory + mid + '_thumbnail.jpg'
    const cmd = `-i ${videoPath} -ss 00:00:01 -vframes 1 ${thumbnailPath}`
    const session = await FFmpegKit.execute(cmd)
    if(ReturnCode.isSuccess(await session.getReturnCode())){
        return thumbnailPath;
    }
    return null
}

const cachePath = () =>{
    return FileSystem.cacheDirectory
}

/**
 * 解密视频文件
 * @param uri 云端文件位置
 * @param encKey 
 * @returns 
 */
const decodeVideo = async (uri: string, encKey: string): Promise<string | null> => {
    const name = getFileNameSign(uri)
    const targetPath =`${FileSystem.cacheDirectory}/${name}_decode.mp4`;
    const encodeFilePath = await downloadFile(getFullUrl(uri));
    
    const decodeFilePath = fileSplitDecode(targetPath,encodeFilePath,encKey)
    if(decodeFilePath !== null){
        return decodeFilePath
    }
    return null
}

/**
 * 文件分片加密
 * @param encKey 
 * @param fileKey 文件在云端的路径
 * @param localPath 待加密的本地文件地址
 * @returns 
 */
const fileSpliteEncode = async (fileKey: string,localPath: string,encKey: string): Promise<EncodeFileResult> =>{
    const fileKeySign = getFileNameSign(fileKey)
    const fileInfo = await getFileInfo(localPath)
    const newPath = `${FileSystem.cacheDirectory}${fileKeySign}.enc`;
    
    if(!await RNFS.exists(newPath)){
        const limit = ENCODE_CHUNK
        const total = fileInfo.size
        for (let start = 0; start < total; start+=limit) {
            const end = Math.min(start+limit-1,total-1)        
            const originalData = await chunkFromFile(localPath,start,end)
            const decData = quickAes.EnPadding(Buffer.from(originalData, 'base64'), encKey);
            await RNFS.appendFile(newPath,Buffer.from(decData).toString('base64'),'base64')
        }
    }
    
    const targetInfo = await FileSystem.getInfoAsync(newPath,{size: true,md5: true})
    return {
        path: newPath,
        enc_md5: targetInfo.md5??'',
        md5: fileInfo.md5,
    };
}

/**
 * 文件分片解密
 * @param encKey 
 * @param localPath 本地密文文件地址
 * @param targetPath 解密后的文件地址
 * @returns 
 */
const fileSplitDecode = async (targetPath: string,localPath: string, encKey: string): Promise<string | null> => {
    const exists = await RNFS.exists(targetPath);
    if (exists) {
        return targetPath
        // await RNFS.unlink(targetPath)
    }
    const encodeFile = await FileSystem.getInfoAsync(localPath,{size: true,md5: true})
    const total = encodeFile.size    
    const limit = DECODE_CHUNK
    for (let start = 0; start < total; start+=limit) {
        const end = Math.min(start+limit-1,total-1)        
        const encData = await chunkFromFile(localPath,start,end)
        const decData = quickAes.DePadding(Buffer.from(encData, 'base64'), encKey);
        
        await RNFS.appendFile(targetPath,Buffer.from(decData).toString('base64'),'base64')
    }
    return targetPath
}

/**
 * 分片读取文件
 * @param filePath 文件地址
 * @param start 字符下标起点
 * @param end 字符下标终点
 * @returns 
 */
const chunkFromFile = async (filePath: string,start: number,end: number) =>{
    const chunk = await RNFS.read(filePath,end-start+1,start,{
        encoding: 'base64'
    })
    return chunk
}


const getFileNameSign = (key: string) => {
    return crypto.Hash('sha256').update(key).digest('hex');
}

// 保存到相册
const saveToAlbum = async (uri: string): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        return false;
    }
    try {
        if (uri.startsWith('data')) {
            // 获取文件类型
            const mimeType = uri.split(';')[0].split(':')[1];
            // 获取文件后缀
            // 生成文件名 保存在缓存目录
            const data = uri.split(',')[1];
            uri = `${FileSystem.cacheDirectory}${crypto.randomUUID()}.${mime.getExtension(mimeType)}`;
            await FileSystem.writeAsStringAsync(uri, data, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }
        if (!uri.startsWith('file')) {
            throw new ToastException('不支持的文件');
        }
        const ext = mime.getExtension(mime.getType(uri) ?? '');
        if (ext == 'webp') {
            const output = uri.replace(`.${ext}`, '.jpg');
            await format(uri, output);
            uri = output;
        }
        await MediaLibrary.saveToLibraryAsync(uri);
        return true;
    } catch (error: any) {
        console.log('saveToAlbum error', error);
        throw new ToastException(error?.message);
    }
}
const saveFile = async (data: string, name: string): Promise<string | null> => {
    if (data.startsWith('data')) {
        data = data.split(',')[1];
    }
    if (Platform.OS === 'android') {
        // 保存到相册
        const dir = await requestDirectoryPermission();
        if (!dir) {
            throw new ToastException('获取目录失败');
        }
        // 生成文件名 保存在缓存目录
        let path = `${dir}/${name}`;
        // 判断文件是否存在
        const exists = await RNFS.exists(path);
        if (exists) {
            console.log('文件已存在');
            // 在原来的文件名的基础上加上时间戳
            const time = new Date().getTime();
            const ext = path.split('.').pop();
            name = name.replace(`.${ext}`, `_${time}.${ext}`);
            path = `${dir}/${name}`;
        }
        await RNFS.writeFile(path, data, {
            encoding: 'base64',
        });
        return path;
    } else {
        let path = `${FileSystem.cacheDirectory}${name}`;
        const exists = await FileSystem.getInfoAsync(path);
        if (exists.exists) {
            const time = new Date().getTime();
            const ext = path.split('.').pop();
            path = path.replace(`.${ext}`, `_${time}.${ext}`);
        }
        await FileSystem.writeAsStringAsync(path, data, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return path;
    }
}
const getFileInfo = async (path: string) => {
    return await FileSystem.getInfoAsync(path, {
        size: true,
        md5: true,
    });
}
export default {
    chooseImage,
    uploadFile,
    getFullUrl,
    encryptFile,
    downloadFile,
    readFile,
    getEnFileContent,
    saveToAlbum,
    saveFile,
    getFileInfo,
    checkDownloadFileExists,
    decodeVideo,
    urlToPath,
    getFileNameSign,
    generateVideoThumbnail,
    cachePath,
    encryptVideo,
    checkExist,
    fileSplitDecode,
    fileSpliteEncode,
    uploadImage
}