import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdsArrayReq,BaseUIdArrayReq, BaseArrayResp, BaseIdArrayReq } from "../types/common";
import { ChatListItem,ChatDetailItem,

 } from '../types/chat'

// 获取我的会话列表
const mineChatList = (): Promise<BaseArrayResp<ChatListItem>>=>{
  return createRequestInstance(true).post('/chat/mine-list');
}

// 会话详情
const chatDetail = (param: BaseIdsArrayReq): Promise<BaseArrayResp<ChatDetailItem>>=>{
  return createRequestInstance(true).post('/chat/detail', param);
}

// 删除会话
const deleteChat = (param: BaseIdsArrayReq)=>{
  return createRequestInstance(true).post('/chat/delete', param);
}



export default {
  mineChatList,
  chatDetail,
  deleteChat
}