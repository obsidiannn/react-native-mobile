import crypto from "react-native-quick-crypto";
import fileService from "@/service/file.service";
import * as FileSystem from 'expo-file-system';
import {NativeModules} from 'react-native'
const { RNFS } = NativeModules

const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// mongo id 生成，需要12位的随机数

const generateId = () : string  =>{
    return Buffer.from( crypto.randomBytes(12)).toString('hex')
}



const getEnVideoContent = async (uri: string, encKey: string): Promise<string | null> => {
    const data = await fileService.getEnFileContent(uri,encKey)
    if(data !== null){
        const name = fileService.getFileNameSign(uri)
        const path =`${FileSystem.cacheDirectory}/${name}_decode.mp4`;
        const exists = await (path);
        if (exists) {
            console.log('文件已存在');
            await FileSystem.deleteAsync(path)
        }
        const binArray = new Uint8Array(Buffer.from(data,'base64'))
        await RNFS.writeFile(path,binArray,{encoding: 'binary'})
        return path
    }
    return null
}

export default {
    bytesToSize,
    generateId,
    getEnVideoContent
}