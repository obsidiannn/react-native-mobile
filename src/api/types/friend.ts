import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface FreindInfoReleationItem extends FriendRelationItem{
	name: string;
	sign: string;
	avatar: string;
	gender: number;
	pubKey: string
	chatId?: string
  }
export interface FriendRelationItem {
	uid: string;
	isFriend: FriendReleationEnum;
	chatId?:string
};

export interface FriendInviteApplyReq{
	uid: string;
	remark: string;
};


export interface FriendInviteApplyItem{
	id: string;
	uid: string;
	objUid: string
	remark: string;
	rejectReason: string;
	isSelf: boolean
	status: number;
	name?: string
	avatar?: string
};


export interface FriendInviteAgreeReq{
	id: string;
	alias: string;
};


export interface FriendInviteRejectReq{
	id: string;
	reason: string;
};

export interface FriendInfoItem  {
	uid: string;
	chatId: string;
	remark: string
	remarkIndex: string
	name: string
	nameIndex: string
	gender: number;
	avatar: string;
	pubKey: string;
};

export interface FriendChangeAliasReq{
	id: string;
	alias: string;
};

export enum FriendReleationEnum {
	FRIEND_NONE = 0,
	FRIEND_EACH = 1,
	FRIEND_MINE = 2,
	FRIEND_HIM = 3
}