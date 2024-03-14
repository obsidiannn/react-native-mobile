import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface AuthCheckRegisterResp {
	isRegister: number;
};

export interface AuthRegisterResp{
	address: string;
	avatar: string;
	name: string;
	pubKey: string;
	createTime: number;
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
  uid: string;
  createdAt: number;
};

export interface AuthBlackReq{
  uid: string;
};
