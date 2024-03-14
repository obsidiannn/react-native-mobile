import { View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"
import ListItem from "./list-item"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { FriendInfoItem } from "@/api/types/friend";
import AlphabetIndex from "./alphabet-index";
import MenuList from "./menu-list";
import Navbar from "@/components/navbar";
import group from "@/api/v2/group"
import { createRecordInTransaction } from "@/model/index"

export interface GroupListType {
    focus: () => void;
}
export default forwardRef((_,ref) => {
    const listRef = useRef<FlashList<any>>(null);
   
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    let one:FriendInfoItem = {
      uid: "string",
      gender: 1,
      nameIndex:"string",
      chatId: "string",
      avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
      pubKey:"string",
      name:"Ream Mixin",
      remark: '',
      remarkIndex: ''
    }
    const [contacts, setContacts] = useState<(FriendInfoItem)[]>([one,one,one,one,one,one,one,one,one,one,one,one,one]);
    console.log("sqlite");
              
    createRecordInTransaction("posts",(e)=>{
                e.title = "title"
                e.body= "body"
                e.subtitle ="sub",
                e.isPinned = false
              }).then(r=>{
                console.log("插入数据库");
                console.log(r)
              })
    useImperativeHandle(ref, () => ({
        focus: () => {
              
        }
    }));
    return <View style={{
        flex: 1,
        display: 'flex',
        // flexDirection: 'row'
    }}>
        
        <View style={{
            flex: 1,
            // paddingTop: verticalScale(15)
        }}>
          <Navbar title="群聊" backgroundColor="white" />
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>
                <FlashList
                    // ListHeaderComponent={() => <MenuList />}
                    ref={listRef}
                    data={contacts}
                    renderItem={({ item, index }) => {
                        return <ListItem item={item} isLast={index === contacts.length - 1} />;
                    }}
                    estimatedItemSize={scale(60)}
                />
            </View>
        </View>
        <View style={{
            width: scale(32)
        }}>
            <AlphabetIndex alphabet={aplphabet} contactAlphabetIndex={contactAlphabetIndex} onScrollToIndex={(v) => {
                listRef.current?.scrollToIndex({
                    index: v,
                    animated: true,
                });
            }} />
        </View>

    </View>
});