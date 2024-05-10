import userApi from '../api/v2/user'
import { UserInfoItem, UserInfoResp } from '@/api/types/user';
import { queryUser, saveBatchUser } from '@/lib/database/services/User'
import utils from '@/lib/utils';

const getBatchInfo = async (ids: string[]): Promise<UserInfoItem[]> => {
    const uids = [...new Set(ids)]
    const localUsers = await queryUser({ uids: uids })
    console.log('localUsers',localUsers);
    
    const localUids:string[] = []
    if (localUsers.length > 0) {
        localUids.push(...localUsers.map(u => {return u.id}))
    }
    console.log('[local]',localUids);
    
    const diff = utils.arrayDifference(uids, localUids)
    console.log('[user diff]',diff);
    
    if (diff.length > 0) {
        const data: UserInfoResp = await userApi.getBatchInfo({ uids: diff });
        localUsers.concat(data.items)
        saveBatchUser(data.items)
    }

    return localUsers;
}
const getInfo = async (id: string): Promise<UserInfoItem | null> => {
    const users = await getBatchInfo([id]);
    if (users.length > 0) {
        return users[0];
    }
    return null;
}

const getUserHash = async (uids: string[]): Promise<Map<string, UserInfoItem>> => {
    const result = new Map<string, UserInfoItem>()
    
    const users = await getBatchInfo(uids)

    users.forEach(u => {
        result.set(u.id, u)
    })
    return result
}

export default {
    getBatchInfo,
    getInfo,
    getUserHash
}