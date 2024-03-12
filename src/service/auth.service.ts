import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { deleteAccount, writeAccount } from "../lib/account";
import authApi from "../api/auth";
import { Wallet } from 'ethers';
import dayjs from 'dayjs';
import Crypto from 'react-native-quick-crypto';
import { format, uploadFile } from './file.service';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { UserInfo } from '../api/user';

// 注册
const register = async (password: string): Promise<Wallet | null> => {
    try {
        const mn = bip39.generateMnemonic(wordlist);
        const wallet = await writeAccount(password, mn);
        globalThis.wallet = wallet;
        await authApi.register();
        return wallet;
    } catch (error) {
        globalThis.wallet = null;
        deleteAccount(password);
        return null;
    }
}
const updateName = async (name: string): Promise<null> => {
    return await authApi.updateName(name);
}
const updateGender = async (gender: number): Promise<null> => {
    return await authApi.updateGender(gender);
}
const updateSign = async (sign: string):  Promise<null> => {
    return await authApi.updateSign(sign);
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
    await authApi.updateAvatar(avatar);
    return avatar;
}
const logout = (password: string) => {
    return true;
}
const info = async (): Promise<UserInfo> => {
    return await authApi.info();
}
export default {
    register,
    updateName,
    updateGender,
    updateAvatar,
    info,
    updateSign
}