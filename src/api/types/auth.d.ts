import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface AuthCheckRegisterResp {
	is_register: number;
};

export interface AuthRegisterResp{
	address: string;
	avatar: string;
	name: string;
	pub_key: string;
	create_time: number;
};


export interface AuthChangeNameReq{
	name: string;
};
export interface AuthChangeAvatarReq{
	avatar: string;
};
export interface AuthChangeGenderReq{
	gender: number;
};
export interface AuthChangeSignReq{
	sign: string;
};

export interface AuthBlackListItem{
	id:string;
  uid: string;
};
