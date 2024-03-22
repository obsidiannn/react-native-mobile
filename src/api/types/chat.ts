import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";
import { ChatTypeEnum } from "./enums";

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
	creatorId: string;
	type: ChatTypeEnum;
	status: number;
	isEnc: number;
	lastReadSequence: number;
	lastSequence: number;
	lastTime: number;
	createdAt: number;
	avatar: string
	sourceId: string
	chatAlias: string
};