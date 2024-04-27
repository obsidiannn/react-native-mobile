import colors from "@/config/colors";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native"
import { scale } from "react-native-size-matters/extend";
import { IMessageRedPacket, IMessageSwap } from "../../input-toolkit/types";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useState } from "react";
import redPacketApi from "@/api/v2/red-packet";

export default (props: {
    data: IMessageRedPacket;
    isSelf: boolean;
    uid: string // 这条消息的归属
    reload: boolean
}) => {
    // 如果首次已失效，则无需更新状态
    // 如果首次未失效，点击过后，需要进行状态变更
    // 0 loading,1 未领取， 2 已领取-未领光，3 已全部领光
    const [state, setState] = useState(0)
    const statFunc = (s: number) => {
        console.log('触发', s);
        setState(s)
    }
    const len = 9
    const miss = len - props.data.remark.length

    const labelFillin = (label: string) => {
        if (miss < 0) {
            return label.substring(0, len) + '...'
        } else {
            return label
        }
    }

    useEffect(() => {
        props.data.stateFunc = statFunc
        redPacketApi.packetInfo({ id: props.data.packetId })
            .then((res) => {
                props.data.pkInfo = res
                if (res.enable === false) {

                }
            })
    }, [])

    return <View style={[
        styles.container,
        props.isSelf ? styles.selfContainer : styles.userContainer,
    ]}>
        <View style={styles.money_area}>
            <View style={{
                padding: scale(4),
                marginRight: scale(12)
            }}>
                <Image source={require('@/assets/icons/red-packet.svg')}
                    style={{ width: scale(32), height: scale(42) }}
                />
            </View>
            <View>
                <Text style={{
                    color: textColor, fontSize: scale(16),
                    marginRight: (miss>0? scale(10 * miss): 0)
                }}>{labelFillin(props.data.remark)}</Text>
                {/* <Text>{state}a</Text> */}
            </View>
        </View>
        <View style={{
            paddingLeft: scale(15),
            paddingRight: scale(20),
            paddingTop: scale(6),
            paddingBottom: scale(6),
        }}>
            <Text style={{ color: '#fa825c', fontSize: scale(12) }}>BOBO紅包</Text>
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