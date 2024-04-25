import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Dialog, View } from "react-native-ui-lib";
import redPacketApi from "@/api/v2/red-packet";
import { IMessageRedPacket } from "@/components/chat/input-toolkit/types";
import { RedPacketResp } from "@/api/types/red-packet";
import userService from "@/service/user.service";
import { UserInfoItem } from "@/api/types/user";
import { StyleSheet } from "react-native";
export interface RedPacketDialogType{
    open: (param: {
        data: IMessageRedPacket,
        onPress: ()=>void
    }) => void
}

export default forwardRef((_,ref)=>{
    const [visible,setVisible] = useState(false)
    const [packetInfo,setPacketInfo] = useState<RedPacketResp>()
    const [author,setAuthor] = useState<UserInfoItem|null>()
    const onPressRef = useRef<()=>void>()
    const onClose = ()=>{
        setPacketInfo(undefined)
        setAuthor(null)
        setVisible(false)
    }
    useImperativeHandle(ref, () => ({
        open: (params: {
            data: IMessageRedPacket
            onPress: ()=>void
        }) => {
            redPacketApi.packetInfo({id: params.data.packetId})
            .then((res)=>{
                setPacketInfo(res)
               
            })
            userService.getInfo(params.data.sender).then(res=>{
                setAuthor(res)
            })
            onPressRef.current = params.onPress
            setVisible(true)
        }
    }));

    return <Dialog visible={visible} containerStyle={styles.main_style}>
        <View style={styles.title_style}>
            <View>
                恭喜發財
            </View>
        </View>
        <View style={styles.bottom_style}></View>
    </Dialog>
})

const styles = StyleSheet.create({
    main_style:{},
    title_style:{},
    bottom_style: {},
})