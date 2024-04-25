import { RedPacketSourceEnum,RedPacketTypeEnum } from "./enums"

export interface RedPacketCreateReq {
    id: string
    type: RedPacketTypeEnum
    sourceType: RedPacketSourceEnum
    packetCount: number
    remark: string
    singleAmount?: number
    totalAmount?: number
    objUIds?: string[]
    groupId?: string
    content?: string
    sender?: string
};

export interface RedPacketInfo {
    chatId: string
    msgId: string
    sequence: number
    packetId: string
    createdAt: Date
    fromUid: string
    remark: string
    // enable: boolean
    // expiredFlag: boolean
};

export interface RedPacketRecordTempDto {
    id: string
    uid: string | null
    status: number
}

export interface RedPacketResp {
    packetId: string
    enable: boolean
    expiredFlag: boolean
    createdAt: Date
    expireSecond: number
}

export interface RedPacketReq {
    msgId: string
    packetId: string
}

export interface RedPacketRecordItem {
    uid?: string | null
    uidDesc?: string | null
    avatar?: string | null
    amount?: number | null
    recordAt: Date | null
    status: number
};

export interface RedPacketDetail {
    packetId: string
    packetCount: number
    totalAmount: number
    type: RedPacketTypeEnum
    createdBy?: string
    createdUid: string
    createdAt: Date
    createdAvatar?: string
    expireSeconds: number
    enable: boolean
    expiredFlag: boolean
    remark: string
    records: RedPacketRecordItem[]
}
