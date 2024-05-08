import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
// 這裏是進行字段變更的記錄，類似liquibase
export default schemaMigrations({
	migrations: [
		// {
		// 	toVersion: 3,
		// 	steps: [
		// 		addColumns({
		// 			table: 'users',
		// 			columns: [{ name: 'statusText', type: 'string', isOptional: true }]
		// 		})
		// 	]
		// },
		
	]
});
