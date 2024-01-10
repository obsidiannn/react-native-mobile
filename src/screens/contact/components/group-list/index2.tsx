import { View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"
import ListItem from "./list-item"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { FriendListItem } from "@/api/friend";
import AlphabetIndex from "./alphabet-index";
import MenuList from "./menu-list";
import Navbar from "@/components/navbar";
import group from "@/api/v2/group"

export interface GroupListType {
    focus: () => void;
}
export default forwardRef((_,ref) => {
    const listRef = useRef<FlashList<any>>(null);
   
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    let one:FriendListItem = {
      uid: "string",
      gender: 1,
      name_index:"string",
      chat_id: "string",
      avatar: "https://avatars.githubusercontent.com/u/122279700?v=4",
      pub_key:"string",
      name:"Ream Mixin",
    }
    const [contacts, setContacts] = useState<(FriendListItem)[]>([one,one,one,one,one,one,one,one,one,one,one,one,one]);
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