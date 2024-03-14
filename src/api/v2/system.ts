import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq, BaseArrayResp } from "../types/common";
import { 
  SystemPubKeyResp,
  SystemPreSignUrlUploadReq

} from '../types/system'

// 获取系统公钥
const getInfo = ():Promise<SystemPubKeyResp> => {
  return createRequestInstance(false).post('/system/info');
}

const uploadPreSignUrl = (param: SystemPreSignUrlUploadReq) =>{
 return createRequestInstance(true).post('/pre-sign-url',param);
}

export default {
  getInfo,
  uploadPreSignUrl
}