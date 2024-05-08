import { appSchema,tableSchema } from '@nozbe/watermelondb'


export default appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: 'posts',
        columns: [
          { name: 'title', type: 'string' },
          { name: 'subtitle', type: 'string', isOptional: true },
          { name: 'body', type: 'string' },
          { name: 'is_pinned', type: 'boolean' },
        ]
      },
      ),
      tableSchema({
        name: 'message',
        columns: [
          { name: 'mid', type: 'string' },
          { name: 'chat_id', type: 'string',isIndexed: true },
          { name: 'sequence', type: 'number',isIndexed: true },
          { name: 'type', type: 'string' },
          { name: 'uid', type: 'string' },
          { name: 'time', type: 'number' },
          { name: 'state', type: 'number' },
          { name: 'data', type: 'string',isOptional: true },
        ]
      },
      ),
    ]
  })