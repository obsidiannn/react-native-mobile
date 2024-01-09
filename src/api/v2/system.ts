import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq, BaseArrayResp } from "../types/common";
import { 
  SystemPubKeyResp,
  SystemPreSignUrlUploadReq

} from '../types/system'


const systemGetPubKey = ():Promise<SystemPubKeyResp> => {
  return createRequestInstance(true).post('/sys/info');
}

const uploadPreSignUrl = (param: SystemPreSignUrlUploadReq) =>{
 return createRequestInstance(true).post('/pre-sign-url',param);
}