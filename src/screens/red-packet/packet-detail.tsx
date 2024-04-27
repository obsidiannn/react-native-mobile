import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import redPacketApi from "@/api/v2/red-packet";
import { useEffect, useState } from "react";
import { RedPacketDetail } from "@/api/types/red-packet";
import { Image } from "expo-image";
import fileService from "@/service/file.service";
import { RedPacketStatusEnum, RedPacketTypeEnum } from "@/api/types/enums";
import utils from "@/lib/utils";

type Props = StackScreenProps<RootStackParamList, 'RedPacketDetail'>;

interface PacketDetailState extends RedPacketDetail {
    touchedCount: number
    touchedAmount: number
    selfTouchedAmount: number
}

const RedPacketDetailScreen = (props: Props) => {
    const [detail, setDetail] = useState<PacketDetailState | null>(null)
    const onClose = () => {
        setDetail(null)
    }
    useEffect(() => {
        redPacketApi.detail({ id: props.route.params.id }).then(res => {
            if (res !== null) {
                const _detail: PacketDetailState = {
                    ...res, touchedAmount: 0, touchedCount: 0, selfTouchedAmount: 0
                }
                if (_detail.type !== RedPacketTypeEnum.TARGETED) {
                    _detail.records = res.records.filter(r => {
                        return r.status === RedPacketStatusEnum.USED
                    })
                }
                if (_detail.records && _detail.records.length > 0) {
                    let _count = 0
                    let _amount = 0
                    for (let index = 0; index < _detail.records.length; index++) {
                        const element = _detail.records[index];
                        if (element.status === RedPacketStatusEnum.USED) {
                            _count++
                            _amount += element.amount ?? 0
                            const _uid = element.uid ?? ''
                            if (_uid !== '' && _uid === globalThis.wallet?.address) {
                                _detail.selfTouchedAmount = element.amount ?? 0
                            }
                        }
                    }
                    _detail.touchedCount = _count
                    _detail.touchedAmount = _amount
                }
                setDetail(_detail)
            }
        })
    }, [])
    return <View style={{ flex: 1, backgroundColor: colors.gray200 }}>
        <Navbar theme="dark" backgroundColor={colors.redpacket} />
        <View style={styles.main_style}>
            <View style={styles.title_style}>
                <Image source={fileService.getFullUrl(detail?.createdAvatar ?? '')}
                    style={{
                        width: scale(40), height: scale(40), borderRadius: scale(8),
                        marginRight: scale(12)
                    }} />
                <Text style={{ fontSize: scale(16), color: colors.gray950, fontWeight: '500' }}>
                    {detail?.createdBy} 發出的紅包
                </Text>
                <Image source={require('./icon/gold-amount.svg')}
                    style={{ width: scale(20), height: scale(24), marginLeft: scale(8) }}
                />
            </View>

            {detail?.selfTouchedAmount ?? 0 > 0 ? (
                <View style={{
                    ...styles.title_style,
                    paddingTop: 0
                }}>
                    <Text style={{
                        fontSize: scale(36),
                        color: colors.gray950,
                        fontWeight: '500'
                    }}>
                        ${utils.changeF2Y(detail?.selfTouchedAmount ?? 0)}
                    </Text>
                </View>
            ) : null}
            <View style={styles.detail_style}>
                <View style={{
                    paddingTop: scale(12),
                    paddingBottom: scale(12),
                    ...styles.end_bottom
                }}>
                    <Text>已領取{detail?.touchedCount}/{detail?.packetCount}，共 {
                        utils.changeF2Y(detail?.touchedAmount)
                    }/{
                            utils.changeF2Y(detail?.totalAmount)
                        }元</Text>
                </View>
                {detail?.records.map((r, i) => {
                    return <View key={r.uid + detail.packetId}
                        style={{
                            ...styles.record_item,
                            ...((i === detail?.records.length - 1) ? {} : { ...styles.end_bottom })
                        }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Image source={fileService.getFullUrl(r.avatar ?? '')}
                                style={{
                                    width: scale(40),
                                    height: scale(40),
                                    borderRadius: scale(8),
                                    marginRight: scale(8)
                                }}
                            />
                            <View>
                                <Text
                                    style={{ fontSize: scale(15), color: colors.gray950, fontWeight: '500' }}
                                >{r.uidDesc}</Text>
                                <Text
                                    style={{ fontSize: scale(12), color: colors.gray400, }}
                                >{utils.dateFormat(r.recordAt)}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontSize: scale(16), color: colors.gray950, fontWeight: '500' }}>{utils.changeF2Y(r.amount)}元</Text>
                        </View>
                    </View>
                })}
            </View>

        </View>
        <Text style={{ textAlign: 'center', bottom: scale(64), color: colors.redpacket }} >未領取的紅包，將於24小時後發起退款</Text>
    </View>
}

const styles = StyleSheet.create({
    main_style: {
        flex: 1,
        padding: scale(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title_style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(8),
        paddingTop: scale(32),
        paddingBottom: scale(32)
    },
    detail_style: {
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        padding: scale(20),
        backgroundColor: 'white',
        width: '100%',
        borderRadius: scale(12)
    },
    record_item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: scale(8),
        paddingTop: scale(14),
        paddingBottom: scale(14)
    },
    end_bottom: {
        borderBottomColor: colors.gray100,
        borderBottomWidth: scale(1)
    }
})

export default RedPacketDetailScreen