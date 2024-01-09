export interface BaseResp<T> {
  code:number,
  msg: string,
  data: T
}

export interface BasePageReq {
  limit: number ;
  page: number;
}

export interface BasePageResp<T>{
  page: number,
  limit: number,
  items: T[],
  status: number,
}

export interface BaseArrayResp<T>{
  items: T[]
}

export interface BaseIdReq {
  id: string,
}

export interface BaseIdArrayReq {
  id: string[],
}

export interface BaseIdsArrayReq {
  ids: string[],
}

export interface BaseUIdArrayReq {
  uids: string[],
}

export enum CommonEnum {
  OFF = 0,
  ON = 1,
}

export enum GroupTypeEnum {
  NORMAL = 1,
  PAY = 2,
  PRIVATE = 3,
}