import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdsArrayReq,BaseUIdArrayReq, BaseArrayResp, BaseIdArrayReq } from "../types/common";
import {
  MessageSendReq,
  MessageListItem,
  MessageDetailItem,
  MessageDeleteByIdReq
 } from '../types/message'

 // 发送消息
const sendMessage = (param: MessageSendReq) =>{
  return createRequestInstance(true).post('/messages/send',param);
}

// 消息列表
const mineMessageList = (): Promise<BaseArrayResp<MessageListItem>>=>{
  return createRequestInstance(true).post('/messages/list');
}

// 消息列表
const getMessageDetail = (param: BaseIdsArrayReq): Promise<BaseArrayResp<MessageDetailItem>>=>{
  return createRequestInstance(true).post('/messages/detail',param);
}

// 撤回消息
const pullBack = (param: BaseIdsArrayReq) =>{
  return createRequestInstance(true).post('/messages/delete-batch',param);
}

//（单向）删除消息-按消息Id
const deleteSelfMsg = () =>{
  return createRequestInstance(true).post('/messages/delete-self-all');
}

//（双向）删除所有消息-根据会话IDs
const deleteChatByIds = (param: MessageDeleteByIdReq) =>{
  return createRequestInstance(true).post('/messages/delete-chat-ids',param);
}

// （单向）删除所有消息-根据会话IDs 解除自己与会话消息的关系
const deleteSelfChatByIds = (param: MessageDeleteByIdReq) =>{
  return createRequestInstance(true).post('/messages/delete-self-chat-ids',param);
}

// 撤回消息 根据会话IDs 所有发送者的消息物理删除
const pullBackByChatIds = (param: MessageDeleteByIdReq) =>{
  return createRequestInstance(true).post('/messages/revoke-chat-ids',param);
}

// 清空所有端消息 物理删除 (不可恢复,只有拥有管理员权限的用户才能调用)
const clearChatByChatIds = (param: MessageDeleteByIdReq) =>{
  return createRequestInstance(true).post('/messages/clear-chat-ids',param);
}

