import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import logger from '@nozbe/watermelondb/utils/common/logger';
import { appGroupPath } from './appGroup';
import { TAppDatabase, TServerDatabase } from './interfaces';
import appSchema from './schema/app'
import serverSchema from './schema/servers'
import serverMigrations from './model/servers/migrations'
import appMigrations from './model/migrations'

import MessageModel from './model/Message'

if (__DEV__) {
	console.log(`📂 ${appGroupPath}`);
}

const getDatabasePath = (name: string) => `${appGroupPath}${name}.db`;

export const getDatabase = (database = ''): Database => {
	const path = database.replace(/(^\w+:|^)\/\//, '').replace(/\//g, '.');
	const dbName = getDatabasePath(path);

	const adapter = new SQLiteAdapter({
		dbName,
		schema: appSchema,
		migrations: appMigrations
	});

	return new Database({
		adapter,
		modelClasses: [
			MessageModel
		]
	});
};


interface IDatabases {
	shareDB?: TAppDatabase | null;
	activeDB?: TAppDatabase;
	// 系統級別的
	serversDB: TServerDatabase;
}

class DB {
	databases: IDatabases = {
		serversDB: new Database({
			adapter: new SQLiteAdapter({
				dbName: getDatabasePath('default'),
				schema: serverSchema,
				migrations: serverMigrations
			}),
			modelClasses: [MessageModel]
		}) as TServerDatabase
	};

	// Expected at least one database
	get active(): TAppDatabase {
		return this.databases.shareDB || this.databases.activeDB!;
	}

	get share() {
		return this.databases.shareDB;
	}

	set share(db) {
		this.databases.shareDB = db;
	}

	get servers() {
		return this.databases.serversDB;
	}

	setShareDB(database = '') {
		const path = database.replace(/(^\w+:|^)\/\//, '').replace(/\//g, '.');
		const dbName = getDatabasePath(path);

		const adapter = new SQLiteAdapter({
			dbName,
			schema: appSchema,
			migrations: appMigrations
		});

		this.databases.shareDB = new Database({
			adapter,
			modelClasses: [
				MessageModel
			]
		}) as TAppDatabase;
	}

	setActiveDB(database: string) {
		this.databases.activeDB = getDatabase(database) as TAppDatabase;
	}
}

const db = new DB();
export default db;

if (!__DEV__) {
	logger.silence();
}
