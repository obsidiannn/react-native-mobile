import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";


export interface UserInfoItem{
  id: string;
  avatar: string;
  name: string;
  gender: number
}

export interface UserInfoResp{
  items:UserInfoItem
}

export interface UserUIdInfo{
  id: string;
  uid: string;
}