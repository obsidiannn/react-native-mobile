import { ChatDetailItem } from '@/api/types/chat';
import chatApi from '@/api/v2/chat';

/**
 * 我的消息列表
 */
const mineChatList = async ():Promise<ChatDetailItem[]> =>{
    const list = await chatApi.mineChatList()
    if(list.items.length <= 0){
        return []
    }
    const chatIds = list.items.map(i=>i.chatId)
    return (await chatApi.chatDetail({ids: chatIds})).items??[]
}

export default {
    mineChatList
}