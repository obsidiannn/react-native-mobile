import crypto from "react-native-quick-crypto";
import authService from "@/service/auth.service";
import RootSiblings from 'react-native-root-siblings';

import dayjs from 'dayjs'

const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// mongo id 生成，需要12位的随机数
const generateId = (): string => {
    return Buffer.from(crypto.randomBytes(12)).toString('hex')
}

const setWallet = async (_wallet: Wallet) => {
    globalThis.wallet = _wallet
    globalThis.currentUser = (await authService.info())
}
const currentUser = () => {
    if (globalThis.wallet && globalThis.wallet.address === globalThis.currentUser?.id) {
        return globalThis.currentUser
    }
    return null
}


export const showModels = (renderModel:any,elementRef:any) =>{
    // if (elementRef.current) {
    //     elementRef.current?.destroy();
    // }
    const onClose = () =>{
        elementRef?.destroy()
        elementRef = null
    }
    elementRef.current = new RootSiblings(renderModel(onClose))
    return onClose
}

// const refreshCurrentInfo = async () =>{
//     if(globalThis.wallet ){
//         const current = (await userApi.getBatchInfo({uids: [globalThis.wallet.address]})).items[0]
//         if(current){
//             setCurrent(current)
//         }
//     }
// }

const isNotBlank = (val: string) => {
    return val !== undefined && val !== null && val !== ''
}

const isBlank = (val: string | null) => {
    return !isNotBlank(val ?? '')
}

const dateFormat = (date: Date | null): string => {
    if (date === null || date === undefined) {
        return ''
    }
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
// 分转元
const changeF2Y = (amountCent: number|null|undefined):string => {
    if (amountCent === undefined || amountCent === null) {
        return '0.00'
    }
    return Number(amountCent/100).toFixed(2)
}


export default {
    bytesToSize,
    generateId,
    setWallet,
    currentUser,
    isNotBlank,
    isBlank,
    dateFormat,
    changeF2Y
    // refreshCurrentInfo
}