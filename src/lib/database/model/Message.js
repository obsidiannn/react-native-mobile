import { Model } from '@nozbe/watermelondb';
import { field, json,date } from '@nozbe/watermelondb/decorators';


export const MSG_TABLE = 'message';



export default class IMessageModel extends Model {

    static table = MSG_TABLE;
    
    @text('mid') mid;
    @text('chat_id') chatId;
    @text('type') type;
    @field('sequence') sequence;
    @text('uid') uid;
    @date('time') time;
    @field('state') state;
    @json('data') data;
  }
  
