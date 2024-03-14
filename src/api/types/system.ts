import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface SystemPubKeyResp {
	pubKey: string;
	staticUrl: string;
};

export interface SystemPreSignUrlUploadReq {
  url: string;
}