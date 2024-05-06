import { SocketTypeEnum } from "./enums";

export interface MessageSendReq {
  id: string;
  chatId: string;
  content: string;
  type: number;
  isEnc: number;
  receiveIds?: string[];
  extra? :MessageExtra
  action?: MessageAction
}
export interface MessageSendResp {
	sequence: number;
	id: string;
	fromUid: string;
	content: string;
}

export interface MessageListReq{
	chatId: string
	sequence: number
	direction: string
	limit: number
}

export interface MessageListItem {
	id: string;
	msgId: string;
	isRead: number;
	sequence: number;
	createdAt: Date;
};

export type MessageExtra = {
	id?:string
	
};

export type MessageAction = {};

export interface MessageDetailReq{
	chatId: string
	ids: string[]
}

export interface MessageDetailItem {
	id: string;
	chatId: string;
	fromUid: string;
	content: string;
	status: number;
	type: number;
	isEnc: number;
	sequence: number;
	extra: MessageExtra;
	action: MessageAction;
	createdAt: Date;
};

export interface MessageDeleteByIdReq{
  chatIds: string[]
}

export interface MessageDeleteByMsgIdReq{
	msgIds: string[]
}

export interface IEvent {
	type: SocketTypeEnum
}

export interface SocketMessageEvent extends IEvent {
	chatId: string
	msgId: string
	sequence: number
	date: Date
}
