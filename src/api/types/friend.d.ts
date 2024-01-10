import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface FriendRelationItem{
	uid: string;
	is_friend: number;
};

export interface FriendInviteApplyReq{
	uid: string;
	remark: string;
};


export interface FriendInviteApplyItem{
	id: string;
	uid: string;
	remark: string;
	reject_reason: string;
	status: number;
};


export interface FriendInviteAgreeReq{
	id: string;
	alias: string;
};


export interface FriendInviteRejectReq{
	id: string;
	alias: string;
};

export interface FriendInfoItem  {
	uid: string;
	chat_id: string;
	alias: string;
};

export interface FriendChangeAliasReq{
	id: string;
	alias: string;
};
