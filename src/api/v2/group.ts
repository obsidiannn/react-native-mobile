import { 
  GroupCreateReq,
  GroupChangeAvatarReq, 
  GroupChangeAliasReq,
  GroupChangeNoticeReq,
  GroupChangeDescReq, 
  GroupMemberResp,GroupInviteJoinReq,
  GroupKickOutReq,GroupChangeNameReq ,
  GroupDetailResp,MineGroupInfoItem,
  GroupInfoItem,GroupTransferReq,
  GroupIdsReq,GroupListIdResp, GroupApplyItem, GroupApplyJoinReq, GroupRequireJoinReq, GroupInfoDto,
  GroupMemberItem
} from "../types/group"; 
import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq, BaseIdsArrayReq, BaseArrayResp } from "../types/common";

const create = (param: GroupCreateReq):Promise<void> => {
  return createRequestInstance(true).post('/groups/create', param);
}


const getGroupMembersById = (param: BaseIdReq):Promise<BaseArrayResp<GroupMemberItem>> => {
  return createRequestInstance(true).post('/groups/members-list', param);
}


const getGroupMembers = (param: BaseIdReq):Promise<GroupMemberResp> => {
  return createRequestInstance(true).post('/groups/members', param);
}

const rejectJoin = (param: GroupApplyJoinReq) => {
  return createRequestInstance(true).post('/groups/reject-join', param);
}

const agreeJoin = (param: GroupApplyJoinReq) => {
  return createRequestInstance(true).post('/groups/agree-join', param);
}

const inviteJoin = (param: GroupInviteJoinReq) => {
  return createRequestInstance(true).post('/groups/invite-join', param);
}

// 申请加入群组
const requireJoin = (param: GroupRequireJoinReq) => {
  return createRequestInstance(true).post('/groups/require-join', param);
}

const kickOut = (param: GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/kick-out', param);
}

const mineGroupList = (param: GroupIdsReq) :Promise<GroupListIdResp> => {
  return createRequestInstance(true).post('/groups/list',param);
}

const groupInfoList = (param: GroupIdsReq): Promise<BaseArrayResp<GroupInfoDto>> =>{
  return createRequestInstance(true).post('/groups/list-by-ids',param);
}

const changeName = (param: GroupChangeNameReq) => {
  return createRequestInstance(true).post('/groups/update-name',param);
}

const changeAvatar = (param: GroupChangeAvatarReq) => {
  return createRequestInstance(true).post('/groups/update-avatar',param);
}

const changeAlias = (param: GroupChangeAliasReq) => {
  return createRequestInstance(true).post('/groups/update-alias',param);
}
const changeNotice = (param: GroupChangeNoticeReq) => {
  return createRequestInstance(true).post('/groups/update-notice',param);
}

const changeDesc = (param: GroupChangeDescReq) => {
  return createRequestInstance(true).post('/groups/update-desc',param);
}


const quit = (param: BaseIdReq) => {
  return createRequestInstance(true).post('/groups/quit',param);
}

const quitBatch = (param: BaseIdArrayReq) => {
  return createRequestInstance(true).post('/groups/quit-batch',param);
}

const quitAll = () => {
  return createRequestInstance(true).post('/groups/quit-all');
}

const getNotice = (param:BaseIdReq) => {
  return createRequestInstance(true).post('/groups/get-notice',param);
}

const dismiss = (param:BaseIdArrayReq) => {
  return createRequestInstance(true).post('/groups/dismiss',param);
}

const transfer = (param:GroupTransferReq) => {
  return createRequestInstance(true).post('/groups/transfer',param);
}

const addAdmin = (param:GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/add-admin',param);
}

const removeAdmin = (param:GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/remove-admin',param);
}
const applyList = (param:BaseIdsArrayReq):Promise<GroupApplyItem[]> => {
  return createRequestInstance(true).post('/groups/apply-list',param);
}

const myApplyList = (param:BaseIdsArrayReq):Promise<MineGroupInfoItem[]> => {
  return createRequestInstance(true).post('/groups/my-apply-list',param);
}

//
const groupDetail = (param:BaseIdsArrayReq):Promise<GroupDetailResp> => {
  return createRequestInstance(true).post('/groups/get-batch-info',param);
}


export default {
  create,
  getGroupMembers,
  getGroupMembersById,
  rejectJoin,
  agreeJoin,
  inviteJoin,
  requireJoin,
  kickOut,
  mineGroupList,
  groupInfoList, 
  changeName,
  changeAvatar,
  changeAlias,
  changeNotice,
  changeDesc,
  quit,
  quitBatch,
  quitAll,
  getNotice,
  dismiss,
  transfer,
  addAdmin,
  removeAdmin,
  applyList,
  myApplyList,
  groupDetail

}