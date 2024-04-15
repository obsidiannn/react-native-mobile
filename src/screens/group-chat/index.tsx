import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
type Props = StackScreenProps<RootStackParamList, 'GroupChat'>;
import { UserInfoItem } from "@/api/types/user";
import userService from "@/service/user.service";
import { scale } from "react-native-size-matters/extend";
import { TouchableOpacity } from "react-native";
import { Image } from "@/components/image";
import { RootStackParamList } from "@/types";
import { globalStorage } from "@/lib/storage";
import groupService from "@/service/group.service";
import toast from "@/lib/toast";
import authService from "@/service/auth.service";
import { GroupDetailItem, GroupInfoItem } from "@/api/types/group";
import PagerView from "react-native-pager-view";
import ChatPage, { ChatPageRef } from './pagers/chat-page';
import InfoPage from "./pagers/info-page/index";
const GroupChatScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [keyboardState, setKeyboardState] = useState(false);
    const conversationIdRef = useRef<string>('');
    const groupIdRef = useRef<string> ('')
    const [title, setTitle] = useState<string>('');
    const [authUser, setAuthUser] = useState<UserInfoItem>();
    const [group, setGroup] = useState<GroupDetailItem>();
    const [pageIndex, setPageIndex] = useState(0);
    const chatPageRef = useRef<ChatPageRef>(null);
    const pagerViewRef = useRef<PagerView>(null);
    const [members, setMembers] = useState<UserInfoItem[]>([]);
    const loadMembers = useCallback(async () => {
        console.log(conversationIdRef.current,'群成员###')
        groupService.getMembers(groupIdRef.current).then(async (res) => {
            console.log(res,'群成员列表')
            const uids = res.map((item) => item.uid);
            const users = await userService.getBatchInfo(uids);
            console.log('用户信息',users);
            setMembers(users);
        });
    }, []);
    const init = useCallback(async () => {
        conversationIdRef.current = route.params.chatId ?? '';
        groupIdRef.current = route.params.groupId??''
        console.log('会话id conversationIdRef', conversationIdRef.current)
        console.log('群id', groupIdRef.current)
        const res = await groupService.getInfo(groupIdRef.current)
        console.log('群信息', res);
        if(res === null){
            toast('群组异常')
            return 
        }
        setGroup(res);
        setTitle(res?.name ?? '');
        if (!globalThis.wallet || !res?.pubKey) {
            toast('钱包未初始化');
            return;
        }
        const a = await authService.info()
        setAuthUser(a);
        chatPageRef.current?.init(conversationIdRef.current, res, a);
        loadMembers();
    }, [])
    useEffect(() => {
        // 监听页面获取焦点
        const focusEvent = navigation.addListener('focus', () => {
            init();
        });
        const blurEvent = navigation.addListener('blur', () => {
            chatPageRef.current?.close();
        });
        return () => {
            focusEvent();
            blurEvent();
        }
    }, [navigation])

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height)
            globalStorage.setItem('keyboardHeight', e.endCoordinates.height);
            setKeyboardState(true);
        }
        );
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardState(false);
        });
        if (globalThis.wallet) {
            userService.getInfo(globalThis.wallet.address.toLowerCase()).then((res) => {
                if (res) {
                    setAuthUser(res);
                }
            })
        }

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [])
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                paddingTop: insets.top,
                paddingBottom: keyboardState ? (Platform.OS == 'ios' ? keyboardHeight : 0) : 0,
            }}>
            <View style={{
                height: 40,
                width: '100%',
                backgroundColor: 'white',
            }}>
                <Navbar title={title} renderRight={() => {
                    return <View style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity onPress={() => {
                            pagerViewRef.current?.setPage(0);
                        }}>
                            <Image source={require('@/assets/icons/chat.svg')} style={{
                                width: scale(32),
                                height: scale(32),
                            }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            pagerViewRef.current?.setPage(1);
                        }}>
                            <Image source={require('@/assets/icons/more.svg')} style={{
                                width: scale(32),
                                height: scale(32),
                            }} />
                        </TouchableOpacity>

                    </View>
                }} />
            </View>
            <PagerView ref={pagerViewRef}
            scrollEnabled={false}
             style={{
                flex: 1,
                backgroundColor: '#F4F4F4',
            }} onPageSelected={(v) => {
                setPageIndex(v.nativeEvent.position);
            }} initialPage={pageIndex}>
                <ChatPage ref={chatPageRef} />
                <InfoPage onChangeMemberList={() => {
                    loadMembers();
                }} members={members} authUser={authUser} group={group ?? undefined} />
            </PagerView>
        </View>

    )
}
export default GroupChatScreen;