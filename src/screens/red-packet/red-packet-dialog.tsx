import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Dialog, Icon, PanningProvider, View } from "react-native-ui-lib";
import redPacketApi from "@/api/v2/red-packet";
import { IMessageRedPacket } from "@/components/chat/input-toolkit/types";
import { RedPacketResp } from "@/api/types/red-packet";
import userService from "@/service/user.service";
import { UserInfoItem } from "@/api/types/user";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { scale } from "react-native-size-matters/extend";
import { Image } from "expo-image";
import fileService from "@/service/file.service";
import AntIcon from 'react-native-vector-icons/AntDesign'
import colors from "@/config/colors";
export interface RedPacketDialogType {
    open: (param: {
        data: IMessageRedPacket,
        onPress: () => void
    }) => void
}

export default forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false)
    const [author, setAuthor] = useState<UserInfoItem | null>()
    const onPressRef = useRef<() => void>()
    const [msgData, setMsgData] = useState<IMessageRedPacket>()
    
    const onClose = () => {
        setMsgData(undefined)
        setAuthor(null)
        setVisible(false)
    }
    useImperativeHandle(ref, () => ({
        open: (params: {
            data: IMessageRedPacket
            onPress: () => void
        }) => {
            userService.getInfo(params.data.sender).then(res => {
                setAuthor(res)
            })
            onPressRef.current = params.onPress
            setMsgData(params.data)
            setVisible(true)
        }
    }));

    // 点击抢红包
    const lockBtnPress = () => {
        onPressRef.current?.()
        onClose()
    }

    return <Dialog visible={visible} containerStyle={styles.main_style}
        onDismiss={onClose}
        panDirection={PanningProvider.Directions.DOWN}
    >
        <View style={styles.title_style}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image source={fileService.getFullUrl(author?.avatar ?? '')}
                    style={{
                        width: scale(40), height: scale(40),
                        borderRadius: scale(8), marginRight: scale(8)
                    }}></Image>
                <Text style={{
                    color: '#FFE9B1', fontSize: scale(16), fontWeight: '600'
                }}>{author?.name}  发出的红包</Text>
                {/* <Text>{msgData?.pkInfo?.packetId}</Text> */}
            </View>
            <View style={{ marginTop: scale(24) }}>
                <Text style={{
                    color: '#FFE9B1', fontSize: scale(26)
                }}>{msgData?.remark}</Text>
            </View>
            <TouchableOpacity style={styles.button_style} onPress={lockBtnPress}>
                <AntIcon name="lock" style={{ color: "#FF4B4B" }} size={scale(36)} />
            </TouchableOpacity>
        </View>
        <View style={styles.bottom_style}>

        </View>

    </Dialog>
})

const styles = StyleSheet.create({
    main_style: {
        backgroundColor: '#FF4B4B',
        borderRadius: scale(8)
    },
    title_style: {
        backgroundColor: '#FF4B4B',
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        padding: scale(32),
        paddingTop: scale(128),
        paddingBottom: scale(0),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomLeftRadius: scale(80),
        borderBottomRightRadius: scale(80),
    },
    bottom_style: {
        marginTop: scale(-100),
        padding: scale(64),
        paddingBottom: '60%',
        backgroundColor: colors.gray700,
        opacity: 0.1,
        zIndex: -1,

        // backgroundColor: 'pink'
    },
    button_style: {
        backgroundColor: '#FFE9B1',
        padding: scale(26), borderRadius: scale(50),
        marginTop: scale(128),
        marginBottom: scale(-50)
    }
})