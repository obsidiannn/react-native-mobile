import crypto from "react-native-quick-crypto";
import { globalStorage } from "./storage";
import quickAes from "./quick-aes";
import * as bip39 from '@scure/bip39';
import { HDKey } from "@scure/bip32";
import { ethers } from "ethers";
import ToastException from "../exception/toast-exception";
type AccountListData = Array<number | string | string[] | string[]>;
const hash = crypto.createHash('sha256');
const STORAGE_KEY = 'account-data-list';
const getAccountDataList = async () => {
    let accountListStr = await globalStorage.getString(STORAGE_KEY);
    if (!accountListStr) {
        const salt = Buffer.from(crypto.randomBytes(16)).toString('hex');
        return [salt, 0, [], []] as AccountListData;
    }
    const data = JSON.parse(accountListStr) as AccountListData;
    return data;
}

export const writeAccount = async (password: string, mn: string) => {
    if (password.length < 6) {
        throw new ToastException('密码不能小于6位');
    }
    let accountList: AccountListData = await getAccountDataList();
    const salt = accountList[0] as string;
    const accountNumber = accountList[1] as number;
    if (accountNumber >= 6) {
        throw new ToastException('账号数量已达上限');
    }
    const passwordHash = hash.update(password.substring(0, 3) + salt).digest('hex');
    const passwordHashList = accountList[2] as string[];
    const mnList = accountList[3] as string[];
    const passwordHashIndex = passwordHashList.indexOf(passwordHash);
    if (passwordHashIndex !== -1) {
        throw new ToastException('账号索引已存在,请重新设置密码');
    }
    passwordHashList.push(passwordHash);
    const key = password + salt;
    const enMn = quickAes.En(mn, key);
    mnList.push(enMn);

    accountList[1] = passwordHashList.length;
    accountList[2] = passwordHashList;
    accountList[3] = mnList;
    globalStorage.setItem(STORAGE_KEY, JSON.stringify(accountList));
    const priKey = HDKey.fromMasterSeed(await bip39.mnemonicToSeed(mn)).privateKey;
    if (!priKey) {
        throw new ToastException('私钥错误');
    }
    return new ethers.Wallet(Buffer.from(priKey).toString('hex'));
}
export const readMN = async (password: string) => {
    const accountList = await getAccountDataList();
    if (accountList.length === 0) {
        throw new ToastException('账号列表为空');
    }
    const salt = accountList[0] as string;
    const passwordHash = hash.update(password.substring(0, 3) + salt).digest('hex');
    const passwordHashList = accountList[2] as string[];
    const mnList = accountList[3] as string[];
    const passwordHashIndex = passwordHashList.indexOf(passwordHash);
    if (passwordHashIndex === -1) {
        throw new ToastException('账号索引不存在');
    }
    return quickAes.De(mnList[passwordHashIndex], password + salt);
}
export const readAccount = async (password: string) => {
    console.log('read:' + password);
    
    const mn = await readMN(password);
    try {
        const priKey = HDKey.fromMasterSeed(await bip39.mnemonicToSeed(mn)).privateKey;
        if (!priKey) {
            throw new ToastException('私钥不存在');
        }
        return new ethers.Wallet(Buffer.from(priKey).toString('hex'));
    } catch(err) {
        console.log(err);
        throw new ToastException('密码错误');
    }
}

export const deleteAccount = async (password: string) => {
    const accountList = await getAccountDataList();
    const salt = accountList[0] as string;
    const mnList = accountList[3] as string[];
    const passwordHash = hash.update(password.substring(0, 3) + salt).digest('hex');
    const passwordHashList = accountList[2] as string[];
    const passwordHashIndex = passwordHashList.indexOf(passwordHash);
    if (passwordHashIndex === -1) {
        return true;
    }
    passwordHashList.splice(passwordHashIndex, 1);
    mnList.splice(passwordHashIndex, 1);
    accountList[1] = passwordHashList.length;
    accountList[2] = passwordHashList;
    accountList[3] = mnList;
    globalStorage.setItem(STORAGE_KEY, JSON.stringify(accountList));
    return true;
}
export const clearAccountDataList = () => {
    return globalStorage.removeItem(STORAGE_KEY);
}

export const isEmptyAccountDataList = async () => {
    //clearAccountDataList();
    const accountList = await getAccountDataList();
    return (accountList[1] as number) > 0;
}
export const handleAddress = (address: string) => {
    if (address.length < 15) {
        return address;
    }
    return address.slice(0, 7) + '...' + address.slice(-8);
}