import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { deleteAccount, writeAccount } from "../lib/account";
import authApi from "../api/v2/auth";
import { Wallet } from 'ethers';
import dayjs from 'dayjs';
import Crypto from 'react-native-quick-crypto';
import { format, uploadFile } from './file.service';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { UserInfoItem } from '../api/types/user';

// 注册
const register = async (password: string): Promise<Wallet | null> => {
    try {
        const mn = bip39.generateMnemonic(wordlist);
        const wallet = await writeAccount(password, mn);
        globalThis.wallet = wallet;
        await authApi.register();
        return wallet;
    } catch (error) {
        console.error(error);
        globalThis.wallet = null;
        deleteAccount(password);
        return null;
    }
}
const updateName = async (name: string): Promise<void> => {
     await authApi.changeName({name});
}
const updateGender = async (gender: number): Promise<void> => {
     await authApi.changeGender({gender});
}
const updateSign = async (sign: string):  Promise<void> => {
     await authApi.changeSign({sign});
}
const updateAvatar = async (avatar: string): Promise<string> => {
    // 判断是否为upload开头
    if (avatar.startsWith('file:/')) {
        const uuid = (await Crypto.randomUUID()).replace(/-/g, '');
        const date = dayjs().format('YYYY/MM/DD');
        const key = `upload/avatar/${date}/${uuid}.webp`;
        const manipResult = await manipulateAsync(
            avatar,
            [
                { resize: { width: 200 } },
            ],
            { compress: 1, format: SaveFormat.JPEG }
        );
        const webpOutput = manipResult.uri.replace(/\.jpg$/, '.webp');
        if (await format(manipResult.uri, webpOutput)) {
            FileSystem.deleteAsync(avatar);
            avatar = webpOutput;
        }
        await uploadFile(avatar, key);
        avatar = key;
    }
    await authApi.changeAvatar({avatar});
    return avatar;
}

// 登出
const logout = (password: string) => {
    return true;
}
// 当前登录人详情
const info = async (): Promise<UserInfoItem> => {
    return await authApi.userInfo();
}
export default {
    register,
    updateName,
    updateGender,
    updateAvatar,
    info,
    updateSign
}