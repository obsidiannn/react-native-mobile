import colors from "@/config/colors";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native"
import { scale } from "react-native-size-matters/extend";
import { IMessageSwap } from "../../input-toolkit/types";
import AntIcon from 'react-native-vector-icons/AntDesign'
import utils from "@/lib/utils";

export default (props: {
    data: IMessageSwap;
    isSelf: boolean;
    uid: string // 这条消息的归属
}) => {

    const swapText = () => {
        if (props.isSelf) {
            if (props.uid === props.data.uid) {
                return '你收到'
            } else {
                return '你发起'
            }
        } else {
            return '对方发起'
        }
    }

    return <View style={[
        styles.container,
        props.isSelf ? styles.selfContainer : styles.userContainer,
    ]}>
        <View style={styles.money_area}>
            <View style={{
                padding: scale(4),
                borderRadius: scale(50),
                borderWidth: scale(2),
                borderColor: textColor,
                marginRight: scale(12)
            }}>
                <AntIcon name="swap" size={24} style={{
                    color: textColor
                }} />
            </View>
            <View>
                <Text style={{
                    color: textColor, fontSize: scale(14)
                }}>$ {utils.changeF2Y(props.data.amount)}</Text>
                <Text style={{
                    color: textColor, fontSize: scale(14)
                }}>{swapText()}了一笔转账</Text>
            </View>
        </View>
        <View style={{
            paddingLeft: scale(15),
            paddingRight: scale(20),
            paddingTop: scale(6),
            paddingBottom: scale(6),
        }}>
            <Text style={{ color: '#fa825c', fontSize: scale(12) }}>BOBO转账</Text>
        </View>
    </View>
}
const textColor = '#ffe9b1'
const styles = StyleSheet.create({

    container: {
        borderRadius: scale(15),
    },
    selfContainer: {
        backgroundColor: '#f84d30',
        borderTopRightRadius: scale(0),
    },
    userContainer: {
        backgroundColor: '#f84d30',
        borderTopLeftRadius: scale(0),
    },
    text: {
        fontSize: scale(15),
        fontWeight: '400',
        lineHeight: 21,
    },
    money_area: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#fa825c',
        borderBottomWidth: scale(1),

        paddingLeft: scale(24),
        paddingRight: scale(36),
        paddingTop: scale(24),
        paddingBottom: scale(14),
    }
});