import { UserInfoItem } from '@/api/types/user';
import database from '../index';
import { TAppDatabase } from '../interfaces';
import UserModel, { USER_TABLE } from '../model/User'
import { Collection, Q } from '@nozbe/watermelondb'
import dayjs from "dayjs";

const getCollection = (db: TAppDatabase) => db.get(USER_TABLE);


export interface MessqgeQueryType {
    uids: string[]
}

export const queryUser = async (param: MessqgeQueryType): Promise<UserInfoItem[]> => {
    
    // 秒級時間戳
    const curremtSecond = dayjs().unix()
    const db = database.active;
    const collection = getCollection(db);
    const where = [
        Q.where('uid', Q.oneOf(param.uids)),
        // 1 小時內
        Q.where('refresh_stamp', Q.gte(curremtSecond - 3600))

    ]
    const result = await collection.query(where)
    if (result.length > 0) {
        return result.map(d => {
            return {
                id: d.uid,
                avatar: d.avatar,
                name: d.name,
                nameIndex: d.nameIndex,
                gender: d.gender,
                pubKey: d.pubKey,
                sign: d.sign,
            }
        })
    }
    return []
};



/**
 *  return collection.prepareCreateFromDirtyRaw({
                id: d.id,
                avatar: d.avatar,
                name: d.name,
                nameIndex: d.nameIndex,
                gender: d.gender,
                pubKey: d.pubKey,
                sign: d.sign,
                refreshStamp: curremtSecond
            })
 */
export const saveBatchUser = async (users: UserInfoItem[]) => {
    if (users && users.length <= 0) {
        return
    }
    const curremtSecond = dayjs().unix()
    await deleteUserByIds(users.map(u => u.id))
    const db = database.active;
    const collection = getCollection(db)
    const list: UserModel[] = (await Promise.all(
        users.map(d => {
            return collection.prepareCreate((entity) => {
                entity.uid = d.id
                entity.avatar = d.avatar
                entity.name = d.name
                entity.nameIndex = d.nameIndex
                entity.gender = d.gender
                entity.pubKey = d.pubKey
                entity.sign = d.sign
                entity.refreshStamp = curremtSecond
            })
        })
    ))
    console.log('寫入user', list);

    await db.write(async () => {
        db.batch(list)
    })
}



export const deleteUserByIds = async (uids: string[]) => {
    console.log('刪除user', uids);
    const db = database.active;
    const result = await db.write(async () => {
        await getCollection(db).query(Q.where("uid", Q.oneOf(uids))).destroyAllPermanently()
    })
    
}