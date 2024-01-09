import { BasePageReq,BasePageResp,CommonEnum,GroupTypeEnum } from "./common";

export interface SystemPubKeyResp {
	pub_key: string;
	static_url: string;
};

export interface SystemPreSignUrlUploadReq {
  url: string;
}