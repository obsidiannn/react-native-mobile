import messageApi from "../api/v2/message"
import ToastException from "../exception/toast-exception";
import quickAes from "../lib/quick-aes";
import dayjs from 'dayjs';
import userService from "./user.service";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import fileService, { format, formatVideo, uploadFile } from "./file.service";
import { DataType, IMessage, IMessageRedPacket, IMessageSwap, IMessageTypeMap } from "@/components/chat/input-toolkit/types";
import { MessageTypeEnum } from "@/api/types/enums";
import { MessageDetailItem, MessageExtra, MessageListItem } from "@/api/types/message";
import { WalletRemitReq, WalletRemitResp } from "@/api/types/wallet";
import walletApi from '@/api/v2/wallet'
import { RedPacketCreateReq, RedPacketInfo } from "@/api/types/red-packet";
import redPacketApi from "@/api/v2/red-packet";
import { deleteMessageByChatId, query as messageQueryPage, saveBatch as messageSaveBatch } from '@/lib/database/services/Message'

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
    return await messageApi.sendMessage({
        id: mid,
        chatId: chatId,
        type,
        isEnc: 1,
        content: quickAes.En(JSON.stringify(data), key),
    });
}

const doRemit = async (req: WalletRemitReq, key: string, swapType: 'swap' | 'gswap'): Promise<WalletRemitResp> => {
    const data: IMessageSwap = {
        remark: req.remark ?? '',
        amount: req.amount,
        uid: req.objUId
    }
    const remitReq: WalletRemitReq = {
        ...req,
        content: quickAes.En(JSON.stringify({ t: swapType, d: data }), key),
    }
    return await walletApi.doRemit(remitReq)
}

// 發紅包消息
const doRedPacket = async (req: RedPacketCreateReq, key: string, packetType: 'packet' | 'gpacket'): Promise<RedPacketInfo> => {
    const data: IMessageRedPacket = {
        remark: req.remark,
        sender: req.sender ?? '',
        packetId: '',
        type: req.type
    }
    const rpReq: RedPacketCreateReq = {
        ...req,
        content: quickAes.En(JSON.stringify({ t: packetType, d: data }), key),
    }
    return await redPacketApi.doRedPacket(rpReq)
}


const sendText = async (chatId: string, key: string, message: IMessage<'text'>) => {
    const data = {
        t: 'text',
        d: message.data,
    }
    const res = await _send(chatId, key, message.mid, MessageTypeEnum.NORMAL, data);
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
    const result = await _send(chatId, key, message.mid, MessageTypeEnum.NORMAL, {
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
        const result = await _send(chatId, key, message.mid, MessageTypeEnum.NORMAL, {
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


const sendVideo = async (chatId: string, key: string, message: IMessage<'video'>) => {
    const file = message.data;
    if (!file) {
        throw new ToastException('文件不能为空');
    }
    try {
        const date = dayjs().format('YYYY/MM/DD');
        const fileKey = `upload/chat/video/${date}/${message.mid}.enc`;
        const thumbnailKey = `upload/chat/video/${date}/thumbnail_${message.mid}.webp`;

        const transFilePath = fileService.cachePath() + message.mid + '_trans.mp4'
        await formatVideo(file.original, transFilePath)

        const fileEnc = await fileService.fileSpliteEncode(fileKey, transFilePath, key);
        await uploadFile(fileEnc.path, fileKey);
        if ((file.thumbnail ?? null) !== null) {
            const thumbEnc = await fileService.encryptFile(file.thumbnail, key);
            await uploadFile(thumbEnc.path, thumbnailKey);
            file.thumbnail = thumbnailKey
        }
        file.t_md5 = fileEnc.enc_md5;
        file.o_md5 = fileEnc.md5;
        file.trans = transFilePath

        const result = await _send(chatId, key, message.mid, MessageTypeEnum.NORMAL, {
            t: 'video',
            d: {
                ...file,
                path: fileKey,
                thumbnail: thumbnailKey
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
        console.log('发送视频 error', error);
    }
}

const send = async (chatId: string, key: string, message: IMessage<DataType>) => {
    switch (message.type) {

        case 'text':
            return await sendText(chatId, key, message as IMessage<'text'>);
        case 'image':
            return await sendImage(chatId, key, message as IMessage<'image'>);
        case 'video':
            return await sendVideo(chatId, key, message as IMessage<'video'>);
        // case 'audio':
        //     return await sendAudio(chatId, key, message);
        case 'file':
            return await sendFile(chatId, key, message as IMessage<'file'>);
        default:
            throw new ToastException('不支持的消息类型');
    }
}
const decrypt = (key: string, content: string) => {
    try {
        const data = quickAes.De(content, key);
        return JSON.parse(data) as { t: string, d: any };
    } catch (error) {
    }
    return {
        t: 'text',
        d: '解密失败'
    }
}


const getListFromDb = async (
    chatId: string,
    sequence: number,
    direction: 'up' | 'down',
    limit: number,
    key: string
): Promise<IMessage<DataType>[]> => {
    const queryParam = {
        chatId: chatId,
        sequence: sequence,
        direction: direction,
        limit: limit
    }
    const list = await messageQueryPage(queryParam)
    
    const result = list.map(l=>{
        const _data = decrypt(key, l.data ?? '');
        const _d = _data.d as IMessageTypeMap[DataType]
        if (l.type === MessageTypeEnum.RED_PACKET) {
            _d.packetId = l.packetId
        }
        return {
            ...l,
            data: _d
        }
    })
    console.log('讀取',result);
    return result
}

const checkDiffFromWb = (
    data: IMessage<DataType>[],
    _seq: number,
    direction: string,
    _limit: number
): { seq: number, limit: number } => {
    if (data !== undefined && data !== null && data.length > 0) {
        const lastSeq = data[data.length - 1].sequence ?? 1
        if (data.length === _limit || lastSeq <= 1) {
            return { seq: 0, limit: -1 }
        }
        return { seq: lastSeq, limit: _limit - data.length }
    }
    return { seq: _seq, limit: _limit }
}

/**
 * 获取消息列表
 * @param chatId 
 * @param key 
 * @param sequence 
 * @param direction 
 * @returns 
 */
const getList = async (
    chatId: string,
    key: string,
    sequence: number,
    direction: 'up' | 'down',
): Promise<IMessage<DataType>[]> => {
    
    // await deleteMessageByChatId(chatId)
    const list = await getMessageDetails(chatId, key, sequence, direction)
    const userIds: string[] = []
    list.forEach(d => {
        if (d.uid !== undefined && d.uid !== null) {
            userIds.push(d.uid ?? '')
        }
    })
    const userHash = await userService.getUserHash(userIds)
    return list.map((item) => {
        const user = userHash.get(item?.uid ?? '')
        return {
            ...item,
            user: user
        }
    });
}

const getMessageDetails = async (
    chatId: string,
    key: string,
    sequence: number,
    direction: 'up' | 'down',
): Promise<IMessage<DataType>[]> => {
    if (chatId === '') {
        return []
    }
    const _limit = 20
    const list = await getListFromDb(chatId, sequence, direction, _limit,key)
    const checkResult = checkDiffFromWb(list, sequence, direction, _limit)
    console.log('檢查',checkResult);
    
    if (checkResult.limit < 0) {
        // 無需請求遠端
        return list
    } else if (checkResult.limit < _limit) {
        // // 存在部分情況
        // if (direction === 'up' ) {
        //     if(sequence - _limit < 1)
        //     // 這種也無需請求遠端
        //     return list
        // }
    }

    const data = await messageApi.getMessageList({
        chatId,
        limit: checkResult.limit,
        sequence: checkResult.seq,
        direction,
    });
    if (data.items.length <= 0) {
        return []
    }
    const mids: string[] = data.items.map(i => i.msgId)
    const details = await messageApi.getMessageDetail({ chatId, ids: mids })
    const messageHash = new Map<string, MessageDetailItem>();
    details.items.forEach(d => {
        messageHash.set(d.id, d)
    })
    const remoteData = data.items.map(item => {
        const detail = messageHash.get(item.msgId)
        const _data = decrypt(key, detail?.content ?? '');
        const t = _data.t as DataType;
        const _d = _data.d as IMessageTypeMap[DataType]
        const time = dayjs(item.createdAt)

        if (detail?.type === MessageTypeEnum.RED_PACKET) {
            const extra = JSON.parse(String(detail.extra));
            console.log('packetId ===', extra.id);
            _d.packetId = extra.id
        }

        return {
            mid: item.id,
            type: t,
            data: _d,
            content: detail?.content,
            state: 1,
            time,
            sequence: item.sequence,
            uid: detail?.fromUid
        };
    })
    messageSaveBatch(remoteData, chatId)
    return list.concat(remoteData)
};



const removeBatch = async (chatId: string, mids: string[]) => {
    return true;
}

// 清除所有消息
const clearAll = async () => {
    return true;
}
export default {
    getList,
    removeBatch,
    clearAll,
    send,
    doRemit,
    doRedPacket
}