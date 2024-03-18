import { Keyboard, View, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import crypto from "react-native-quick-crypto";
import { InputAccessoryItemType } from "./accessory";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { IMessage } from "./types";
import { Button } from "react-native-ui-lib";
import colors from "@/config/colors";
import util from '@/lib/utils'
export interface InputToolKitProps {
    tools: InputAccessoryItemType[];
    onSend: (message: IMessage<'text'>) => Promise<void>;
    mode: 'text' | 'emoji' | 'tool' | 'normal';
    onChangeMode: (mode: 'text' | 'emoji' | 'tool' | 'normal') => void;
}
export default (props: InputToolKitProps) => {
    const [content, setContent] = useState<string>('');
    const textInputRef = useRef<TextInput>(null);
    const [inputHeight, setInputHeight] = useState<number>(0);
    return <View style={styles.container}>
        <View style={styles.leftContainer}>
            <View
                onLayout={(e) => {
                    setInputHeight(e.nativeEvent.layout.height);
                }} style={styles.textInputContainer}>
                <TextInput
                    onFocus={() => {
                        props.onChangeMode('text');
                    }}
                    onChangeText={(text) => setContent(text)}
                    ref={textInputRef}
                    multiline={true}
                    value={content}
                    editable={true}
                    maxLength={400}
                    style={styles.textInput}
                />
            </View>
        </View>
        <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: inputHeight > 34 ? 'flex-end' : 'center',
            flexDirection: 'row',
            paddingRight: 20,
            paddingBottom: inputHeight > 34 ? 10 : 0,
        }}>
            {content.length <= 0 ? <Pressable onPress={() => {
                if (props.mode != "tool") {
                    props.onChangeMode('tool');
                    if (Keyboard.isVisible()) {
                        Keyboard.dismiss();
                    }
                    textInputRef.current?.blur();
                }else{
                    props.onChangeMode('normal');
                }
            }}>
                <Image style={styles.accessoryIcon} source={require('@/assets/icons/circle-plus.svg')} />
            </Pressable> :
                <Button onPress={async () => {
                    if (content.length > 0) {
                        const message: IMessage<'text'> = {
                            mid: util.generateId(),
                            type: 'text',
                            state: 0,
                            time: dayjs(),
                            data: content,
                        }
                        await props.onSend(message)
                        setContent('');
                        return;
                    }
                }} backgroundColor={colors.primary} style={styles.sendButton} size="small" label="发送" />
            }
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        paddingVertical: verticalScale(13),
        paddingLeft: scale(20),
        paddingRight: scale(10),
    },
    textInputContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#EFF0F2',
        borderRadius: 17,
        paddingHorizontal: 10,
        minHeight: scale(34),
        paddingVertical: 5,
    },
    textInput: {
        padding: 0,
        margin: 0,
        borderWidth: 0,
        fontSize: 14,
        maxHeight: 18 * 4,
        width: '100%',
        color: "#333",
    },
    accessoryIcon: {
        width: scale(28),
        height: scale(28),
    },
    sendButton: {
        height: scale(30),
        paddingHorizontal: scale(11),
        justifyContent: 'center',
    }
});