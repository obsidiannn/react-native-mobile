import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Pressable } from "react-native";
import { WalletItem } from "@/api/types/wallet";
import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { scale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import utils from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { BillInOutEnum, BillTypeEnum } from "@/api/types/enums";
import walletApi from '@/api/v2/wallet'
import walletConstant from '@/constants/wallet'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "@/lib/root-navigation";
import CardItem from "@/components/wallet/card-item";
type Props = StackScreenProps<RootStackParamList, 'WalletTopupRecord'>;


interface WalletPageState {
    page: number
    total: number
    size: number

}

const WalletTopupRecord = (props: Props) => {
    const [state, setState] = useState<WalletPageState>({ page: 0, total: 0, size: 10 })
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<WalletItem[]>([])
    const flashListRef = useRef<FlashList<(WalletItem)>>(null);
    const insets = useSafeAreaInsets();
    const listGenerate = async () => {
        reload(state)
    }

    const reload = async (_state: any, drop?: boolean) => {
        setLoading(true)

        const page = { limit: _state.size, page: _state.page + 1 }
         // walletApi.billRecordPage({ ...page }).then(res => {
            walletApi.billRecordPage({ inOut: BillInOutEnum.INCOME, types: [BillTypeEnum.FILL_IN], ...page }).then(res => {
            const resList = res.items.map(i => {
                return {
                    id: i.id,
                    title: walletConstant.billTypeTransfer(i.type),
                    amount: i.amount,
                    time: utils.dateFormat(i.createdAt),
                    status: i.status,
                    showType: '1',
                    type: i.type
                }
            })
            setState({
                ..._state,
                page: res.page,
                total: res.total,
                income_amount: utils.changeF2Y(res.incomeTotal),
                outcome_amount: utils.changeF2Y(res.outcomeTotal),
            })
            if (drop) {
                setList([...resList])
            } else {
                setList([...list, ...resList])
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    return <View style={{ flex: 1 }}>
        <Navbar title="充值記錄" />
        <View style={{
            padding: scale(14), backgroundColor: colors.gray200, flex: 1,
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
        }}>
            <View style={styles.main_container}>
                <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <FlashList data={list}
                            estimatedListSize={{ height: 10, width: 10 }}
                            refreshing={loading}
                            ref={flashListRef}
                            keyExtractor={(item) => item.id}
                            onEndReached={listGenerate}
                            estimatedItemSize={scale(0.1)}
                            renderItem={({ item }) => {
                                return <CardItem data={item} key={item.id} bgColor={colors.gray200} onClick={() => {
                                        navigate('BillDetail', { id: item.id })
                                    }} />
                            }} />
                    </View>
                </View>
            </View>
        </View>
    </View>
}


const styles = StyleSheet.create({
    main_container: {
        borderRadius: scale(14),
        flex: 1
    },
    button_area: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: scale(18),
        borderBottomWidth: scale(1),
        borderBottomColor: colors.gray200,
    },
    button_item: {
        borderRadius: scale(12),
        marginRight: scale(12),
        paddingLeft: scale(1),
        paddingRight: scale(1),
        backgroundColor: colors.gray300,
    },
    button_select: {
        backgroundColor: colors.gray600,
        color: colors.gray600,
    },
    button_label_select: {
        padding: 0,
        margin: 0,
        color: 'white',
        fontSize: scale(14)
    },
    button_label_default: {
        color: colors.gray950,
        fontSize: scale(14)
    },
    stat_area: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: scale(12),
        paddingBottom: scale(12)
    },
    list_area: {
        paddingBottom: scale(12)
    },
    card_item: {
        backgroundColor: colors.gray200,
        borderRadius: scale(12),
        padding: scale(18),
        marginBottom: scale(14)
    },
    card_title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(10)
    },
})

export default WalletTopupRecord

