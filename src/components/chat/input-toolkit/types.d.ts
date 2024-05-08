import { RedPacketTypeEnum } from "@/api/types/enums";
import { RedPacketResp } from "@/api/types/red-packet";
import { UserInfoItem } from "@/api/types/user";
import dayjs from "dayjs";
export interface IMessageImage {
    w: number;
    h: number;
    thumbnail: string;
    original: string;
    t_md5: string;
    t_enc_md5: string;
    o_md5: string;
    o_enc_md5: string;
}
export interface IMessageAudio {
    duration: number;
    url: string;
    md5: string;
    enc_md5: string;
}
export interface IMessageVideo {
    w: number;
    h: number;
    thumbnail: string;
    original: string;
    t_md5: string;
    t_enc_md5: string;
    o_md5: string;
    o_enc_md5: string;
    duration: number;
    path?: string
    trans?: string;
    original_thumbnail?: string
}
export interface IMessageFile {
    mime: string;
    name: string;
    size: number;
    path: string;
    enc_md5: string;
    md5: string;
}
export interface IMessageSwap {
    remark: string
    amount: number
    uid: string // 接收人
}

export interface IMessageRedPacket {
    remark: string
    sender: string
    packetId: string
    type: RedPacketTypeEnum
    objUId?: string
    objUName?: string
    pkInfo?: RedPacketResp
    stateFunc?: (state: number) => void
}


export type IMessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'swap' | 'gswap' | 'packet' | 'gpacket';
export interface IMessageTypeMap {
    text: string;
    image: IMessageImage;
    video: IMessageVideo;
    audio: IMessageAudio;
    file: IMessageFile;
    swap: IMessageSwap;
    gswap: IMessageSwap;
    packet: IMessageRedPacket;
    gpacket: IMessageRedPacket;
}
type DataType = keyof IMessageTypeMap;
export interface IMessage<T extends DataType> {
    mid: string;
    type: T;
    sequence?: number;
    user?: UserInfoItem;
    time: dayjs.Dayjs;
    state: number; // 0: 發送中 1: 發送成功 2: 發送失敗
    data: IMessageTypeMap[T];
}