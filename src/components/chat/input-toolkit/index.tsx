import { Keyboard, View} from "react-native";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import RootSiblings from 'react-native-root-siblings';
import { InputAccessoryItemType } from "./accessory";
import dayjs from "dayjs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DataType, IMessage } from "./types";
import { captureImage, captureVideo, pickerDocument, pickerImage } from "./utils";
import TextInput from "./text-input";
import Accessory from "./accessory";
import { globalStorage } from "@/lib/storage";
import util from '@/lib/utils'
import fileService from "@/service/file.service";
import MoneyTransfer, { MoneyTransferModalType } from "@/screens/wallet/components/money-transfer";
import { WalletRemitReq, WalletRemitResp } from "@/api/types/wallet";
import SelectMemberModal, { SelectMemberModalType, SelectMemberOption } from "@/components/select-member-modal";
import { GroupContext, GroupMemberItemVO } from "@/api/types/group";
import GroupMemberList, { GroupMemberListType } from "@/screens/contact/components/group-list/group-member-list";
import GroupPacket, { GroupPacketCreateModalType } from "@/screens/red-packet/group-packet";
import { RedPacketCreateReq } from "@/api/types/red-packet";
export interface InputToolKitRef {
    down: () => void;
}

export interface InputToolKitProps {
    tools: InputAccessoryItemType[];
    onSend: (message: IMessage<DataType>) => Promise<void>;
    onSwap: (req: WalletRemitReq) => Promise<void>;
    onRedPacket?: (req: RedPacketCreateReq) => Promise<void>
    sourceId?: string
    members?: GroupMemberItemVO []
}

export default forwardRef((props: InputToolKitProps, ref) => {
    const { tools } = props;
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<'text' | 'emoji' | 'tool' | 'normal'>('text');
    const [accessoryHeight, setAccessoryHeight] = useState<number>(0);
    const [keyboardState, setKeyboardState] = useState(false);
    const moneyTransferRef = useRef<MoneyTransferModalType>(null)
    // 选人弹窗
    const groupMemberModalRef = useRef<GroupMemberListType>(null);
    const groupPacketRef = useRef<GroupPacketCreateModalType>(null);
    const simplePacketRef = useRef<RootSiblings>();

   
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setAccessoryHeight(0);
            setKeyboardState(true);
            globalStorage.setItem('keyboardHeight', e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardState(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    useImperativeHandle(ref, () => ({
        down: () => {
            setAccessoryHeight(0);
            setMode('normal');
        }
    }));
    return <View style={{
        backgroundColor: "white",
        paddingBottom: !keyboardState ? insets.bottom : 0,
    }}>
        <TextInput mode={mode} onChangeMode={(v) => {
            if (v == 'text') {
                setAccessoryHeight(0);
            } else if (v == 'tool') {
                const height = globalStorage.getNumber('keyboardHeight') ?? 150;
                setAccessoryHeight(height);
            }
            setMode(v)
            console.log(v);
        }} tools={tools} onSend={props.onSend} />
        <View style={{
            height: accessoryHeight,
            width: '100%',
        }}>
            {mode == 'tool' ? <Accessory tools={tools} onPress={async (tool) => {
                switch (tool.key) {
                    case 'camera':
                        const photo = await captureImage();
                        if (photo !== undefined) {
                            const message: IMessage<'image'> = {
                                mid: util.generateId(),
                                type: 'image',
                                state: 0,
                                time: dayjs(),
                                data: {
                                    w: photo.width,
                                    h: photo.height,
                                    thumbnail: photo.uri,
                                    original: photo.uri,
                                    t_md5: '',
                                    o_md5: '',
                                    t_enc_md5: '',
                                    o_enc_md5: '',
                                },
                            }
                            await props.onSend(message)
                        }
                        break;
                    case 'video':
                        const video = await captureVideo();
                        if (video !== undefined) {
                            const mid = util.generateId()
                            // 這裏在未經解碼的時候，使用最初的視頻文件生成縮略圖，可能會存在轉碼問題，留意
                            const originalThumbnailPath = await fileService.generateVideoThumbnail(video.uri, mid)
                            const message: IMessage<'video'> = {
                                mid: mid,
                                type: 'video',
                                state: 0,
                                time: dayjs(),
                                data: {
                                    w: video.width,
                                    h: video.height,
                                    thumbnail: originalThumbnailPath ?? '',
                                    original: video.uri,
                                    t_md5: '',
                                    o_md5: '',
                                    t_enc_md5: '',
                                    o_enc_md5: '',
                                    duration: video.duration ?? 0
                                },
                            }
                            await props.onSend(message)
                        }

                        break;
                    case 'albums':
                        const images = await pickerImage();
                        for (let i = 0; i < images.length; i++) {
                            const uri = images[i].uri;
                            const message: IMessage<'image'> = {
                                mid: util.generateId(),
                                type: 'image',
                                state: 0,
                                time: dayjs(),
                                data: {
                                    w: images[i].width,
                                    h: images[i].height,
                                    thumbnail: uri,
                                    original: uri,
                                    t_md5: '',
                                    o_md5: '',
                                    t_enc_md5: '',
                                    o_enc_md5: '',
                                },
                            }
                            await props.onSend(message)
                        }
                        break;
                    case 'file':
                        const assets = await pickerDocument();
                        for (let i = 0; i < assets.length; i++) {
                            const uri = assets[i].uri;
                            const message: IMessage<'file'> = {
                                mid: util.generateId(),
                                type: 'file',
                                state: 0,
                                time: dayjs(),
                                data: {
                                    mime: assets[i].mimeType ?? 'application/octet-stream',
                                    name: assets[i].name,
                                    size: assets[i].size ?? 0,
                                    path: uri,
                                    md5: '',
                                    enc_md5: '',
                                },
                            }
                            await props.onSend(message)
                        }
                        break;
                    case 'swap':
                        moneyTransferRef.current?.open({
                            uid: props.sourceId ?? '',
                            onFinish: async (obj: WalletRemitReq | null) => {
                                if (obj !== null) {
                                    props.onSwap(obj)
                                }
                            }
                        })
                        break
                    case 'gswap':
                        // 群组转账，先弹选人，再弹转账
                        groupMemberModalRef.current?.open({
                            gid: props.sourceId ?? '',
                            onPress: (uid: string) => {
                                moneyTransferRef.current?.open({
                                    uid: uid,
                                    onFinish: async (obj: WalletRemitReq | null) => {
                                        if (obj !== null) {
                                            props.onSwap(obj)
                                        }
                                    }
                                })
                            }
                        })

                        break
                    case 'gpacket':
                        // 群组转账，先弹选人，再弹转账
                        console.log('gpacket');
                        
                        groupPacketRef.current?.open({
                            gid:props.sourceId??'',
                            onFinish: (o:RedPacketCreateReq)=>{
                                if(o !== null && props.onRedPacket !== undefined){
                                    props.onRedPacket(o)
                                }
                            }
                        })
                        break
                    default:
                        break;
                }
            }} height={accessoryHeight} /> : null}
        </View>
        <MoneyTransfer ref={moneyTransferRef} />
        <GroupMemberList ref={groupMemberModalRef} />
        <GroupPacket ref={groupPacketRef} members={props.members}/>
        {/* <SimplePacket ref={simplePacketRef} /> */}
    </View> 
});

