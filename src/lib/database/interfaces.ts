import { Database, Collection } from '@nozbe/watermelondb';

import * as models from './model';
import * as definitions from '../../definitions';

export type TAppDatabaseNames =
	| typeof models.MSG_TABLE
	;

// Verify if T extends one type from TAppDatabaseNames, and if is truly,
// returns the specific model type.
// https://stackoverflow.com/a/54166010  TypeScript function return type based on input parameter
type ObjectType<T> = T extends typeof models.MSG_TABLE
	? definitions.TMessageModel
	: never;

export type TAppDatabase = {
	get: <T extends TAppDatabaseNames>(db: T) => Collection<ObjectType<T>>;
} & Database;

// Migration to server database
export type TServerDatabaseNames =
	| typeof models.SERVERS_TABLE
	| typeof models.LOGGED_USERS_TABLE;

type ObjectServerType<T> = T extends typeof models.SERVERS_TABLE
	? definitions.TServerModel
	: never;

export type TServerDatabase = {
	get: <T extends TServerDatabaseNames>(db: T) => Collection<ObjectServerType<T>>;
} & Database;
