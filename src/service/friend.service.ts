import { GenderEnum } from "@/api/types/enums";
import { FreindInfoReleationItem, FriendRelationItem } from "@/api/types/friend";
import { UserInfoItem } from "@/api/types/user";
import friendApi from "@/api/v2/friend";
import userApi from '@/api/v2/user'
const getBatchInfo = async (uids: string[]) => {
    const data = await friendApi.getFriendList({uids});
    return data.items;
}
const getInfo = async (uid: string) => {
    const items = await getBatchInfo([uid]);
    if (items.length > 0) {
        return items[0];
    }
    return null;
}

const getReleationList = async (uids: string[]):Promise<FreindInfoReleationItem[]>=>{
   const releations =  await friendApi.getRelationList({uids })
   const users = await userApi.getBatchInfo({uids}) 
   const userHash : Map<string,UserInfoItem> = new Map<string,UserInfoItem>();
    (users.items??[]).forEach(u=>{
        userHash.set(u.id,u)
    })
    const result = (releations.items??[]).map(i=>{
        const user = userHash.get(i.uid)
        const item:FreindInfoReleationItem = {
            ...i,
            name: user?.name ??'',
            sign: user?.sign??'',
            avatar: user?.avatar??'',
            gender: user?.gender??GenderEnum.UNKNOWN,
            pubKey: user?.pubKey??''
        }
        return item
    })
    return result
}
const getList = async () => {
    const data = await friendApi.getFriendList({uids:[]});
    const {items} = data;
    items.forEach((item,i) => {
        item.name = item.remark || item.name;
        item.nameIndex = item.remarkIndex || item.nameIndex;
        items[i] = item;
    });
    items.sort((a, b) => a.nameIndex.charCodeAt(0) - b.nameIndex.charCodeAt(0));
    const alphabet = [...new Set(items.map(item => item.nameIndex))];
    const alphabetIndex:{ [key: string]: number } = {}
    alphabet.forEach((item) => {
        alphabetIndex[item] = items.findIndex((i) => i.nameIndex === item);
    })
    return {
        items,
        alphabet,
        alphabetIndex
    };
}
const removeAll = async () => {
    return true;
}
const removeBatch = async (uids: string[]) => {
    return true;
}
const remove = async (uid: string) => {
    return removeBatch([uid]);
}
const updateRemark = (uid: string, remark: string):Promise<void> => {
    return friendApi.changeAlias({id: uid,alias: remark});
}
export default {
    getList,
    getBatchInfo,
    getInfo,
    removeAll,
    removeBatch,
    remove,
    updateRemark,
    getReleationList
};