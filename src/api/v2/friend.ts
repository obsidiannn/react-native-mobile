import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdsArrayReq,BaseUIdArrayReq, BaseArrayResp } from "../types/common";
import {FriendRelationItem,FriendInviteApplyReq,FriendInviteApplyItem
,FriendInviteAgreeReq,FriendInviteRejectReq,FriendInfoItem,FriendChangeAliasReq

} from "../types/friend"

// 获取用户关系
const friendGetRelationList = (param: BaseUIdArrayReq): Promise<BaseArrayResp<FriendRelationItem>>=>{
  return createRequestInstance(true).post('/friends/relation-list', param);
}

// 申请好友
const friendInviteApply = (param: FriendInviteApplyReq)=>{
  return createRequestInstance(true).post('/friends/invite-apply', param);
}

// 申请列表
const friendGetApplyList = ():Promise<BaseArrayResp<FriendInviteApplyItem>>=>{
  return createRequestInstance(true).post('/friends/invite-list');
}

// 申请同意
const friendInviteAgree = (param: FriendInviteAgreeReq)=>{
  return createRequestInstance(true).post('/friends/invite-agree', param);
}

// 申请拒绝
const friendInviteReject = (param: FriendInviteRejectReq)=>{
  return createRequestInstance(true).post('/friends/invite-reject', param);
}

// 申请已读
const friendInviteRead = (param: BaseIdsArrayReq)=>{
  return createRequestInstance(true).post('/friends/invite-read', param);
}

// 好友列表
const friendGetList = (param: BaseUIdArrayReq):Promise<BaseArrayResp<FriendInfoItem>> =>{
  return createRequestInstance(true).post('/friends/list', param);
}
// 变更好友备注
const friendChangeAlias = (param: FriendChangeAliasReq)=>{
  return createRequestInstance(true).post('/friends/update-alias', param);
}

// 删除好友（单向）
const friendDropRelationSingle = (param: BaseUIdArrayReq)=>{
  return createRequestInstance(true).post('/friends/delete-unilateral', param);
}

// 删除所有好友（双向）
const friendDropRelationDouble = (param: BaseUIdArrayReq)=>{
  return createRequestInstance(true).post('/friends/delete-bilateral', param);
}
