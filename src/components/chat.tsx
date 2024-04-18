import { Keyboard, Text, TouchableOpacity, View, } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat'
import { useEffect, useRef, useState } from "react";
import EmojiPicker, {emojiFromUtf16} from "rn-emoji-picker"
import {emojis} from "rn-emoji-picker/dist/data"
import { TextInput } from 'react-native-gesture-handler';
interface ChatToolProp {
    title: string;
    icon: string;
    key: string;
}
interface ChatProps {
    messages: IMessage[];
    tools: ChatToolProp[];
    user: User;
    onSend: (messages: IMessage[]) => void;
}
const ToolsComponent = (props: {
    tools: ChatToolProp[];
    onPress: (tool: ChatToolProp) => void;
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
const Chat = (props: ChatProps) => {
    const { tools, messages, user, onSend } = props;
    const [keyboardHeight, setKeyboardHeight] = useState<number>(300);
    const [accessoryHeight, setAccessoryHeight] = useState<number>(0);
    const [mode, setMode] = useState<'text' | 'emoji' | 'tool' | 'normal'>('text')
    const textInputRef = useRef<TextInput>(null);
    const [content, setContent] = useState<string>('')
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        return () => {
            showSubscription.remove();
        };
    }, [])
    return (
        <View style={{
            flex:1,
        }}>
            <GiftedChat
                messages={messages}
                onInputTextChanged={(text) => setContent(text)}
                accessoryStyle={{
                    height: accessoryHeight,
                }}
                renderComposer={(props) => {
                    return <TextInput
                        ref={textInputRef}
                        value={content}
                        onFocus={() => {
                            setAccessoryHeight(0);
                            setMode('text');
                        }}
                        keyboardType="numeric"
                        onChangeText={(text) => setContent(text)}
                        style={{
                            flex: 1,
                            height: 44,
                            backgroundColor: 'white',
                            borderRadius: 5,
                            fontSize: 16,
                            lineHeight: 20,
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                        }}
                        placeholder="輸入消息"
                        placeholderTextColor="#52525b"
                        //multiline={true}
                        returnKeyType="send"
                        clearButtonMode="while-editing"
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Enter') {
                                if (content.length > 0) {
                                    setContent('');
                                }
                            }
                        }}
                    />
                }}
                renderSend={() => {
                    return <View style={{
                        height: 44,
                        width: 70,
                        display: 'flex',
                        justifyContent:'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingRight: 10,
                    }}>
                        
                        <TouchableOpacity onPress={() => {
                            if (mode != "emoji"){
                                setMode('emoji');
                                Keyboard.dismiss();
                                setAccessoryHeight(keyboardHeight);
                            } else {
                                textInputRef.current?.focus()
                            }
                        }}>
                            {mode != "emoji" ? <Icon name="emoticon-outline"  size={30} color='#52525b'/>:<Icon name='keyboard-outline' size={30} color='#52525b' />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (content.length > 0) {
                                setContent('');
                                return;
                            }
                            if (mode != "tool"){
                                
                                setMode('tool');
                                if(Keyboard.isVisible()){
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
                }}
                renderAccessory={() => {
                    if (mode == "tool") {
                        return <ToolsComponent onPress={(tool) => {
                        }} tools={tools} height={keyboardHeight} />
                    }
                    if (mode == "emoji") {
                        return <EmojiPicker
                        emojis={emojis} // emojis data source see data/emojis
                        autoFocus={false} // autofocus search input
                        loading={false} // spinner for if your emoji data or recent store is async
                        darkMode={false} // to be or not to be, that is the question
                        perLine={7} // # of emoji's per line
                        onSelect={console.log} // callback when user selects emoji - returns emoji obj
                        // backgroundColor={'#000'} // optional custom bg color
                        // enabledCategories={[ // optional list of enabled category keys
                        //   'recent', 
                        //   'emotion', 
                        //   'emojis', 
                        //   'activities', 
                        //   'flags', 
                        //   'food', 
                        //   'places', 
                        //   'nature'
                        // ]}
                        // defaultCategory={'food'} // optional default category key
                    />
                    }
                    return null;
                }}
                user={user}
            />
        </View>

    )
}
export default Chat;