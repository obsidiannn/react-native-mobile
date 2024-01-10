import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq, BaseArrayResp } from "../types/common";
import { AuthCheckRegisterResp ,AuthRegisterResp,
  AuthChangeNameReq,AuthChangeAvatarReq,AuthChangeGenderReq,
  AuthChangeSignReq,AuthBlackListItem
} from '../types/auth'

// 是否已注册 todo
const authCheckRegister = ():Promise<AuthCheckRegisterResp> => {
  return createRequestInstance(true).post('/auth/is-register');
}

// 注册
const authRegister = ():Promise<AuthRegisterResp> => {
  return createRequestInstance(true).post('/auth/is-register');
}

// 修改昵称
const authChangeName = (param: AuthChangeNameReq) => {
  return createRequestInstance(true).post('/auth/update-name',param);
}

// 修改昵称
const authChangeAvatar = (param: AuthChangeAvatarReq) => {
  return createRequestInstance(true).post('/auth/update-avatar',param);
}

// 修改性别
const authChangeGender = (param: AuthChangeGenderReq) => {
  return createRequestInstance(true).post('/auth/update-gender',param);
}

// 修改签名
const authChangeSign = (param: AuthChangeSignReq) => {
  return createRequestInstance(true).post('/auth/update-sign',param);
}

// 账号注销
const authSignOut = () => {
  return createRequestInstance(true).post('/auth/unsubscribe');
}

// 黑名单列表
const authBlackList = ():Promise<BaseArrayResp<AuthBlackListItem>> => {
  return createRequestInstance(true).post('/auth/user-black-list');
}

// 执行拉黑
const authAddBlackList = (param: AuthBlackListItem) => {
  return createRequestInstance(true).post('/auth/add-user-black',param);
}