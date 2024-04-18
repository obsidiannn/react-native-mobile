import { BillInOutEnum, BillStatusEnum, BillTypeEnum } from "@/api/types/enums"

const billTypeTransfer = (type: number): string => {
    switch (type) {
        case BillTypeEnum.FILL_IN:
            return "充值"
        case BillTypeEnum.DRAW_CASH:
            return "提現"
        case BillTypeEnum.REMIT:
            return "轉賬"
        case BillTypeEnum.RED_PACKET:
            return "紅包"
        case BillTypeEnum.GROUP_INCOME:
            return "羣收款"
        case BillTypeEnum.GROUP_REFUND:
            return "羣退款"
        case BillTypeEnum.GROUP_DRAW_CASH:
            return "羣提現"
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
                return { title: "提現失敗", color: '#C20C00' }
            case BillStatusEnum.NEED_PAY:
            case BillStatusEnum.PENDING:
                return { title: "提現中", color: '#00C013' }
            case BillStatusEnum.SUCCESS:
                return { title: "提現完成", color: '#4B5563' }
        }
    }
    if(type === BillTypeEnum.RED_PACKET){
        if(inout){
            if(inout === BillInOutEnum.INCOME){
                switch (status) {
                    case BillStatusEnum.FAIL:
                        return { title: "領取失敗", color: '#C20C00' }
                    case BillStatusEnum.NEED_PAY:
                    case BillStatusEnum.PENDING:
                        return { title: "領取中", color: '#00C013' }
                    case BillStatusEnum.SUCCESS:
                        return { title: "領取完成", color: '#4B5563' }
                }
            }else{
                switch (status) {
                    case BillStatusEnum.FAIL:
                        return { title: "發送失敗", color: '#C20C00' }
                    case BillStatusEnum.NEED_PAY:
                    case BillStatusEnum.PENDING:
                        return { title: "發送中", color: '#00C013' }
                    case BillStatusEnum.SUCCESS:
                        return { title: "發送完成", color: '#4B5563' }
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