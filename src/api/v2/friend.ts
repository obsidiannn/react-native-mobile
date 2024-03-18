import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdsArrayReq,BaseUIdArrayReq, BaseArrayResp } from "../types/common";
import {FriendRelationItem,FriendInviteApplyReq,FriendInviteApplyItem
,FriendInviteAgreeReq,FriendInviteRejectReq,FriendInfoItem,FriendChangeAliasReq

} from "../types/friend"

// 获取用户关系
const getRelationList = (param: BaseUIdArrayReq): Promise<BaseArrayResp<FriendRelationItem>>=>{
  return createRequestInstance(true).post('/friends/relation-list', param);
}

// 申请好友
const inviteApply = (param: FriendInviteApplyReq)=>{
  return createRequestInstance(true).post('/friends/invite-apply', param);
}

// 我的申请列表
const getInviteList = ():Promise<BaseArrayResp<FriendInviteApplyItem>>=>{
  return createRequestInstance(true).post('/friends/invite-list');
}

// 我的审核列表
const getApplyList = ():Promise<BaseArrayResp<FriendInviteApplyItem>>=>{
  return createRequestInstance(true).post('/friends/invite-apply-list');
}


// 申请同意
const inviteAgree = (param: FriendInviteAgreeReq)=>{
  return createRequestInstance(true).post('/friends/invite-agree', param);
}

// 申请拒绝
const inviteReject = (param: FriendInviteRejectReq)=>{
  return createRequestInstance(true).post('/friends/invite-reject', param);
}

// 申请已读
const inviteRead = (param: BaseIdsArrayReq)=>{
  return createRequestInstance(true).post('/friends/invite-read', param);
}

// 好友列表
const getFriendList = (param: BaseUIdArrayReq):Promise<BaseArrayResp<FriendInfoItem>> =>{
  return createRequestInstance(true).post('/friends/list', param);
}
// 变更好友备注
const changeAlias = (param: FriendChangeAliasReq): Promise<void> =>{
  return createRequestInstance(true).post('/friends/update-alias', param);
}

// 删除好友（单向）
const dropRelationSingle = (param: BaseUIdArrayReq)=>{
  return createRequestInstance(true).post('/friends/delete-unilateral', param);
}

// 删除所有好友（双向）
const dropRelationDouble = (param: BaseUIdArrayReq)=>{
  return createRequestInstance(true).post('/friends/delete-bilateral', param);
}


export default {
  getRelationList,
  inviteApply,
  getApplyList,
  inviteAgree,
  inviteReject,
  inviteRead,
  getFriendList,
  changeAlias,
  dropRelationSingle,
  dropRelationDouble,
  getInviteList
}