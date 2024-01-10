import { 
  GroupCreateReq,
  GroupChangeAvatarReq, 
  GroupChangeAliasReq,
  GroupChangeNoticeReq,
  GroupChangeDescReq, 
  GroupMemberResp,GroupInviteJoinReq,
  GroupKickOutReq,GroupChangeNameReq ,
  GroupDetailResp,MineGroupInfoItem,
  GroupInfoItem,GroupTransferReq
} from "../types/group"; 
import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq } from "../types/common";

const create = (param: GroupCreateReq) => {
  return createRequestInstance(true).post('/groups/create', param);
}

const member = (param: BaseIdReq):Promise<GroupMemberResp> => {
  return createRequestInstance(true).post('/groups/create', param);
}

const applyJoin = (param: BaseIdReq) => {
  return createRequestInstance(true).post('/groups/agree-join', param);
}

const inviteJoin = (param: GroupInviteJoinReq) => {
  return createRequestInstance(true).post('/groups/invite-join', param);
}

const kickOut = (param: GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/kick-out', param);
}
const mineGroupList = () => {
  return createRequestInstance(true).post('/groups/list');
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
const applyList = (param:BaseIdReq):Promise<GroupInfoItem[]> => {
  return createRequestInstance(true).post('/groups/apply-list',param);
}

const myApplyList = (param:BaseIdReq):Promise<MineGroupInfoItem[]> => {
  return createRequestInstance(true).post('/groups/my-apply-list',param);
}

//
const groupDetail = (param:BaseIdArrayReq):Promise<GroupDetailResp> => {
  return createRequestInstance(true).post('/groups/get-batch-info',param);
}


export default {
  mineGroupList
}