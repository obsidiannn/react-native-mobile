import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 2,
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
  ]
})