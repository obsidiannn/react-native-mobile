import messageApi from "../api/v2/message"
import ToastException from "../exception/toast-exception";
import quickAes from "../lib/quick-aes";
import dayjs from 'dayjs';
import userService from "./user.service";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import fileService, { format, uploadFile } from "./file.service";
import { DataType, IMessage, IMessageTypeMap } from "@/components/chat/input-toolkit/types";
import { MessageTypeEnum } from "@/api/types/enums";
const _send = async (chatId: string, key: string, mid: string, type: MessageTypeEnum, data: {
    t: string;
    d: any;
}) => {
    if (!data.d) {
        throw new ToastException('消息内容不能为空');
    }
    if (!globalThis.wallet) {
        throw new ToastException('请先登录');
    }
    console.log('send', data);
    return await messageApi.sendMessage({
        id: mid,
        chatId: chatId,
        type,
        isEnc: 1,
        content: quickAes.En(JSON.stringify(data), key),
    });
}
const sendText = async (chatId: string, key: string, message: IMessage<'text'>) => {
    const data = {
        t: 'text',
        d: message.data,
    }
    const res = await _send(chatId, key, message.mid,MessageTypeEnum.NORMAL, data);
    message.sequence = res.sequence;
    return {
        ...res,
        data: {}
    };
}
const sendImage = async (chatId: string, key: string, message: IMessage<'image'>) => {
    const img = message.data;
    if (!img) {
        throw new ToastException('图片不能为空');
    }
    const thumbnail = await manipulateAsync(img.original, [{ resize: { width: 200 } }], {
        compress: 0.5,
        format: SaveFormat.JPEG,
    });
    const original = await manipulateAsync(img.original, [], {
        compress: 1,
        format: SaveFormat.PNG,
    });
    const originalExt = img.original.split('.').pop() ?? '';
    const thumbnailExt = thumbnail.uri.split('.').pop() ?? '';
    const originalWebp = img.original.replace(originalExt, 'webp');
    const thumbnailWebp = thumbnail.uri.replace(thumbnailExt, 'webp');
    console.log('original', original)
    await format(original.uri, originalWebp);
    console.log('thumbnail.uri', thumbnail.uri)
    await format(thumbnail.uri, thumbnailWebp);
    const thumbnailEnc = await fileService.encryptFile(thumbnailWebp, key);
    const originalEnc = await fileService.encryptFile(originalWebp, key);
    const date = dayjs().format('YYYY/MM/DD');
    const thumbnailKey = `upload/chat/thumbnail/${date}/${message.mid}.webp`;
    const originalKey = `upload/chat/original/${date}/${message.mid}.webp`;
    await uploadFile(thumbnailEnc.path, thumbnailKey);
    await uploadFile(originalEnc.path, originalKey);
    const result = await _send(chatId, key, message.mid,MessageTypeEnum.NORMAL, {
        t: 'image',
        d: {
            t_md5: thumbnailEnc.md5,
            o_md5: originalEnc.md5,
            w: img.w,
            h: img.h,
            thumbnail: thumbnailKey,
            original: originalKey,
        }
    });
    return {
        ...result,
        data: {
            w: img.w,
            h: img.h,
            thumbnail: thumbnailKey,
            original: originalKey,
            t_md5: thumbnailEnc.md5,
            o_md5: originalEnc.md5,
        } as IMessage<'image'>['data']
    }
}

const sendFile = async (chatId: string, key: string, message: IMessage<'file'>) => {
    const file = message.data;
    if (!file) {
        throw new ToastException('文件不能为空');
    }
    console.log('发送文件 file', file);
    try {
        const fileEnc = await fileService.encryptFile(file.path, key);
        const date = dayjs().format('YYYY/MM/DD');
        const fileKey = `upload/chat/file/${date}/${message.mid}.enc`;
        await uploadFile(fileEnc.path, fileKey);
        file.enc_md5 = fileEnc.enc_md5;
        file.md5 = fileEnc.md5;
        const fileInfo = await fileService.getFileInfo(file.path);
        fileInfo?.exists && (file.md5 = fileInfo.md5 ?? '');
        console.log('处理完成准备发送', file);
        const result = await _send(chatId, key, message.mid,MessageTypeEnum.NORMAL, {
            t: 'file',
            d: {
                ...file,
                path: fileKey,
            }
        });
        return {
            ...result,
            path: fileKey,
            data: {
                ...file,
                path: fileKey,
            }
        }
    } catch (error) {
        console.log('发送文件 error', error);
    }
}
const send = async (chatId: string, key: string, message: IMessage<DataType>) => {
    switch (message.type) {

        case 'text':
            return await sendText(chatId, key, message as IMessage<'text'>);
        case 'image':
            return await sendImage(chatId, key, message as IMessage<'image'>);
        // case 'video':
        //     return await sendVideo(chatId, key, message);
        // case 'audio':
        //     return await sendAudio(chatId, key, message);
        case 'file':
            return await sendFile(chatId, key, message as IMessage<'file'>);
        default:
            throw new ToastException('不支持的消息类型');
    }
}
const decrypt = (key: string, content: string) => {
    const data = quickAes.De(content, key);
    try {
        return JSON.parse(data) as { t: string, d: any };
    } catch (error) {
        return {
            t: 'text',
            d: '解密失败'
        }
    }
}
const getList = async (chatId: string, key: string, sequence: number, direction: 'up' | 'down'): Promise<IMessage<DataType>[]> => {
    const data = await messageApi.getMessageList({
        chatId,
        limit: 20,
        sequence,
        direction,
    });
    const users = await userService.getBatchInfo(data.items.map((item) => item.from_uid));
    return data.items.map((item) => {
        const data = decrypt(key, item.content);
        const t = data.t as DataType;

        const time = dayjs(item.create_time)
        const user = users.find((user) => user.id === item.from_uid)
        return {
            mid: item.id,
            type: t,
            data: data.d as IMessageTypeMap[DataType],
            state: 1,
            time,
            user,
            sequence: item.sequence
        };
    });
};
const removeBatch = async (chatId: string, mids: string[]) => {
    return true;
}
const clearAll = async (cids: string[]) => {
    return true;
}
export default {
    getList,
    removeBatch,
    clearAll,
    send
}