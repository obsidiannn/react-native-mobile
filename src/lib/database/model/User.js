

import { Model } from '@nozbe/watermelondb';
import { date,text } from '@nozbe/watermelondb/decorators';

export const USER_TABLE = 'users';

export default class UserModel extends Model {

    static table = USER_TABLE;
    static idAttribute = 'uid';
    
    @text('uid') uid;
    @text('avatar') avatar;
    @text('name') name;
    @text('name_index') nameIndex;
    @text('gender') gender;
    @text('pub_key') pubKey;
    @text('sign') sign;
    @date('refresh_stamp') refreshStamp;

  }
  
