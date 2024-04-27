import { createRequestInstance } from "../lib/request";
import { BaseIdReq, BasePageResp } from "../types/common";
import { RedPacketCreateReq, RedPacketDetail, RedPacketInfo, RedPacketResp, RedPacketTouchResult } from "../types/red-packet";

const doRedPacket = (data:RedPacketCreateReq) :Promise<RedPacketInfo> =>{
    return createRequestInstance(true).post('/red-packet/create',data);
}
// 紅包摘要
const detail = (data:BaseIdReq) :Promise<RedPacketDetail> =>{
    return createRequestInstance(true).post('/red-packet/detail',data);
}

// 紅包摘要
const packetInfo = (data:BaseIdReq) :Promise<RedPacketResp> =>{
    return createRequestInstance(true).post('/red-packet/info',data);
}

// 领取
const touchPacket = (data: BaseIdReq):Promise<RedPacketTouchResult> =>{
    return createRequestInstance(true).post('/red-packet/touch',data);
}

export default {
    doRedPacket,
    packetInfo,
    touchPacket,
    detail
}