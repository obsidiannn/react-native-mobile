import userApi from '../api/v2/user'
import { UserInfoItem, UserInfoResp } from '@/api/types/user';
const getBatchInfo = async (ids: string[]): Promise<UserInfoItem[]> => {
    const data:UserInfoResp = await userApi.getBatchInfo({uids: ids});
    return data.items??[];
}
const getInfo = async (id: string): Promise<UserInfoItem| null> => {
    const users = await getBatchInfo([id]);
    if (users.length > 0) {
        return users[0];
    }
    return null;
}

const getUserHash = async (uids: string[]): Promise<Map<string,UserInfoItem>> => {
    const result = new Map<string,UserInfoItem> ()
    const users = await getBatchInfo(uids)
    users.forEach(u=>{
        result.set(u.id,u)
    })
    return result
}

export default {
    getBatchInfo,
    getInfo,
    getUserHash
}