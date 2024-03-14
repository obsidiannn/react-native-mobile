import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface ChatListItem {
	id: string;
	chatId: string;
	isTop: number;
	isMute: number;
	isShow: number;
	isHide: number;
	maxReadSeq: number;
	lastOnlineTime: number;
};

export interface ChatDetailItem {
	id: string;
	creator_id: string;
	type: number;
	status: number;
	is_enc: number;
	last_read_sequence: number;
	last_sequence: number;
	last_time: number;
	created_at: number;
};