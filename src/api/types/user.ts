import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";


export interface UserInfoItem{
  id: string;
  avatar: string;
  name: string;
  nameIndex: string
  gender: number
  pubKey: string;
  sign: string;
}

export interface UserInfoResp{
  items:UserInfoItem[]
}

export interface UserUIdInfo{
  id: string;
  uid: string;
}