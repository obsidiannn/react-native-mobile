import { createRequestInstance } from "../lib/request";
import { BaseIdReq,BaseIdArrayReq, BaseArrayResp } from "../types/common";
import { AuthCheckRegisterResp ,AuthRegisterResp,
  AuthChangeNameReq,AuthChangeAvatarReq,AuthChangeGenderReq,
  AuthChangeSignReq,AuthBlackReq,AuthBlackListItem
} from '../types/auth'
import { UserInfoItem } from "../types/user";

// 是否已注册 todo
const checkRegister = ():Promise<AuthCheckRegisterResp> => {
  return createRequestInstance(true).post('/auth/is-register');
}

// 注册
const register = ():Promise<AuthRegisterResp> => {
  return createRequestInstance(true).post('/auth/register');
}

// 修改昵称
const changeName = (param: AuthChangeNameReq) => {
  return createRequestInstance(true).post('/auth/update-name',param);
}

// 修改头像
const changeAvatar = (param: AuthChangeAvatarReq) => {
  return createRequestInstance(true).post('/auth/update-avatar',param);
}

// 修改性别
const changeGender = (param: AuthChangeGenderReq) => {
  return createRequestInstance(true).post('/auth/update-gender',param);
}

// 修改签名
const changeSign = (param: AuthChangeSignReq) => {
  return createRequestInstance(true).post('/auth/update-sign',param);
}

// 账号注销
const signOut = () => {
  return createRequestInstance(true).post('/auth/unsubscribe');
}

// 黑名单列表
const blackList = ():Promise<BaseArrayResp<AuthBlackListItem>> => {
  return createRequestInstance(true).post('/auth/user-black-list');
}

// 执行拉黑
const authAddBlackList = (param: AuthBlackReq) => {
  return createRequestInstance(true).post('/auth/add-user-black',param);
}

// 移出黑名单
const removeBlackList = (param: AuthBlackReq) => {
  return createRequestInstance(true).post('/auth/remove-user-black',param);
}

/**
 * 是否注册
 */
export const isRegister = ():Promise<AuthCheckRegisterResp>=>{
  return createRequestInstance(true).post('/auth/is-register',{});
}

export const userInfo = ():Promise<UserInfoItem>=>{
  return createRequestInstance(true).post('/auth/user-info',{});
}

export default {
  checkRegister,
  register,
  changeName,
  changeAvatar,
  changeGender,
  changeSign,
  signOut,
  blackList,
  authAddBlackList,
  removeBlackList,
  isRegister,
  userInfo
}