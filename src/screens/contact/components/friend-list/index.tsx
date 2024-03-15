import { View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"
import ListItem from "./list-item"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react"
import { FriendInfoItem } from "@/api/types/friend"
import AlphabetIndex from "./alphabet-index"
import MenuList from "./menu-list"
import friendService from "@/service/friend.service"

export interface FriendListType {
    focus: () => void;
}

export default forwardRef((_,ref) => {
    const listRef = useRef<FlashList<any>>(null);
    const [contacts, setContacts] = useState<(FriendInfoItem)[]>([]);
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    const init = useCallback(async () => {
        let list = await friendService.getList();
        setContactAlphabetIndex(list.alphabetIndex);
        setAplphabet(list.alphabet);
        setContacts(list.items);
    },[]);
    useImperativeHandle(ref, () => ({
        focus: () => {
            init();
        }
    }));
    return <View style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
    }}>
        <View style={{
            flex: 1,
            paddingTop: verticalScale(15)
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>
                <FlashList
                    ListHeaderComponent={() => <MenuList />}
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