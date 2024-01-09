import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface GroupCreateReq {
	id: string;
	pub_key: string;
	avatar: string;
	name: string;
	is_enc: CommonEnum;
	type: number;
	ban_type: number;
	search_type: number;
};

export interface GroupMemberItem {
	id: string;
	uid: string;
	gid: string;
	role: number;
	my_alias: string;
	admin_at: number;
	created_at: number;
};
 

export interface GroupMemberResp extends BasePageResp<GroupMemberItem>{
  
}

export interface GroupMemberResp extends BasePageResp<GroupMemberItem>{
  
}

export interface GroupInviteJoinItem {
  uid: string,
  enc_key?: string 
}

export interface GroupInviteJoinReq {
  id: string,
  items: GroupInviteJoinItem[]
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

export interface GroupInfoItem{
  id: string;
	gid: string;
	uid: string;
	enc_key: string;
	role: number;
	status: number;
	created_at: number;
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
	member_limit: number;
	total: number;
	pub_key: string;
	owner_id: string;
	creator_id: string;
	notice: string;
	notice_md5: string;
	desc: string;
	desc_md5: string;
	cover: string;
	is_enc: CommonEnum;
	type: GroupTypeEnum;
	ban_type: number;
	search_type: number;
	status: number;
};

export interface GroupDetailResp{
  items: GroupDetailItem[];
  status: number
}