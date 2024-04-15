import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import RootSiblings from 'react-native-root-siblings';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import Navbar from "@/components/navbar";
import { scale } from "react-native-size-matters/extend";
import DropMenu, { DropMenuItem } from "./components/drop-menu";
import NavbarRight from "./components/navbar-right";
import ConversationItem, { Conversation, ConversationType } from "./components/conversation-item";
import dayjs from "dayjs";

import chatApi from '@/api/v2/chat';
import chatService from '@/service/chat.service'
import SelectMemberModal, { SelectMemberModalType, SelectMemberOption } from "@/components/select-member-modal";
import authService from "@/service/auth.service";
import groupService from "@/service/group.service";
import crypto from "react-native-quick-crypto";
import { RootStackParamList } from "@/types";
import ScanQrcodeModal, { ScanQrcodeModalType } from "../../components/scan-qrcode-modal";
import qs from "qs";
import friendService from "@/service/friend.service";
type Props = StackScreenProps<RootStackParamList, 'Home'>;
const HomeScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const elementRef = useRef<RootSiblings>();
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const selectMemberModalRef = useRef<SelectMemberModalType>(null);
    const [menus, setMenus] = useState<DropMenuItem[]>([]);
    const scanQrcodeModalRef = useRef<ScanQrcodeModalType>(null);

    const open = useCallback(() => {
        if (elementRef.current) {
            elementRef.current?.destroy();
        }
        elementRef.current = new RootSiblings(
            <DropMenu menus={menus} close={() => {
                if (elementRef.current) {
                    elementRef.current?.destroy();
                }
            }} />
        );
    }, [menus]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            chatService.mineChatList().then((res) => {
                const items:ConversationType[] = res.map((item) => {
                    return {
                        ...item,
                        timestamp: item.lastTime > 0 ? dayjs(item.lastTime) : undefined,
                        unread: item.lastSequence - item.lastReadSequence,
                    }
                });
                setConversations(items);
            })
        });
        setMenus([
            {
                title: '添加好友',
                onPress: () => {
                    if (elementRef.current) {
                        elementRef.current?.destroy();
                    }
                    navigation.navigate('AddFriend');
                },
                icon: require('@/assets/icons/useradd-black.svg'),
            },
            {
                title: '扫一扫',
                onPress: () => {
                    if (elementRef.current) {
                        elementRef.current?.destroy();
                    }
                    scanQrcodeModalRef.current?.open();
                },
                icon: require('@/assets/icons/scan-black.svg'),
            },
            {
                title: '创建群聊',
                onPress: async () => {
                    const data = await friendService.getList();
                    const options: SelectMemberOption[] = data.items.map((item) => {
                        return {
                            id: item.uid,
                            icon: item.avatar,
                            title: item.name,
                            name: item.name,
                            name_index: item.nameIndex,
                            status: false,
                            disabled: false,
                        }
                    });

                    selectMemberModalRef.current?.open({
                        title: '选择好友',
                        options,
                        callback: async (ops: SelectMemberOption[]) => {
                            const authInfo = await authService.info();
                            const name = authInfo?.name ?? options.slice(0, 3).map((user) => user.name).join(',');
                            const avatar = 'https://api.multiavatar.com/' + Buffer.from(crypto.randomBytes(16)).toString('hex') + '.png'
                            const group = await groupService.create(name, avatar);
                            await groupService.invite(group.id, ops,group);
                        }
                    });
                    if (elementRef.current) {
                        elementRef.current?.destroy();
                    }
                },
                icon: require('@/assets/icons/useradd-black.svg'),
            },
        ])
        return unsubscribe;
    }, [navigation]);
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
        }}>
            <View>
                <Navbar title="会话" renderLeft={() => null} renderRight={() => <NavbarRight onPress={open} />} />
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    keyExtractor={(item) => item.id}
                    data={conversations}
                    renderItem={({ item, index }) => <ConversationItem item={item} isLast={index === conversations.length - 1} />}
                    estimatedItemSize={scale(76)}
                />
            </View>
            <SelectMemberModal ref={selectMemberModalRef} />
            <ScanQrcodeModal ref={scanQrcodeModalRef} onScan={(data: string) => {
                const obj = qs.parse(data);
                if (obj?.gid) {
                    console.log('gid', obj.gid);
                    navigation.navigate('GroupInfo', {
                        gid: obj.gid as string,
                    });
                    return;
                }
                if (obj?.uid) {
                    console.log('uid', obj.uid);
                    navigation.navigate('UserInfo', {
                        uid: obj.uid as string,
                    });
                    return;
                }
            }} />
        </View>
    );
};
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        width: '100%',
    }
});