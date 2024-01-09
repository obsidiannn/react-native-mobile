import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq,BaseUIdArrayReq, BaseArrayResp } from "../types/common";
import {UserInfoResp,UserUIdInfo} from "../types/user"

// 批量获取用户信息
const userGetBatchInfo = (param: BaseUIdArrayReq):Promise<UserInfoResp>=> {
  return createRequestInstance(true).post('/user/get-batch-info', param);
}
// 添加拉黑
const userAddBlack = (param: UserUIdInfo)=>{
  return createRequestInstance(true).post('/user/add-black', param);
}
// 黑名单列表
const userGetBlackList = ():Promise<BaseArrayResp<UserUIdInfo>> =>{
  return createRequestInstance(true).post('/user/black-list');
}