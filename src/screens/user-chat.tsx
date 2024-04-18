import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard, Text, TouchableOpacity, View, TextInput, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import { FlashList } from "@shopify/flash-list";
import Navbar from "../components/navbar";
import { Image } from "expo-image";
import { requestCameraPermission, requestDocumentPermission, requestMicrophonePermission, requestPhotoPermission } from "../lib/permissions";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import PhotoEditor from "@baronha/react-native-photo-editor";
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
type Props = StackScreenProps<RootStackParamList, 'UserChat'>;

interface User {
    id: string;
    name: string;
    avatar: string;
}
interface IMessage {
    id: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    audio?: {
        duration: number;
        url: string;
    };
    text?: string;
    image?: {
        thumbnail: string;
        original: string;
    };
    video?: {
        thumbnail: string;
        original: string;
    };
    file?: {
        ext: string;
        name: string;
        size: number;
        url: string;
    };
    sendState: boolean;
    time: Date;
    user: User;
}
interface InputToolProp {
    title: string;
    icon: string;
    key: string;
}
const ToolsComponent = (props: {
    tools: InputToolProp[];
    onPress: (tool: InputToolProp) => void;
    height: number;
}) => {
    const { tools, onPress, height } = props;
    return <View style={[{
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        height: height,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }]}>
        {tools.map((tool, i) => {
            return <TouchableOpacity onPress={() => onPress(tool)} key={tool.key} style={{
                width: '25%',
                alignItems: 'center',
                marginTop: i > 3 ? 10 : 0,
            }}>
                <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AntIcon name={tool.icon} size={22} color="#52525b" />
                </View>
                <Text style={{
                    color: '#52525b',
                    fontSize: 12,
                    lineHeight: 16,
                    textAlign: 'center',
                    marginVertical: 5,
                }}>{tool.title}</Text>
            </TouchableOpacity>
        })}
    </View>
}
const InputTool = (props: {
    tools: InputToolProp[];
}) => {
    const { tools } = props;
    const [mode, setMode] = useState<'text' | 'emoji' | 'tool' | 'normal'>('text');
    const [accessoryHeight, setAccessoryHeight] = useState<number>(0);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [content, setContent] = useState<string>('');
    const [keyboardState, setKeyboardState] = useState(false);
    const textInputRef = useRef<TextInput>(null);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setAccessoryHeight(0);
            setKeyboardHeight(e.endCoordinates.height)
            setKeyboardState(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardState(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const pickerImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            exif: false,
            allowsMultipleSelection: true,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            console.log('result', result.assets[0].uri);
        }
    };
    const captureImage = async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            exif: false,
            quality: 1,
        });

        if (!result.canceled) {
            const s = await PhotoEditor.open({
                stickers: [],
                path: result.assets[0].uri,
            })
            console.log('result s', s);
        }
    }
    const captureVideo = useCallback(async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            exif: false,
            quality: 1,
            videoMaxDuration: 15,
        });
        if (!result.canceled) {
            const input = result.assets[0].uri;
            // 將文件的後綴名改爲mp4
            const output = input.replace(/(.*)(\..*$)/, '$1_output.mp4');
        
            const cmd = `-i ${input} -c:v mpeg4 ${output}`;
            FFmpegKit.execute(cmd).then(async (session) => {
                const returnCode = await session.getReturnCode();
                console.log('returnCode', returnCode);
                if (ReturnCode.isSuccess(returnCode)) {
                  // SUCCESS
                } else if (ReturnCode.isCancel(returnCode)) {
              
                  // CANCEL
              
                } else {
                  // ERROR
              
                }
              });
            console.log('result', result.assets[0].uri);
        }
    }, []);
    return <View>
        <View style={{
            minHeight: 50,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#f5f5f5',
        }}>
            <View style={{
                flex: 1,
                minHeight: 50,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    margin: 5,
                    minHeight: 50,
                    width: '95%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <TextInput
                        onFocus={() => {
                            setMode('text');
                            setAccessoryHeight(0);
                        }}
                        onChangeText={(text) => setContent(text)}
                        ref={textInputRef}
                        multiline={true}
                        value={content}
                        returnKeyType="send"
                        maxLength={400}
                        style={{
                            fontSize: 16,
                            lineHeight: 26,
                            maxHeight: 26 * 5,
                            paddingHorizontal: 7,
                            width: '100%',
                        }}
                    />
                </View>

            </View>
            <View style={{
                minHeight: 50,
                width: 70,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
                paddingRight: 10,
                paddingBottom: 10,
            }}>
                <TouchableOpacity onPress={() => {
                    if (mode != "emoji") {
                        setMode('emoji');
                        Keyboard.dismiss();
                        setAccessoryHeight(keyboardHeight);
                    } else {
                        textInputRef.current?.focus()
                    }
                }}>
                    {mode != "emoji" ? <Icon name="emoticon-outline" size={30} color='#52525b' /> : <Icon name='keyboard-outline' size={30} color='#52525b' />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    console.log('click tool');
                    if (content.length > 0) {
                        setContent('');
                        return;
                    }
                    if (mode != "tool") {
                        setMode('tool');
                        if (Keyboard.isVisible()) {
                            Keyboard.dismiss();
                        }
                        textInputRef.current?.blur();
                        setAccessoryHeight(keyboardHeight);
                    } else {
                        textInputRef.current?.focus()
                    }
                }}>
                    {content.length <= 0 ? <Icon name={'plus-circle-outline'} size={30} color='#52525b' /> : <FeatherIcon name='send' size={25} color='#52525b' />}
                </TouchableOpacity>
            </View>
        </View>
        <View style={{
            height: accessoryHeight,
            width: '100%',
            backgroundColor: 'pink'
        }}>
            {mode == 'tool' ? <ToolsComponent tools={tools} onPress={async (tool) => {
                switch (tool.key) {
                    case 'camera':
                        await requestCameraPermission();
                        captureImage();
                        break;
                    case 'video':
                        await requestCameraPermission();
                        await requestMicrophonePermission();
                        captureVideo();
                        break;
                    case 'albums':
                        await requestPhotoPermission();
                        pickerImage();
                        break;
                    case 'file':
                        await requestDocumentPermission();
                        const result = await DocumentPicker.getDocumentAsync({
                            type: '*/*',
                            copyToCacheDirectory: true,
                        });
                        console.log('result', result);
                        break;
                    default:
                        break;
                }
            }} height={accessoryHeight} /> : null}
        </View>
    </View>
}
const UserChatScreen = ({ navigation }: Props) => {

    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<IMessage[]>([])
    // 獲取設備屏幕高度
    const screenHeight = Dimensions.get('window').height;
    const authUser: User = {
        id: '1',
        name: '測試',
        avatar: 'https://avatars.githubusercontent.com/u/17189275?v=4'
    }

    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [keyboardState, setKeyboardState] = useState(false);

    const users = useRef<User[]>([]);
    useEffect(() => {
        for (let i = 1; i < 10; i++) {
            users.current.push({
                id: `${i}`,
                name: `測試${i}`,
                avatar: `https://avatars.githubusercontent.com/u/${i}?v=4`
            })
        }
        for (let i = 20; i < 50; i++) {
            const user = users.current[Math.floor(Math.random() * users.current.length)];
            setMessages((messages) => [
                {
                    id: `${i}`,
                    user: user,
                    type: 'text',
                    text: `Hello developer${i}`,
                    time: new Date(),
                    sendState: false,
                },
                ...messages,
            ]);
        }
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height)
            setKeyboardState(true);
        }
        );
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardState(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [])
    const tools = [
        {
            title: '拍照',
            icon: 'camerao',
            key: 'camera'
        },
        {
            title: '錄像',
            icon: 'videocamera',
            key: 'video'
        },
        {
            title: '相冊',
            icon: 'picture',
            key: 'albums'
        },
        {
            title: '文件',
            icon: 'folder1',
            key: 'file'
        },
        {
            title: '轉賬',
            icon: 'swap',
            key: 'swap'
        },
        {
            title: '紅包',
            icon: 'redenvelopes',
            key: 'red-envelope',
        }
    ];
    const listRef = useRef<FlashList<IMessage>>();
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'yellow',
                paddingTop: insets.top,
                paddingBottom: insets.bottom + (keyboardState ? (Platform.OS == 'ios' ? keyboardHeight : 0) : 0),
            }}>
            <View style={{
                height: 40,
                width: '100%',
                backgroundColor: 'white',
            }}>
                <Navbar title="暱稱1" />
            </View>
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: 1,
                    width: '100%',
                    paddingBottom: 70,
                }}>
                    <FlashList
                        style={{
                            flex: 1,
                            width: '100%',
                        }}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            const lastMessage = messages[messages.length - 1];
                            const lastMessageId = Number(lastMessage.id);
                            console.log('lastMessageId', lastMessageId);
                            const tmps: IMessage[] = [];
                            for (let i = 1; i < 10; i++) {
                                const user = users.current[Math.floor(Math.random() * users.current.length)];
                                const id = (lastMessageId - i) + '';
                                tmps.push({
                                    id,
                                    user: user,
                                    type: 'text',
                                    text: `Hello developer${id}`,
                                    time: new Date(),
                                    sendState: false,
                                })
                            }
                            setMessages(messages.concat(tmps))

                        }}
                        data={messages}
                        ref={ref => listRef.current = ref as FlashList<IMessage>}
                        estimatedItemSize={50}
                        renderItem={(props) => {
                            const { item } = props;
                            if (item.user.id == authUser.id) {
                                return <View style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        marginRight: 10,
                                    }}>
                                        <Image
                                            source={{ uri: item.user.avatar }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        backgroundColor: '#e5f5f5',
                                        borderRadius: 5,
                                        padding: 10,
                                        maxWidth: '70%',
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            lineHeight: 26,
                                            color: '#52525b',
                                        }}>{item.text}</Text>
                                    </View>
                                </View>
                            } else {
                                return <View style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        marginRight: 10,
                                    }}>
                                        <Image
                                            source={{ uri: item.user.avatar }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        backgroundColor: 'white',
                                        borderRadius: 5,
                                        padding: 10,
                                        maxWidth: '70%',
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            lineHeight: 26,
                                            color: '#52525b',
                                        }}>{item.text}</Text>
                                    </View>
                                </View>
                            }
                        }}
                        keyExtractor={(item) => item.id}
                        inverted={true}
                    />
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: keyboardState ? (Platform.OS == 'ios' ? keyboardHeight : 0) : 0,
                }}>
                <InputTool tools={tools} />
            </View>
        </View>

    )
}
export default UserChatScreen;