import { WalletItem } from "@/api/types/wallet"
import colors from "@/config/colors"
import { StatusItem } from "@/constants/wallet"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { scale } from "react-native-size-matters/extend"
import { Text } from "react-native-ui-lib"
import walletConstant from '@/constants/wallet'

const roundWidth = 14;
const CardItem = (props: {
    data: WalletItem
    onClick?: () => void
    bgColor?: string
}) => {
    const [info, setInfo] = useState<WalletItem>()
    const [statusItem,setStatusItem] = useState<StatusItem>()
    useEffect(() => {
        setInfo(props.data)
        if(props.data.showType === '1'){
            setStatusItem(walletConstant.billStatusTransfer(props.data.type,props.data.status))
        }
    }, [])
    const amount = () => {
        return Number((info?.amount ?? 0)/100).toFixed(2)
    }
    return <Pressable style={styles.card_container} onPress={()=>{
        if(props.onClick){
            props.onClick()
        }
    }} >
        {info?.showType === '0' ?
            <View style={styles.card_title}>
                <Text style={{ color: colors.gray800, fontSize: scale(18) }}>{info?.title}</Text>
                <Text style={{ color: colors.gray800, fontSize: scale(24), fontWeight: '700' }}>$ {amount()}</Text>
            </View> : null
        }
        {info?.showType === '1' ?
            <View style={styles.card_title}>
                <Text style={{ color: colors.gray800, fontSize: scale(24), fontWeight: '700' }}>$ {amount()}</Text>
                <Text style={{ color: statusItem?.color, fontSize: scale(18) }}>{statusItem?.title}</Text>
            </View> : null
        }
        {info?.showType === '2' ?
            <View style={styles.card_title}>
                <Text style={{ color: colors.gray800, fontSize: scale(24), fontWeight: '700' }}>$ {amount()}</Text>
                <Text style={{ color: colors.gray800, fontSize: scale(18) }}>{info?.title}</Text>
            </View> : null
        }
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <View style={{ ...styles.round_circle, backgroundColor: props.bgColor, marginLeft: scale(-roundWidth) }}></View>
            <View style={styles.divider}></View>
            <View style={{ ...styles.round_circle, backgroundColor: props.bgColor, marginRight: scale(-roundWidth) }}></View>
        </View>
        <View style={{ margin: scale(20), marginTop: scale(0) }}>
            <Text style={{ fontSize: scale(12), color: colors.gray400 }}>{info?.time}</Text>
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    card_container: {
        marginTop: scale(10),
        padding: 0,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: scale(14)
    },
    card_title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: scale(20),
    },
    round_circle: {
        width: scale(roundWidth * 2),
        height: scale(roundWidth * 2),
        borderRadius: scale(50),
    },
    divider: {
        height: scale(1),
        width: '85%',
        borderTopWidth: scale(1),
        borderStyle: 'dashed',
        borderTopColor: colors.gray300
    }
})

export default CardItem