import crypto from "react-native-quick-crypto";

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

export default {
    bytesToSize,
    generateId
}