import { DataType, IMessage, IMessageType } from '@/components/chat/input-toolkit/types';
import database from '../index';
import { TAppDatabase } from '../interfaces';
import IMessageModel, { MSG_TABLE } from '../model/Message'
import { Q } from '@nozbe/watermelondb'
import dayjs from "dayjs";
import { IMessageTypeValueEnum } from '@/api/types/enums';

const getCollection = (db: TAppDatabase) => db.get(MSG_TABLE);


export interface MessqgeQueryType {
	chatId: string
	sequence: number
	direction: 'up' | 'down'
	limit: number
}

export const getMessageById = async (messageId: string | null) => {
	if (!messageId) {
		return null;
	}
	const db = database.active;
	const messageCollection = getCollection(db);
	try {
		const result = await messageCollection.find(messageId);
		return result;
	} catch {
		return null;
	}
};

export const query = async (param: MessqgeQueryType) => {
	const db = database.active;
	const messageCollection = getCollection(db);
	const where = [
		Q.where('chat_id', param.chatId),
		Q.where('sequence', (param.direction === 'up' ? Q.lte(param.sequence) : Q.gte(param.sequence))),
		Q.sortBy('sequence', (param.direction === 'up' ? Q.desc : Q.asc)),
		Q.take(param.limit)
	]
	const result = await messageCollection.query(where)
	return result.map(r => {
		console.log('time=', r.time);
		return {
			mid: r.mid,
			type: r.type,
			sequence: r.sequence,
			state: r.state,
			chatId: r.chatId,
			uid: r.uid ?? '',
			data: r.data,
			time: dayjs(r.time),
			packetId: r.packetId
		}
	}).sort((a, b) => {
		return b.sequence - a.sequence
	})
}


export const saveBatch = async (_data: IMessage<DataType>[], chatId: string) => {
	const db = database.active;
	const collection = getCollection(db)
	const list: IMessageModel[] = (await Promise.all(
		_data.map(d => {
			return collection.prepareCreate(entity => {
				entity.mid = d.mid
				entity.type = d.type
				entity.sequence = d.sequence
				entity.time = d.time.valueOf()
				entity.state = d.state
				entity.chatId = chatId
				entity.uid = d.uid ?? ''
				entity.data = d.content
				if (d.type === IMessageTypeValueEnum.PACKET || d.type === IMessageTypeValueEnum.GPACKET) {
					entity.packetId = d.data.packetId ?? ''
				}
			})
		})
	))
	console.log('寫入', list);

	await db.write(async () => {
		db.batch(list)
	})

}


export const deleteMessageByChatId = async (chatId: string) => {
	const db = database.active;
	console.log('-----', db.action);

	const result = await db.write(async () => {
		await getCollection(db).query(Q.where("chat_id", chatId)).destroyAllPermanently()
	})
	console.log('刪除', result);

}