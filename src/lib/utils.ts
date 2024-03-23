import crypto from "react-native-quick-crypto";
import authService from "@/service/auth.service";
const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// mongo id 生成，需要12位的随机数

const generateId = () : string  =>{
    return Buffer.from( crypto.randomBytes(12)).toString('hex')
}

const setWallet = async (_wallet:Wallet) =>{
    globalThis.wallet = _wallet
    globalThis.currentUser = (await authService.info())
}
const currentUser = () =>{
    if(globalThis.wallet &&globalThis.wallet.address === globalThis.currentUser?.id){
        return globalThis.currentUser
    }
    return null
}

// const refreshCurrentInfo = async () =>{
//     if(globalThis.wallet ){
//         const current = (await userApi.getBatchInfo({uids: [globalThis.wallet.address]})).items[0]
//         if(current){
//             setCurrent(current)
//         }
//     }
// }

export default {
    bytesToSize,
    generateId,
    setWallet,
    currentUser,
    // refreshCurrentInfo
}