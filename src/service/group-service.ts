import groupApi from "@/api/v2/group";


 // 获取群组列表
const getList = async () => {
  return groupApi.mineGroupList({});
}



export  default {getList}