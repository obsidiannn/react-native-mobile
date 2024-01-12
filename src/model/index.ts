
import { Database ,Model} from '@nozbe/watermelondb'

import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import {SQLiteAdapterOptions} from '@nozbe/watermelondb/adapters/sqlite/type'
import migrations from './migrations'
import Post from './group.model' 


import { appSchema,tableSchema} from '@nozbe/watermelondb'

 const scheme =  appSchema({
  version: 1,
  tables:[
    tableSchema({
        name: 'posts',
        columns: [
          {name:'title',type: 'string'},
          {name:'subtitle',type: 'string',isOptional: true},
          {name:'body',type: 'string'},
          {name:'is_pinned',type: 'boolean'},
        ]
      }),
  ]
})

let option: SQLiteAdapterOptions = {
  dbName: 'bobo_chat_db',
  schema: scheme,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
  }
}
// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter(option)
// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Post, 
  ],
})

// post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
export const create = (tableName: string, func: (record: any) => void) :Promise<any> =>{
 return database.get(tableName).create(func);
}


export const createRecordInTransaction = async (tableName:string,func: (record: any) => void) => {
  try {
    await database.write(async () => {
     await database.get(tableName).create(func);
      // await comment.update(() => {
      //   comment.isSpam = true
      // })
      console.log('Record created successfully!');
    })
   
    
    
    
  } catch (error) {
    console.error('Error creating record:', error);
  }
};
