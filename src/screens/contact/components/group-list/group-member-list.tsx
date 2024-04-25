import { View, Modal } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"
import GroupMemberItem from "./group-member-item"
import { FlashList } from "@shopify/flash-list"
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react"
import AlphabetIndex from "./alphabet-index"
import groupService from "@/service/group.service"
import colors from "@/config/colors"
import { GroupMemberItemVO } from "@/api/types/group"
import Navbar from "@/components/navbar"

export interface GroupMemberListType {
    open: (params: {
        gid?: string,
        members?: GroupMemberItemVO[],
        onPress: (uid: string) => void
    }) => void
}

export default forwardRef((_, ref) => {
    const listRef = useRef<FlashList<any>>(null);
    const [contacts, setContacts] = useState<GroupMemberItemVO[]>([]);
    const [contactAlphabetIndex, setContactAlphabetIndex] = useState<{ [key: string]: number }>({});
    const [aplphabet, setAplphabet] = useState<string[]>([]);
    const [visible, setVisible] = useState<boolean>(false)
    const onPressRef = useRef<(uid: string) => void>();


    useImperativeHandle(ref, () => ({
        open: async (params: {
            gid: string,
            members?: GroupMemberItemVO[],
            onPress: (uid: string) => void
        }) => {
            if (params.members && params.members.length > 0) {
                const { alphabet, alphabetIndex } = groupService.alphabetList(params.members)
                setContactAlphabetIndex(alphabetIndex);
                setAplphabet(alphabet);
                setContacts(params.members);
            } else {
                const items = await groupService.getMemberList(params.gid)
                const { alphabet, alphabetIndex } = groupService.alphabetList(items)
                setContactAlphabetIndex(alphabetIndex);
                setAplphabet(alphabet);
                setContacts(items);
            }

            onPressRef.current = params.onPress

            setVisible(true)
        }
    }));
    return <Modal style={{ flex: 1, backgroundColor: colors.gray200 }}
        transparent={false} visible={visible}
    >
        <Navbar title="发起转账" onLeftPress={() => {
            setVisible(false)
        }} />
        <View style={{
            flex: 1,
            paddingTop: verticalScale(15)
        }}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>
                <FlashList
                    ref={listRef}
                    data={contacts}
                    renderItem={({ item, index }) => {
                        return <GroupMemberItem item={item}
                            isLast={index === contacts.length - 1}
                            onPress={() => {
                                onPressRef.current?.(item.uid)
                                setVisible(false)
                            }}
                        />;
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

    </Modal>
});