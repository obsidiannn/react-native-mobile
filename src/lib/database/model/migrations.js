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

	]
});
