import { BillDetailResp } from "@/api/types/wallet";
import Navbar from "@/components/navbar"
import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import walletApi from '@/api/v2/wallet'
import colors from "@/config/colors";
import { scale } from "react-native-size-matters/extend";
import { BillInOutEnum } from "@/api/types/enums";
import userService from "@/service/user.service";
import utils from "@/lib/utils";
import walletConstant from '@/constants/wallet'
import * as clipboard from 'expo-clipboard'
import toast from "@/lib/toast";
type Props = StackScreenProps<RootStackParamList, 'BillDetail'>;

const BillDetail = (props: Props) => {
    const [detail, setDetail] = useState<BillDetailResp>()
    const [username, setUsername] = useState('')
    useEffect(() => {
        walletApi.billDetail({ id: props.route.params.id }).then(res => {
            setDetail(res)
            const userId = res.inOut === BillInOutEnum.INCOME ? res.from : res.to
            userService.getBatchInfo([userId]).then(resu => {
                if (resu.length > 0) {
                    setUsername(resu[0].name)
                }
            })
        })
    }, [])
    return <View style={{ flex: 1, backgroundColor: colors.gray200 }}>
        <Navbar title="賬單詳情" />
        <View style={styles.detail_container}>
            <View style={styles.detail_window}>
                <View style={styles.detail_title}>
                    <View style={{ borderRadius: scale(50), padding: scale(14), backgroundColor: '#1989FA' }}>
                        <Icon name="chatbubble" size={30} color='white' />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        {(username !== '') ? <Text style={{ fontSize: scale(16), marginTop: scale(14) }}>惺惺相惜</Text> : null}
                        <Text style={{ fontSize: scale(24), marginTop: scale(14), fontWeight: '700' }}>{detail?.inOut === BillInOutEnum.INCOME ? '+' : '-'} $ {Number((detail?.amount ?? 0) / 100).toFixed(2)} </Text>
                    </View>
                </View>
                <View style={{ ...styles.detail_block, ...styles.bottom_line }}>
                    <Text style={{ ...styles.detail_line, marginBottom: scale(8), }}>當前狀態：{walletConstant.billStatusTransfer(detail?.type ?? 0, detail?.status ?? 0, detail?.inOut).title}</Text>
                    <Text style={styles.detail_line}>備註：{detail?.remark}</Text>
                </View>
                <View style={{ ...styles.detail_block, ...styles.bottom_line }}>
                    <Text style={{ ...styles.detail_line, marginBottom: scale(8), }}>支付類型：{walletConstant.billTypeTransfer(detail?.type ?? 0)}</Text>
                    <Text style={styles.detail_line}>支付時間： {utils.dateFormat(detail?.createdAt ?? null)}</Text>
                </View>
                <View style={{ ...styles.detail_block }}>
                    <TouchableOpacity style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: scale(8)
                    }} onPress={async () => {
                        await clipboard.setStringAsync(detail?.transactionNo ?? '');
                        toast('複製成功');
                    }}
                    >
                        <Text style={{ ...styles.detail_line }}>交易單號：<Text style={{ fontSize: scale(12), }}>{detail?.transactionNo}</Text></Text>

                        <AntIcon name="copy1" size={12} />
                    </TouchableOpacity>
                    <Text style={styles.detail_line}>商戶單號： {detail?.sellerNo}</Text>
                </View>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    detail_container: {
        flex: 1,
        display: 'flex',
        padding: scale(12),
        paddingTop: scale(18),
        paddingBottom: scale(18)
    },
    detail_window: {
        backgroundColor: 'white',
        borderRadius: scale(14),
        padding: scale(12),
        paddingLeft: scale(20),
        paddingRight: scale(20)
    },
    detail_title: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: scale(32),
        paddingBottom: scale(32),
        borderBottomWidth: scale(1),
        borderBottomColor: colors.gray100
    },
    bottom_line: {
        borderBottomWidth: scale(1),
        borderBottomColor: colors.gray100
    },
    detail_block: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: scale(20),
        paddingBottom: scale(20),
    },
    detail_line: {
        fontSize: scale(15),
        color: colors.gray700
    }
})

export default BillDetail