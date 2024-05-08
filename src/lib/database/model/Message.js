import { Model } from '@nozbe/watermelondb';
import { field, json,date,text } from '@nozbe/watermelondb/decorators';
import {sanitizer} from '../utils'

export const MSG_TABLE = 'message';


export default class IMessageModel extends Model {

    static table = MSG_TABLE;
    static idAttribute = 'mid';
    
    @text('mid') mid;
    @text('chat_id') chatId;
    @text('type') type;
    @field('sequence') sequence;
    @text('uid') uid;
    @date('time') time;
    @field('state') state;
    @text('data') data;
    @text('packet_id') packetId;
  }
  
