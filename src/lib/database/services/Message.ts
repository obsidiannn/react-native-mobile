import database from '..';
import { TAppDatabase } from '../interfaces';
import { MSG_TABLE } from '../model/Message'

const getCollection = (db: TAppDatabase) => db.get(MSG_TABLE);

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
