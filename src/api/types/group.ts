import { BaseIdReq, BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common.js";

export interface GroupCreateReq {
	id: string;
	pubKey: string;
	avatar: string;
	name: string;
	isEnc: CommonEnum;
	type: number;
	banType: number;
	searchType: number;
};

export interface GroupMemberItem {
	id: string;
	uid: string;
	gid: string;
	role: number;
	myAlias: string;
	admin_at: number;
	createdAt: number;
};
 

export interface GroupMemberResp extends BasePageResp<GroupMemberItem>{
  
}

export interface GroupIdsReq {
  gids?: string[]
}

export interface GroupListIdResp{
  gids:  string[]
}

export interface GroupInviteJoinItem {
  uid: string,
  enc_key?: string 
}

// 审核群加入申请
export interface GroupApplyJoinReq {
	id: string,
	uids: string[]
  }

export interface GroupInviteJoinReq {
  id: string,
  items: GroupInviteJoinItem[]
}

export interface GroupRequireJoinReq extends BaseIdReq {
	encKey: string
	encPri: string
}

export interface GroupKickOutReq {
  id: string,
  uids: string[]
}

export interface GroupChangeNameReq {
  id: string,
  name: string
}
export interface GroupChangeAvatarReq {
  id: string,
  avatar: string
}

export interface GroupChangeAliasReq {
  id: string,
  alias: string
}


export interface GroupChangeNoticeReq{
	id: string;
	notice: string;
	notice_md5: string;
}
export interface GroupChangeDescReq{
	id: string;
	desc: string;
	desc_md5: string;
}

export interface GroupTransferReq{
	id: string;
  uid: string;
}

export interface GroupInfoDto {
	id: string
	name: string
	avatar: string
	memberLimit: number
	total: number
	pubKey: string
	desc: string
	isEnc: string
}

export interface GroupInfoItem{
  	id: string;
	gid: string;
	uid: string;
	encKey: string;
	role: number;
	status: number;
	createdAt: number;
	pubKey: string
}

export interface GroupApplyItem{
	id: string;
	gid: string;
	uid: string;
	encKey: string;
	role: number;
	status: number;
	createdAt: number;
	pubKey: string
  }

export interface MineGroupInfoItem{
  id: string;
	gid: string;
	status: number;
	created_at: number;
}


export interface GroupDetailItem{
	id: string;
	gid: string;
	name: string;
	avatar: string;
	created_at: number;
	memberLimit: number;
	total: number;
	pubKey: string;
	ownerId: string;
	creatorId: string;
	notice: string;
	noticeMd5: string;
	desc: string;
	descMd5: string;
	cover: string;
	isEnc: CommonEnum;
	type: GroupTypeEnum;
	banType: number;
	searchType: number;
	status: number;
};

export interface GroupDetailResp{
  items: GroupDetailItem[];
  status: number
}

// 群分类列表
export interface GroupCategoryListParams {
    id: string;
}
// 群分类结构
export interface GroupCategoryListItem {
    id: string;
    name: string;
    checked: boolean;
}