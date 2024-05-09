import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
// 這裏是進行字段變更的記錄，類似liquibase
export default schemaMigrations({
	migrations: [
		{
			toVersion: 2,
			steps: [
				addColumns({
					table: 'message',
					columns: [
						{ name: 'packet_id', type: 'string', isOptional: true },
					]
				})
			]
		},
		{
			toVersion: 3,
			steps: [
				createTable({
					name:'users',
					columns: [
						{ name: 'uid', type: 'string', isIndexed: true },
						{ name: 'avatar', type: 'string', isOptional: true },
						{ name: 'name', type: 'string' },
						{ name: 'name_index', type: 'string' },
						{ name: 'gender', type: 'number' },
						{ name: 'pub_key', type: 'string' },
						{ name: 'sign', type: 'string', isOptional: true },
						{ name: 'refresh_stamp', type: 'number' },
					]
				})
			]
		},
	]
});
