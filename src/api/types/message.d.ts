import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface MessageSendReq {
  id: string;
  chat_id: string;
  content: string;
  type: number;
  is_enc: number;
  receive_ids: string[];
}

export interface MessageListItem {
	id: string;
	is_read: number;
	sequence: number;
	created_at: number;
};

export type MessageExtra = {};

export type MessageAction = {};

export interface MessageDetailItem {
	id: string;
	chat_id: string;
	from_uid: string;
	content: string;
	status: number;
	type: number;
	is_enc: number;
	sequence: number;
	extra: Extra;
	action: Action;
	created_at: number;
};

export interface MessageDeleteByIdReq{
  chat_ids: string[]
}