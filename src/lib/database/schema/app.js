import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'message',
      columns: [
        { name: 'mid', type: 'string' },
        { name: 'chat_id', type: 'string', isIndexed: true },
        { name: 'sequence', type: 'number', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'uid', type: 'string' },
        { name: 'time', type: 'number' },
        { name: 'state', type: 'number' },
        { name: 'data', type: 'string', isOptional: true },
        { name: 'packet_id', type: 'string', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'users',
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
    }),
  ]
})