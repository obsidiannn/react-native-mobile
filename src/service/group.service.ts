import groupApi from "../api/v2/group";

import Crypto from "react-native-quick-crypto";
import * as bip39 from '@scure/bip39';
import { HDKey } from "@scure/bip32";
import { ethers } from "ethers";
import { wordlist } from '@scure/bip39/wordlists/english';
import quickAes from "../lib/quick-aes";
import { SelectMemberOption } from "@/components/select-member-modal";
import { CommonEnum } from "@/api/types/common";

import { GroupApplyJoinReq, GroupCreateReq, GroupDetailItem, GroupInfoItem } from "@/api/types/group";
const quit = async (gid: string) => {
    return true;
}
const quitAll = async () => {
    return true;
}

const create = async (name: string, avatar: string) => {
    if (!globalThis.wallet) {
        throw new Error('请先登录');
    }
    const mn = bip39.generateMnemonic(wordlist);
    const priKey = HDKey.fromMasterSeed(await bip39.mnemonicToSeed(mn)).privateKey;
    if (!priKey) {
        throw new Error('私钥错误');
    }
    const wallet = new ethers.Wallet(Buffer.from(priKey).toString('hex'));
    const pub = wallet.signingKey.compressedPublicKey;
    const selfPub = globalThis.wallet.signingKey.compressedPublicKey;
    const pri = wallet.signingKey.privateKey;

    const key = Buffer.from(Crypto.randomBytes(16)).toString('hex');
    console.log('group key@@@@@@@@@@@@@@', key);
    const sharedSecret = wallet.signingKey.computeSharedSecret(Buffer.from(selfPub.substring(2), 'hex')).substring(4);
    const enc_pri = quickAes.En(pri, sharedSecret);
    const enc_key = quickAes.En(key, sharedSecret);
    // const group = {
    //     id: Crypto.randomUUID(),
    //     name,
    //     avatar,
    //     enc_pri,
    //     pub,
    //     enc_key,
    // }
    const group:GroupCreateReq = 
    {
        id: Crypto.randomUUID(),
        pubKey: pub,
        avatar: avatar,
        name: name,
        isEnc: CommonEnum.ON,
        type: 1,
        banType: 0,
        searchType: 0,
    }

    await groupApi.create(group);
    return group;
}

const invite = async (gid: string, members: SelectMemberOption[]) => {
    const enc = await encInfo(gid);
    const group = await getInfo(gid);
    if (!globalThis.wallet || !group) {
        return;
    }
    const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(Buffer.from(group.pub.substring(2), 'hex')).substring(4);
    
    const pri = quickAes.De(enc.enc_pri, sharedSecret);
    const key = quickAes.De(enc.enc_key, sharedSecret);
    const groupWallet = new ethers.Wallet(pri);
    const items: {
        uid: string;
        enc_key: string;
    }[] = [];
    members.forEach(member => {
        const sk = groupWallet.signingKey.computeSharedSecret(Buffer.from(group.pub.substring(2), 'hex')).substring(4);
        const enkey = quickAes.En(sk, key);
        items.push({
            uid: member.id,
            enc_key: enkey
        })
    })
    if(items.length>0){
        await groupApi.inviteJoin({
            id: group.id,
            items: items,
        })
    }
    return true;
}
// 申请加入群组
const apply = async (gid: string) => {
    return true;
}
// 同意加入群组
const agree = async (id: string) => {

    return true;
}
// 拒绝加入群组
const refuse = async (id: string) => {
    return true;
}
// 管理员拒绝加入群组
const adminRefuse = async (id: string) => {

    return true;
}
// 获取群组列表
const getList = async () => {
    return groupApi.mineGroupList({});
}
// 获取群组成员列表
const getMembers = async (id: string) => {
    const data = await groupApi.getGroupMembers({
       id
    })
    return data.items;
}
// 获取群组信息
const getInfo = async (id: string): Promise<GroupDetailItem | null> => {
    const data = await groupApi.groupDetail({
        ids:[id]
    });
    if (data.items.length == 0) {
        throw new Error('群组不存在');
    }
    return data.items[0];
}
// Todo: 这里需要调整
const encInfo = async (id: string) => {
    const data = await groupApi.encInfoByIds({
        ids: [id]
    });
    if (data.items.length == 0) {
        throw new Error('群组不存在');
    }
    return data.items[0];
}
const join = async (id: string,encKey: string,encPri: string): Promise<void> => {
    groupApi.requireJoin({ id,encKey,encPri });
}
const myApplyList = async (ids: string[] = []) => {
    return groupApi.myApplyList({ids});
}
// 待审核列表
const applyList = async (ids: string[] = []) => {
    return groupApi.applyList({ids});
}
// 拒绝加入
const rejectJoin = async (id: string,uids:string[]) => {
    return groupApi.rejectJoin({ id,uids });
}

// 允许加入群聊
const adminAgree =async (params: GroupApplyJoinReq) => {
    return groupApi.agreeJoin(params);
}
// 剔出群聊
const kickOut = async (params: {
    id: string;
    uids:string[];
}) => {
    return groupApi.kickOut(params);
}
export default {
    quit,
    quitAll,
    create,
    getList,
    getInfo,
    getMembers,
    encInfo,
    join,
    myApplyList,
    applyList,
    invite,
    rejectJoin,
    adminAgree,
    kickOut,
}