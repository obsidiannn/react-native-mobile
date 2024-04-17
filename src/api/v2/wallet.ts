import { createRequestInstance } from "../lib/request";
import { BaseIdReq, BasePageResp } from "../types/common";
import { BillDetailResp, BillRecordItem, BillRecordReq, WalletDetailResp } from "../types/wallet";

// 我的钱包详情
const mineWalletDetail = (): Promise<WalletDetailResp> => {
    return createRequestInstance(true).post('/wallet/detail');
}

const billRecordPage = (data: BillRecordReq):Promise<BasePageResp<BillRecordItem>> =>{
    return createRequestInstance(true).post('/bill/records',data);
}

const billDetail = (data: BaseIdReq):Promise<BillDetailResp> =>{
    return createRequestInstance(true).post('/bill/detail',data);
}

export default {
    mineWalletDetail,
    billRecordPage,
    billDetail
}