import { createRequestInstance } from "../lib/request";
import { BaseIdReq, BasePageResp } from "../types/common";
import { RedPacketCreateReq, RedPacketInfo, RedPacketResp } from "../types/red-packet";

const doRedPacket = (data:RedPacketCreateReq) :Promise<RedPacketInfo> =>{
    return createRequestInstance(true).post('/red-packet/create',data);
}
// 紅包摘要
const packetInfo = (data:BaseIdReq) :Promise<RedPacketResp> =>{
    return createRequestInstance(true).post('/red-packet/info',data);
}
export default {
    doRedPacket,
    packetInfo,
}