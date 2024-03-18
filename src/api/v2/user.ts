import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq,BaseUIdArrayReq, BaseArrayResp } from "../types/common";
import {UserInfoResp,UserUIdInfo} from "../types/user"

// 批量获取用户信息
const getBatchInfo = (param: BaseUIdArrayReq):Promise<UserInfoResp>=> {
  return createRequestInstance(true).post('/user/get-batch-info', param);
}

// const userInfo = ():Promise

export default {
  getBatchInfo
}