import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface ChatListItem {
	id: string;
	chat_id: string;
	is_top: number;
	is_mute: number;
	is_show: number;
	is_hide: number;
	max_read_seq: number;
	last_online_time: number;
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