import { BillInOutEnum, BillStatusEnum, BillTypeEnum } from "@/api/types/enums"

const billTypeTransfer = (type: number): string => {
    switch (type) {
        case BillTypeEnum.FILL_IN:
            return "充值"
        case BillTypeEnum.DRAW_CASH:
            return "提现"
        case BillTypeEnum.REMIT:
            return "转账"
        case BillTypeEnum.RED_PACKET:
            return "红包"
        case BillTypeEnum.GROUP_INCOME:
            return "群收款"
        case BillTypeEnum.GROUP_REFUND:
            return "群退款"
        case BillTypeEnum.GROUP_DRAW_CASH:
            return "群提现"
        default:
            return "uknown"
    }
}

export interface StatusItem {
    title: string
    color: string
}

const billStatusTransfer = (type: number, status: number,inout?: number): StatusItem => {
    if (type === BillTypeEnum.DRAW_CASH || type === BillTypeEnum.GROUP_DRAW_CASH) {
        switch (status) {
            case BillStatusEnum.FAIL:
                return { title: "提现失败", color: '#C20C00' }
            case BillStatusEnum.NEED_PAY:
            case BillStatusEnum.PENDING:
                return { title: "提现中", color: '#00C013' }
            case BillStatusEnum.SUCCESS:
                return { title: "提现完成", color: '#4B5563' }
        }
    }
    if(type === BillTypeEnum.RED_PACKET){
        if(inout){
            if(inout === BillInOutEnum.INCOME){
                switch (status) {
                    case BillStatusEnum.FAIL:
                        return { title: "领取失败", color: '#C20C00' }
                    case BillStatusEnum.NEED_PAY:
                    case BillStatusEnum.PENDING:
                        return { title: "领取中", color: '#00C013' }
                    case BillStatusEnum.SUCCESS:
                        return { title: "领取完成", color: '#4B5563' }
                }
            }else{
                switch (status) {
                    case BillStatusEnum.FAIL:
                        return { title: "发送失败", color: '#C20C00' }
                    case BillStatusEnum.NEED_PAY:
                    case BillStatusEnum.PENDING:
                        return { title: "发送中", color: '#00C013' }
                    case BillStatusEnum.SUCCESS:
                        return { title: "发送完成", color: '#4B5563' }
                }
            }
        }
    }

    return { title: '', color: 'black' }
}

export default {
    billTypeTransfer,
    billStatusTransfer
}