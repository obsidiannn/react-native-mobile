import { BillInOutEnum, BillTypeEnum } from "./enums"
import { BasePageReq,BasePageResp  } from '../types/common'

export interface WalletRecordPageResp<T> extends BasePageResp<T> {
    incomeTotal: number
    outcomeTotal: number
  }

export interface WalletDetailResp {
    balance: number
    currency: number
    type: number
}

export interface WalletItem {
    id: string
    title: string
    amount: number
    time: string
    type: number
    status: number
    showType?: string
}

export interface BillRecordReq extends BasePageReq {
    inOut?: BillInOutEnum
    types?: BillTypeEnum[]
}


export interface BillRecordItem {
    id: string
    type: number
    inOut: number
    amount: number
    status: number
    createdAt: Date
}


export interface BillDetailResp extends BillRecordItem {
    uid: string
    from: string
    to: string
    businessId?: string | null
    businessType?: number | null
    businessIcon?: string | null
    businessLabel?: string | null
    remark: string | null
    transactionNo: string | null
    sellerNo: string | null
}