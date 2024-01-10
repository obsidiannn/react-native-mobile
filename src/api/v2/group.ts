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

const groupCreate = (param: GroupCreateReq) => {
  return createRequestInstance(true).post('/groups/create', param);
}

const groupMember = (param: BaseIdReq):Promise<GroupMemberResp> => {
  return createRequestInstance(true).post('/groups/create', param);
}

const groupApplyJoin = (param: BaseIdReq) => {
  return createRequestInstance(true).post('/groups/agree-join', param);
}

const groupInviteJoin = (param: GroupInviteJoinReq) => {
  return createRequestInstance(true).post('/groups/invite-join', param);
}

const groupKickOut = (param: GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/kick-out', param);
}
const groupMineGroupList = () => {
  return createRequestInstance(true).post('/groups/list');
}
const groupChangeName = (param: GroupChangeNameReq) => {
  return createRequestInstance(true).post('/groups/update-name',param);
}

const groupChangeAvatar = (param: GroupChangeAvatarReq) => {
  return createRequestInstance(true).post('/groups/update-avatar',param);
}

const groupChangeAlias = (param: GroupChangeAliasReq) => {
  return createRequestInstance(true).post('/groups/update-alias',param);
}
const groupChangeNotice = (param: GroupChangeNoticeReq) => {
  return createRequestInstance(true).post('/groups/update-notice',param);
}

const groupChangeDesc = (param: GroupChangeDescReq) => {
  return createRequestInstance(true).post('/groups/update-desc',param);
}


const groupQuit = (param: BaseIdReq) => {
  return createRequestInstance(true).post('/groups/quit',param);
}

const groupQuitBatch = (param: BaseIdArrayReq) => {
  return createRequestInstance(true).post('/groups/quit-batch',param);
}

const groupQuitAll = () => {
  return createRequestInstance(true).post('/groups/quit-all');
}

const groupGetNotice = (param:BaseIdReq) => {
  return createRequestInstance(true).post('/groups/get-notice',param);
}

const groupDismiss = (param:BaseIdArrayReq) => {
  return createRequestInstance(true).post('/groups/dismiss',param);
}

const groupTransfer = (param:GroupTransferReq) => {
  return createRequestInstance(true).post('/groups/transfer',param);
}

const groupAddAdmin = (param:GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/add-admin',param);
}

const groupRemoveAdmin = (param:GroupKickOutReq) => {
  return createRequestInstance(true).post('/groups/remove-admin',param);
}
const groupApplyList = (param:BaseIdReq):Promise<GroupInfoItem[]> => {
  return createRequestInstance(true).post('/groups/apply-list',param);
}

const groupMyApplyList = (param:BaseIdReq):Promise<MineGroupInfoItem[]> => {
  return createRequestInstance(true).post('/groups/my-apply-list',param);
}

//
const groupDetail = (param:BaseIdArrayReq):Promise<GroupDetailResp> => {
  return createRequestInstance(true).post('/groups/get-batch-info',param);
}
