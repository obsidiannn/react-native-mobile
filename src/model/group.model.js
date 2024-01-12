import {Model} from '@nozbe/watermelondb'
import { field,text } from '@nozbe/watermelondb/decorators'

class Post extends Model {
  static table="posts"
  @text('title') title;
  @text('body') body;
  @text('subtitle') subtitle;
  @field('is_pinned') isPinned;
}

export default Post