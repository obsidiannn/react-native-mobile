import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard, View, Platform, Pressable, TouchableWithoutFeedback } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import Navbar from "@/components/navbar";
import tools from './tools';
type Props = StackScreenProps<RootStackParamList, 'UserChat'>;
import { UserInfoItem } from "@/api/types/user";
import friendService from "@/service/friend.service";
import userService from "@/service/user.service";
import messageService from "@/service/message.service";
import ToastException from "@/exception/toast-exception";
import { FriendInfoItem } from "@/api/types/friend";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { TouchableOpacity } from "react-native";
import { Image } from "@/components/image";
import EncImagePreview, { IEncImagePreviewRef } from "@/components/chat/enc-image-preview-modal";
import EncFilePreview, { IEncFilePreviewRef } from "@/components/chat/enc-file-preview-modal";
import EncVideoPreview, { IEncVideoPreviewRef } from "@/components/chat/enc-video-preview-model";
import LoadingModal,{ILoadingModalRef} from "@/components/common/loading-modal";
import { RootStackParamList } from "@/types";
import InputToolkit, { InputToolKitRef } from "@/components/chat/input-toolkit";
import { DataType, IMessage, IMessageFile, IMessageImage, IMessageRedPacket, IMessageTypeMap, IMessageVideo } from "@/components/chat/input-toolkit/types";
import MessageList from "@/components/chat/message-list";
import { globalStorage } from "@/lib/storage";
import { WalletRemitReq } from "@/api/types/wallet";
import dayjs from 'dayjs'
import { SimplePacketCreateModalType } from "../red-packet/simple-packet";
import { RedPacketCreateReq } from "@/api/types/red-packet";
import RedPacketDialog, { RedPacketDialogType } from "../red-packet/red-packet-dialog";
import PacketDetail, { RedPacketDetailModalType } from "../red-packet/packet-detail";
import { RedPacketTypeEnum } from "@/api/types/enums";
import redPacketApi from "@/api/v2/red-packet";
const UserChatScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<IMessage<DataType>[]>([])

    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [keyboardState, setKeyboardState] = useState(false);
    const conversationIdRef = useRef<string>('');
    const [title, setTitle] = useState<string>('');
    const [authUser, setAuthUser] = useState<UserInfoItem>();
    const [user, setUser] = useState<FriendInfoItem>();
    const sharedSecretRef = useRef<string>('');
    const firstSeq = useRef<number>(0);
    const lastSeq = useRef<number>(0);
    const loadingRef = useRef<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout>();
    const encImagePreviewRef = useRef<IEncImagePreviewRef>();
    const encFilePreviewRef = useRef<IEncFilePreviewRef>();
    const encVideoPreviewRef = useRef<IEncVideoPreviewRef>();
    const imagesRef = useRef<IMessageImage[]>([]);
    const listRef = useRef<FlashList<IMessage<DataType>>>();
    const loadingModalRef = useRef<ILoadingModalRef>();
    const redPacketDialogRef = useRef<RedPacketDialogType>();
    const redPacketDetailRef = useRef<RedPacketDetailModalType>();

    const inputToolkitRef = useRef<InputToolKitRef>(null);
    const loadMessages = useCallback((direction: 'up' | 'down') => {
        if (loadingRef.current) {
            return;
        }
        const seq = direction == 'up' ? firstSeq.current : lastSeq.current;
        messageService.getList(conversationIdRef.current, sharedSecretRef.current, seq, direction).then((res) => {
            if (res.length > 0) {
                if (direction == 'up') {
                    firstSeq.current = res[res.length - 1].sequence ?? 0;
                    if (lastSeq.current == 0) {
                        lastSeq.current = res[0].sequence ?? 0;
                    }
                } else {
                    lastSeq.current = res[res.length - 1].sequence ?? 0;
                }
            }
            console.log('消息列表', res);
            setMessages((items) => {
                const result = res.concat(items);
                
                return result
            });
            // 存儲圖片
            const tmps: IMessageImage[] = [];
            res.forEach((item) => {
                if (item.type == 'image') {
                    tmps.push(item.data as IMessageImage)
                }
            });
            imagesRef.current = tmps.concat(imagesRef.current);
            console.log('圖片列表', imagesRef.current);
        }).catch((err) => {
            console.log('err', err);
        }).finally(() => {
            loadingRef.current = false;
        })
    }, [])
    useEffect(() => {
        // 監聽頁面獲取焦點
        const focusEvent = navigation.addListener('focus', () => {
            console.log('focus');
            
            setMessages([]);
            imagesRef.current = [];
            const _chatItem = route.params.item
            conversationIdRef.current = _chatItem.id;
            //conversationIdRef.current = 's_e36812780132627e';
            console.log('會話id conversationIdRef', conversationIdRef.current)
            const uid = _chatItem.sourceId;//'0xb929da34c0791dff8541fc129c5b61323a996a7a';//
            if (!uid) {
                navigation.goBack();
                return;
            }
            friendService.getInfo(uid).then((res) => {
                console.log('好友信息', res);
                if (res && globalThis.wallet) {
                    let pubKey = res.pubKey;
                    sharedSecretRef.current = globalThis.wallet.signingKey.computeSharedSecret(pubKey);
                    setUser(res);
                    setTitle((res?.remark ) || res.name);
                    loadMessages('up');
                    loadMessages('down');
                    // TODO: 這裏臨時是定時調用的
                    // intervalRef.current = setInterval(() => {
                    //     loadMessages('down');
                    // }, 2000);
                }
            })
        });
        const blurEvent = navigation.addListener('blur', () => {
            setMessages([]);
            firstSeq.current = 0;
            lastSeq.current = 0;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
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
            userService.getInfo(globalThis.wallet.address).then((res) => {
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


    const onSwap = async (req: WalletRemitReq)=>{
            console.log('发起转账', req);
            if (!user) {
                throw new ToastException('信息錯誤！');
            }
            loadingModalRef.current?.open('处理中...');
            setTimeout(()=>{
                messageService.doRemit({...req,chatId: conversationIdRef.current},
                    sharedSecretRef.current,'swap').then(res=>{
                    const { sequence = 0 } = res;
                    if (sequence > lastSeq.current) {
                        lastSeq.current = sequence;
                    }
                    const message: IMessage<'swap'> = {
                        mid: req.id,
                        type: 'swap',
                        state: 1,
                        time: dayjs(res.time),
                        sequence: res.sequence,
                        data: {
                            amount: req.amount,
                            remark: req.remark??'',
                            uid: req.objUId
                        }
                    }
                    setMessages((items) => {
                        return [{ ...message, user: authUser } as IMessage<DataType>].concat(items);
                    });
                }).finally(()=>{
                    loadingModalRef.current?.close();
                })
            },1000)
    }



    const onRedPacketFunc = async (req: RedPacketCreateReq) => {
        console.log('发起紅包', req);
        loadingModalRef.current?.open('处理中...');
        setTimeout(() => {
            messageService.doRedPacket(
                { ...req, sender: authUser?.id },
                sharedSecretRef.current, 'packet'
            ).then(res => {
                const { sequence = 0 } = res;
                if (sequence > lastSeq.current) {
                    lastSeq.current = sequence;
                }
                const message: IMessage<'packet'> = {
                    mid: req.id,
                    type: 'packet',
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
                    }}>
                        <TouchableOpacity onPress={() => {
                            console.log('點擊', imagesRef.current);
                            // navigation.navigate('UserChatInfo', {
                            //     uid: user?.uid ?? '',
                            //     chatId: conversationIdRef.current,
                            //     avatar: user?.avatar ?? '',
                            //     name: user?.remark ?? user?.name ?? '',
                            //     disturb: false,
                            //     top: false,
                            // })
                        }}>
                            <Image source={require('@/assets/icons/more.svg')} style={{
                                width: scale(32),
                                height: scale(32),
                            }} />
                        </TouchableOpacity>

                    </View>
                }} />
            </View>
            <View style={{
                flex: 1,
                backgroundColor: '#F4F4F4',
            }}>
                <TouchableWithoutFeedback accessible={false} onPress={() => {
                    Keyboard.dismiss();
                    inputToolkitRef.current?.down();
                }}>
                <View style={{
                    flex: 1,
                    width: '100%',
                    paddingBottom: keyboardState ? verticalScale(60) : (verticalScale(60) + insets.bottom),
                }}>
                    <MessageList authUid={authUser?.id ?? ''} encKey={sharedSecretRef.current} messages={messages} onLongPress={(m)=>{
                        console.log('長按',m);
                    }} onPress={(m) => {
                        // const data = m.data as IMessageTypeMap[DataType];
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
                        if (m.type == 'video') {
                            if (m.data && m.state === 1) {
                                encVideoPreviewRef.current?.open({
                                    encKey: sharedSecretRef.current,
                                    video: m.data as IMessageVideo,
                                })
                            }
                        }

                        if (m.type === 'packet') {
                            const _data = m.data as IMessageRedPacket
                            if (_data.pkInfo) {
                                if (_data.pkInfo?.enable === false || _data.pkInfo?.touchFlag === true) {
                                    // jump
                                    redPacketDetailRef.current?.open({id: _data.packetId})
                                    return
                                }

                                if (_data?.type === RedPacketTypeEnum.TARGETED) {
                                    if (authUser?.id !== _data.objUId) {
                                        // jump
                                        redPacketDetailRef.current?.open({id: _data.packetId})
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
                                                        if(_data.stateFunc){
                                                            _data.stateFunc(res.result)
                                                        }
                                                        redPacketDetailRef.current?.open({id: _data.packetId})
                                                    })
                                                }
                                            } else {
                                                // 抢
                                                redPacketApi.touchPacket({ id: _data.packetId }).then(res => {
                                                    if(_data.stateFunc){
                                                        _data.stateFunc(res.result)
                                                    }
                                                    redPacketDetailRef.current?.open({id: _data.packetId})
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }}/>
                </View>

                    
                </TouchableWithoutFeedback>
            </View>
            <View
                style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: keyboardState ? (Platform.OS == 'ios' ? keyboardHeight : 0) : 0,
                }}>
                <InputToolkit sourceId={user?.uid} ref={inputToolkitRef} onSend={async (message) => {
                    console.log('發送消息@@@@@@@', message);
                    if (!user) {
                        throw new ToastException('信息錯誤！');
                    }
                    setMessages((items) => {
                        return [{ ...message, user: authUser } as IMessage<DataType>].concat(items);
                    });
                    setTimeout(() => {
                        if(message.type !== 'swap'){
                            if(message.type == 'image' || message.type =="file" || message.type == 'video'){
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
                                        } else if (message.type === 'video') {
                                            const data = res.data as IMessageVideo;
                                            message.data = {
                                                ...data,
                                                path: data.path,
                                            };
                                            const file = message.data;
                                            if (file) {
                                                file.path = data.path;
                                                file.thumbnail = data.thumbnail
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
                        }
                       
                    }, 100)

                }} tools={tools} onSwap={onSwap} onRedPacket={onRedPacketFunc} />
            </View>
            <EncImagePreview ref={encImagePreviewRef} />
            <EncFilePreview ref={encFilePreviewRef} />
            <EncVideoPreview ref={encVideoPreviewRef}/>
            <LoadingModal ref={loadingModalRef}/>
            <RedPacketDialog ref={redPacketDialogRef} />
            <PacketDetail ref={redPacketDetailRef} />
        </View>

    )
}
export default UserChatScreen;