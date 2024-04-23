import { createRequestInstance } from "../lib/request";
import { BaseIdReq, BasePageResp } from "../types/common";
import { BillDetailResp, BillRecordItem, BillRecordReq, WalletDetailResp, WalletRecordPageResp, WalletRemitReq, WalletRemitResp } from "../types/wallet";

// 我的钱包详情
const mineWalletDetail = (): Promise<WalletDetailResp> => {
    return createRequestInstance(true).post('/wallet/detail');
}

const billRecordPage = (data: BillRecordReq):Promise<WalletRecordPageResp<BillRecordItem>> =>{
    return createRequestInstance(true).post('/bill/records',data);
}

const billDetail = (data: BaseIdReq):Promise<BillDetailResp> =>{
    return createRequestInstance(true).post('/bill/detail',data);
}

// 发起转账
const doRemit = (data: WalletRemitReq): Promise<WalletRemitResp>=>{
    return createRequestInstance(true).post('/wallet/remit',data);
}

export default {
    mineWalletDetail,
    billRecordPage,
    billDetail,
    doRemit
}