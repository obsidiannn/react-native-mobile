import { Keyboard, View, Platform, TouchableWithoutFeedback } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import tools from '../tools';
import { UserInfoItem } from "@/api/types/user";
import userService from "@/service/user.service";
import messageService from "@/service/message.service";
import ToastException from "@/exception/toast-exception";
import { verticalScale } from "react-native-size-matters/extend";
import EncImagePreview, { IEncImagePreviewRef } from "@/components/chat/enc-image-preview-modal";
import EncFilePreview, { IEncFilePreviewRef } from "@/components/chat/enc-file-preview-modal";
import LoadingModal, { ILoadingModalRef } from "@/components/common/loading-modal";
import InputToolkit, { InputToolKitRef } from "@/components/chat/input-toolkit";
import { DataType, IMessage, IMessageFile, IMessageImage, IMessageRedPacket, IMessageTypeMap } from "@/components/chat/input-toolkit/types";
import MessageList, { MessageListRefType } from "@/components/chat/message-list";
import { globalStorage } from "@/lib/storage";
import toast from "@/lib/toast";
import quickAes from "@/lib/quick-aes";
import { GroupDetailItem, GroupInfoItem, GroupMemberItemVO } from "@/api/types/group";
import colors from "@/config/colors";
import dayjs from 'dayjs'
import { WalletRemitReq } from "@/api/types/wallet";
import { RedPacketCreateReq } from "@/api/types/red-packet";
import RedPacketDialog, { RedPacketDialogType } from "@/screens/red-packet/red-packet-dialog";
import { RedPacketTypeEnum, SocketTypeEnum } from "@/api/types/enums";
import redPacketApi from "@/api/v2/red-packet";
import PacketDetail, { RedPacketDetailModalType } from "@/screens/red-packet/packet-detail";
import { ChatDetailItem } from "@/api/types/chat";
import EventManager from '@/lib/events'
import { SocketMessageEvent } from "@/api/types/message";
import { FlatList } from "react-native-gesture-handler";
import { id } from "ethers";

export interface ChatPageRef {
    init: (chatId: string,
        _chatItem: ChatDetailItem,
        author: UserInfoItem,
        groupItem: GroupDetailItem) => void;
    loadMember: (members: GroupMemberItemVO[]) => void
    close: () => void;
}
export default forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<IMessage<DataType>[]>([])
    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [keyboardState, setKeyboardState] = useState(false);
    const conversationIdRef = useRef<string>('');
    const [authUser, setAuthUser] = useState<UserInfoItem>();
    const [chatItem, setChatItem] = useState<ChatDetailItem>()
    const [group, setGroup] = useState<GroupDetailItem>()
    const sharedSecretRef = useRef<string>('');
    const firstSeq = useRef<number>(0);
    const lastSeq = useRef<number>(0);
    const loadingRef = useRef<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout>();
    const encImagePreviewRef = useRef<IEncImagePreviewRef>();
    const encFilePreviewRef = useRef<IEncFilePreviewRef>();
    const imagesRef = useRef<IMessageImage[]>([]);
    const loadingModalRef = useRef<ILoadingModalRef>();
    const inputToolkitRef = useRef<InputToolKitRef>(null);
    const redPacketDialogRef = useRef<RedPacketDialogType>();
    const redPacketDetailRef = useRef<RedPacketDetailModalType>();
    const [members, setMembers] = useState<GroupMemberItemVO[]>([])
    const messageListRef = useRef<MessageListRefType>();
    const loadMessages = useCallback(async (direction: 'up' | 'down', init?: boolean) => {
        if (loadingRef.current) {
            return;
        }
        loadingRef.current = true
        const seq = direction == 'up' ? firstSeq.current : lastSeq.current;
        if (!init && firstSeq.current === 1) {
            return
        }
        return messageService.getList(
            conversationIdRef.current,
            sharedSecretRef.current,
            seq,
            direction,
            init ?? false
        )
            .then((res) => {
                if (res.length <= 0) {
                    return
                }
                const ls = res[0].sequence ?? 0
                const fs = res[res.length - 1].sequence ?? 0
                let _data: any[] = []
                if (direction === 'up') {
                    if (firstSeq.current <= fs) {
                        return
                    } else {
                        _data = res.filter(r => {
                            if (init) {
                                return true
                            }
                            return (r.sequence ?? 0) < firstSeq.current
                        })
                        firstSeq.current = fs
                        if (_data.length > 0) {
                            setMessages((items) => {
                                return items.concat(_data)
                            });
                        }
                    }
                }

                if (direction === 'down') {
                    if (lastSeq.current >= ls) {
                        return
                    } else {
                        _data = res.filter(r => {
                            if (init) {
                                return true
                            }
                            return (r.sequence ?? 0) > lastSeq.current
                        })
                        lastSeq.current = ls
                        if (_data.length > 0) {
                            setMessages((items) => {
                                return items.concat(_data);
                            });
                            messageListRef.current?.scrollToEnd()
                        }
                    }
                }

                // 存儲圖片
                if (_data.length > 0) {
                    const tmps: IMessageImage[] = [];
                    _data.forEach((item) => {
                        if (item.type == 'image') {
                            tmps.push(item.data as IMessageImage)
                        }
                    });
                    imagesRef.current = tmps.concat(imagesRef.current);
                }

            }).catch((err) => {
                console.log('err', err);
            }).finally(() => {
                loadingRef.current = false;
            })
    }, [])
    const init = useCallback((
        chatId: string,
        _chatItem: ChatDetailItem,
        a: UserInfoItem,
        g: GroupDetailItem
    ) => {
        imagesRef.current = [];
        conversationIdRef.current = chatId;
        console.log('會話id conversationIdRef', conversationIdRef.current)
        setGroup(g)
        setChatItem(_chatItem)
        if (!globalThis.wallet || !g?.pubKey) {
            toast('錢包未初始化');
            return;
        }
        // const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(Buffer.from(g.pubKey, 'hex')).substring(4);
        const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(g.pubKey);
        console.log('sharedSecret', sharedSecret);
        sharedSecretRef.current = sharedSecret
        messageLoad(_chatItem)
        const _eventKey = EventManager.generateKey(SocketTypeEnum.MESSAGE, conversationIdRef.current)
        EventManager.addEventSingleListener(_eventKey, handleEvent)
        setAuthUser(a);
    }, []);

    const handleEvent = (e: any) => {
        console.log('[event]', e);
        const _eventItem = e as SocketMessageEvent
        if (lastSeq.current < _eventItem.sequence) {
            loadMessages('down')

        }
    }

    const messageLoad = async (_chatItem: ChatDetailItem) => {
        firstSeq.current = _chatItem.lastReadSequence
        lastSeq.current = _chatItem.lastReadSequence
        // 有未读
        if (_chatItem.lastReadSequence === 0 || _chatItem.lastReadSequence === _chatItem.lastSequence) {
            loadMessages('up', true);
        } else {
            loadMessages('down', true);
        }
    }

    const close = useCallback(() => {
        const _eventKey = EventManager.generateKey(SocketTypeEnum.MESSAGE, conversationIdRef.current)
        EventManager.removeListener(_eventKey, handleEvent)
        
        setMessages([]);
        firstSeq.current = 0;
        lastSeq.current = 0;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

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
    useImperativeHandle(ref, () => ({
        init,
        close,
        loadMember: (members: GroupMemberItemVO[]) => {
            setMembers(members)
        }
    }));

    const onSwap = async (req: WalletRemitReq) => {
        console.log('发起转账', req);
        loadingModalRef.current?.open('处理中...');
        setTimeout(() => {
            messageService.doRemit(
                { ...req, chatId: conversationIdRef.current },
                sharedSecretRef.current, 'gswap'
            ).then(res => {
                const { sequence = 0 } = res;
                if (sequence > lastSeq.current) {
                    lastSeq.current = sequence;
                }
                const message: IMessage<'gswap'> = {
                    mid: req.id,
                    type: 'gswap',
                    state: 1,
                    time: dayjs(res.time),
                    sequence: res.sequence,
                    data: {
                        amount: req.amount,
                        remark: req.remark ?? '',
                        uid: req.objUId
                    }
                }
                setMessages((items) => {
                    return [{ ...message, user: authUser } as IMessage<DataType>].concat(items);
                });
            }).finally(() => {
                loadingModalRef.current?.close();
            })
        }, 1000)
    }



    const onRedPacketFunc = async (req: RedPacketCreateReq) => {
        console.log('发起紅包', req);
        loadingModalRef.current?.open('处理中...');
        setTimeout(() => {
            messageService.doRedPacket(
                { ...req, sender: authUser?.id },
                sharedSecretRef.current, 'gpacket'
            ).then(res => {
                const { sequence = 0 } = res;
                if (sequence > lastSeq.current) {
                    lastSeq.current = sequence;
                }
                const message: IMessage<'gpacket'> = {
                    mid: req.id,
                    type: 'gpacket',
                    state: 1,
                    time: dayjs(res.createdAt),
                    sequence: res.sequence,
                    data: {
                        remark: res.remark ?? '',
                        sender: res.fromUid,
                        packetId: res.packetId,
                        type: req.type,
                    }
                }
                setMessages((items) => {
                    return [{ ...message, user: authUser } as IMessage<DataType>].concat(items);
                });
            }).finally(() => {
                loadingModalRef.current?.close();
            })
        }, 1000)
    }


    return (
        <>
            <View style={{
                flex: 1,
                backgroundColor: colors.gray100,
            }}>
                <TouchableWithoutFeedback accessible={false} onPress={() => {
                    Keyboard.dismiss();
                    inputToolkitRef.current?.down();
                }}>
                    <View style={{
                        flex: 1,
                        scaleY: -1,
                        width: '100%',
                        paddingBottom: keyboardState ? verticalScale(60) : (verticalScale(60) + insets.bottom),
                    }}>
                        <MessageList authUid={authUser?.id ?? ''}
                            encKey={sharedSecretRef.current}
                            ref={messageListRef}
                            messages={messages} onLongPress={(m) => {
                                console.log('長按', m);
                            }}
                            onTopReached={() => {
                                return loadMessages('up')
                            }}
                            onEndReached={() => {
                                return loadMessages('down')
                            }}
                            onPress={(m) => {
                                const data = m.data as IMessageTypeMap[DataType];
                                if (m.type == 'image') {
                                    console.log('點擊圖片', m);
                                    const data = m.data as IMessageImage;
                                    const initialIndex = imagesRef.current.findIndex((image) => image.original == data.original)
                                    if (m.state == 1) {
                                        encImagePreviewRef.current?.open({
                                            encKey: sharedSecretRef.current,
                                            images: imagesRef.current,
                                            initialIndex,
                                        })
                                    }
                                }
                                if (m.type == 'file') {
                                    if (m.data && m.state == 1) {
                                        encFilePreviewRef.current?.open({
                                            encKey: sharedSecretRef.current,
                                            file: m.data as IMessageFile,
                                        })
                                    }
                                }
                                if (m.type === 'packet' || m.type === 'gpacket') {
                                    const _data = m.data as IMessageRedPacket
                                    if (_data.pkInfo) {
                                        if (_data.pkInfo?.enable === false || _data.pkInfo?.touchFlag === true) {
                                            // jump
                                            redPacketDetailRef.current?.open({ id: _data.packetId })
                                            return
                                        }

                                        if (_data?.type === RedPacketTypeEnum.TARGETED) {
                                            if (authUser?.id !== _data.objUId) {
                                                // jump
                                                redPacketDetailRef.current?.open({ id: _data.packetId })
                                                return
                                            }
                                        }

                                        redPacketDialogRef.current?.open({
                                            data: _data,
                                            onPress: () => {
                                                console.log('调用');
                                                console.log(_data.pkInfo);

                                                if (_data?.pkInfo?.enable) {
                                                    // 如果可以抢
                                                    if (_data?.type === RedPacketTypeEnum.TARGETED) {
                                                        if (authUser?.id === _data.objUId) {
                                                            // // 抢
                                                            redPacketApi.touchPacket({ id: _data.packetId }).then(res => {
                                                                if (_data.stateFunc) {
                                                                    _data.stateFunc(res.result)
                                                                }
                                                                redPacketDetailRef.current?.open({ id: _data.packetId })
                                                            })
                                                        }
                                                    } else {
                                                        // 抢
                                                        redPacketApi.touchPacket({ id: _data.packetId }).then(res => {
                                                            if (_data.stateFunc) {
                                                                _data.stateFunc(res.result)
                                                            }
                                                            redPacketDetailRef.current?.open({ id: _data.packetId })
                                                        })
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                            }} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View
                style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: Platform.select({
                        ios: 0,
                        android: keyboardState ? (Platform.OS == 'ios' ? keyboardHeight : 0) : 0,
                    })
                }}>
                <InputToolkit ref={inputToolkitRef} sourceId={group?.gid}
                    members={members}
                    onSwap={onSwap}
                    onRedPacket={onRedPacketFunc}
                    onSend={async (message) => {
                        console.log('發送消息@@@@@@@', message);
                        if (!group) {
                            throw new ToastException('信息錯誤！');
                        }
                        if (message.type === 'gswap') {
                            return
                        }
                        setMessages((items) => {
                            return items.concat([{ ...message, user: authUser } as IMessage<DataType>])
                        });
                        setTimeout(() => {
                            if (message.type == 'image' || message.type == "file") {
                                loadingModalRef.current?.open('加密處理中...');
                            }
                            messageService.send(conversationIdRef.current, sharedSecretRef.current, message).then((res) => {
                                if (!res) {
                                    return;
                                }
                                // 將消息狀態改爲已發送
                                const { sequence = 0 } = res;
                                if (sequence > lastSeq.current) {
                                    lastSeq.current = sequence;
                                }
                                setMessages((items) => {
                                    const index = items.findIndex((item) => item.mid == message.mid);
                                    if (index > -1) {
                                        items[index].state = 1;
                                        items[index].sequence = sequence;
                                        if (message.type == 'image') {
                                            items[index].data = res.data as IMessageImage;
                                            imagesRef.current.push(res.data as IMessageImage);
                                        } else if (message.type == 'file') {
                                            const data = res.data as IMessageFile;
                                            message.data = {
                                                ...data,
                                                path: data.path,
                                            };
                                            const file = message.data;
                                            if (file) {
                                                file.path = data.path;
                                                items[index].data = file;
                                            }

                                        }
                                    }
                                    return items;
                                });
                            }).catch((err) => {
                                // 將消息狀態改爲發送失敗
                                console.log('發送失敗', err);
                                setMessages((items) => {
                                    const index = items.findIndex((item) => item.mid == message.mid);
                                    if (index > -1) {
                                        items[index].state = 2;
                                    }
                                    return items;
                                });
                            }).finally(() => {
                                loadingModalRef.current?.close();
                            })
                        }, 100)

                    }} tools={tools} />
            </View>
            <EncImagePreview ref={encImagePreviewRef} />
            <EncFilePreview ref={encFilePreviewRef} />
            <LoadingModal ref={loadingModalRef} />
            <RedPacketDialog ref={redPacketDialogRef} />
            <PacketDetail ref={redPacketDetailRef} />
        </>
    )
});