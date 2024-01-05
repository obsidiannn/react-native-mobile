import { createRequestInstance } from "./lib/request";


export interface CreateGroupParams {
    id: string;
    name: string;
    avatar: string;
    // 加密后的私钥 存储在群成员信息
    enc_pri: string;
    // 加密公钥 创建时存储在群信息
    pub: string;
    // 加密后的key 存储在群成员信息
    enc_key: string;
}
const create = (params: CreateGroupParams): Promise<null> => {
    return createRequestInstance(true).post('/group/create', params);
}
export interface GroupListItem {
    id: string;
    name: string;
    avatar: string;
    create_time: number;
}
const getList = (): Promise<{
    items: GroupListItem[]
}> => {
    return createRequestInstance(true).post('/group/list');
}
export interface GroupMemberListItem {
    id: string;
    uid: string;
    gid: string;
    role: number;
    my_alias: string;
    admin_time: number;
    // 加密的私钥 仅管理员、群主 有此属性
    enc_pri?: string;
    enc_key: string;
    create_time: number;
}

export interface GroupGetMembersByIdsParams {
    ids: string[];
}

const getMembersByIds = async (params: GroupGetMembersByIdsParams): Promise<{
    items: GroupMemberListItem[]
}> => {
    return createRequestInstance(true).post('/group/membersByIds', params);
}

export interface GroupUpdateAvatarParams {
    id: string;
    avatar: string;
}

export interface GroupUpdateNameParams {
    id: string;
    name: string;
}

const updateAvatar = (params: GroupUpdateAvatarParams) => {
    return createRequestInstance(true).post('/group/updateAvatar', params);
}
const updateName = (params: GroupUpdateNameParams) => {
    return createRequestInstance(true).post('/group/updateName', params);
}


export interface GroupUpdateMyAliasParams {
    id: string;
    avatar: string;
}
const updateMyAlias = (params: GroupUpdateMyAliasParams) => {
    return createRequestInstance(true).post('/group/updateMyAlias', params);
}


export interface GroupKickOutParams {
    id: string;
    uids: string[];
}
const kickOut = (params: GroupKickOutParams) => {
    return createRequestInstance(true).post('/group/kickOut', params);
}

const quitByIds = (ids: string) => {
    return createRequestInstance(true).post('/group/quitByIds', { ids });
}
const quitAll = () => {
    return createRequestInstance(true).post('/group/quitAll');
}

export interface GroupUpdateNoticeParams {
    id: string;
    notice: string;
}

const updateNotice = (params: GroupUpdateNoticeParams) => {
    return createRequestInstance(true).post('/group/updateNotice', params);
}

export interface GroupUpdateDescParams {
    id: string;
    desc: string;
}
const updateDesc = (params: GroupUpdateDescParams) => {
    return createRequestInstance(true).post('/group/updateDesc', params);
}

export interface GroupTransferParams {
    id: string;
    uid: string;
}
const transfer = (params: GroupTransferParams) => {
    return createRequestInstance(true).post('/group/transfer', params);
}

export interface GroupAddAdminParams {
    id: string;
    admins: {
        uid: string;
        enc_pri: string;
        enc_key: string;
    }[];
}

const addAdmin = (params: GroupAddAdminParams) => {
    return createRequestInstance(true).post('/group/addAdmin', params);
}

export interface GroupRemoveAdminParams {
    id: string;
    uids: string[];
}
const removeAdmin = (params: GroupRemoveAdminParams) => {
    return createRequestInstance(true).post('/group/removeAdmin', params);
}

// 解散群
export interface GroupDismissByIdsParams {
    ids: string[];
}
const dismissByIds = (params: GroupDismissByIdsParams) => {
    return createRequestInstance(true).post('/group/dismissByIds', params);
}

// 清除群消息
export interface GroupClearMessageByIdsParams {
    ids: string[];
}
const clearMessageByIds = (params: GroupClearMessageByIdsParams) => {
    return createRequestInstance(true).post('/group/clearMessageByIds', params);
}

// 群分类列表
export interface GroupCategoryListParams {
    id: string;
}
// 群分类结构
export interface GroupCategoryListItem {
    id: string;
    name: string;
}
const categoryList = (params: GroupCategoryListParams): Promise<{
    items: GroupCategoryListItem[]
}> => {
    return createRequestInstance(true).post('/group/categoryList', params);
}
// 更新群分类
export interface GroupUpdateCategoryParams {
    id: string;
    category_ids: string[];
}

// 群详情
export interface GroupDetailByIdsParams {
    ids: string[];
}


export interface GroupInfoItem {
    id: string;
    name: string;
    avatar: string;
    notice: string;
    desc: string;
    member_total: number;
    member_limit: number;
    owner: string;
    notice_md5: string;
    pub: string;
}

const detailByIds = (params: GroupDetailByIdsParams): Promise<{
    items: GroupInfoItem[]
}> => {
    return createRequestInstance(true).post('/group/detailByIds', params);
}
// 公告详情
export interface GroupNoticeDetailParams {
    id: string;
}
export interface GroupNoticeDetailItem {
    id: string;
    notice: string;
    notice_md5: string;
}
const noticeDetail = (params: GroupNoticeDetailParams): Promise<{
    items: GroupNoticeDetailItem[]
}> => {
    return createRequestInstance(true).post('/group/noticeDetail', params);
}
// 获取群加密信息
export interface GroupEncInfoParams {
    ids: string[];
}
export interface GroupEncInfoItem {
    gid: string;
    enc_pri: string;
    enc_key: string;
}
const encInfoByIds = (params: GroupEncInfoParams): Promise<{
    items: GroupEncInfoItem[]
}> => {
    return createRequestInstance(true).post('/group/encInfoByIds', params);
}
// 申请加入群组
export interface GroupJoinParams {
    id: string;
}
const join =async (params: GroupJoinParams): Promise<null> => {
    return createRequestInstance(true).post('/group/join', params);
};
// 管理员同意加入群组
export interface GroupAdminAgreeParams {
    id: string;
    uid: string;
    enc_key: string;
}
const adminAgree = (params: GroupAdminAgreeParams): Promise<null> => {
    return createRequestInstance(true).post('/group/adminAgree', params);
};


// 用户同意
export interface GroupAgreeParams {
    id: string;
}
const agree = (params: GroupAgreeParams): Promise<null> => {
    return createRequestInstance(true).post('/group/agree', params);
};
// 邀请用户加入群组
export interface GroupInviteParams {
    id: string;
    items: {
        uid: string;
        enc_key: string;
    }[]
}
const invite = (params: GroupInviteParams): Promise<null> => {
    return createRequestInstance(true).post('/group/inviteJoin', params);
};

export interface ApplyListItem {
    id: string;
    name: string;
    avatar: string;
    uid: string;
    gid: string;
    status: number; // 1: 申请中 2: 已同意 3: 已拒绝
    create_time: number;
}

const myApplyList = (ids: string[]): Promise<{
    items: ApplyListItem[]
}> =>{
    return createRequestInstance(true).post('/group/myApplyList',{ids});
}
const applyList = (ids: string[] = []): Promise<{
    items: ApplyListItem[]
}> =>{
    return createRequestInstance(true).post('/group/applyList',{ids});
}
const rejectJoin = (params: {group_id: string,uids:string[]}) => {
    console.log(params);
    return createRequestInstance(true).post('/group/rejectJoin', params);
}

export default {
    getList,
    create,
    getMembersByIds,
    updateAvatar,
    updateMyAlias,
    kickOut,
    updateName,
    quitAll,
    quitByIds,
    updateNotice,
    updateDesc,
    transfer,
    addAdmin,
    removeAdmin,
    dismissByIds,
    clearMessageByIds,
    detailByIds,
    categoryList,
    noticeDetail,
    encInfoByIds,
    join,
    applyList,
    myApplyList,
    adminAgree,
    invite,
    agree,
    rejectJoin
}
