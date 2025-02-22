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
import { RefreshControl } from "react-native";
import { navigate } from "@/lib/root-navigation";
type Props = StackScreenProps<RootStackParamList, 'WalletRecordPage'>;


interface WalletPageState {
    income_amount: string
    outcome_amount: string
    page: number
    total: number
    size: number
    button_idx: number

}

const WalletRecordPage = (props: Props) => {
    const [state, setState] = useState<WalletPageState>({ income_amount: '0', outcome_amount: '0', total: 0, page: 0, button_idx: 0, size: 10 })
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<WalletItem[]>([])
    const flashListRef = useRef<FlashList<(WalletItem)>>(null);
    const insets = useSafeAreaInsets();
    const listGenerate = async () => {
        console.log('出发刷新');

        reload(state)
    }

    const reload = async (_state: any, drop?: boolean) => {

        const typeState = props.route.params.typeState
        setLoading(true)

        let inOut = undefined
        if (_state.button_idx !== 0) {
            inOut = _state.button_idx === 1 ? BillInOutEnum.INCOME : BillInOutEnum.OUTCOME
        }
        const types: number[] = []
        if (typeState === "1") {
            types.concat([BillTypeEnum.DRAW_CASH, BillTypeEnum.GROUP_DRAW_CASH])
        }

        const page = { limit: 3, page: _state.page + 1 }
        walletApi.billRecordPage({ inOut: inOut, types: types, ...page }).then(res => {
            const resList = res.items.map(i => {
                return {
                    id: i.id,
                    title: walletConstant.billTypeTransfer(i.type),
                    amount: i.amount,
                    time: utils.dateFormat(i.createdAt),
                    status: i.status,
                    showType: '0',
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

    const pressBtn = (idx: number) => {
        reload({
            ...state,
            page: 0,
            button_idx: idx
        }, true)
    }

    return <View style={{ flex: 1 }}>
        <Navbar title="BOBO錢包" />
        <View style={{
            padding: scale(14), backgroundColor: colors.gray200, flex: 1,
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
        }}>
            <View style={styles.main_container}>
                <View style={styles.button_area}>
                    {['全部', '收入', '支出'].map((s, i) => {
                        return <Button key={i}
                            onPress={() => { pressBtn(i) }}
                            style={{
                                ...styles.button_item,
                                ...(state?.button_idx ?? -1) === i ? { ...styles.button_select } : {}
                            }} label={s}
                            labelStyle={{
                                ...(state?.button_idx ?? -1) === i ? styles.button_label_select : styles.button_label_default
                            }}
                        />
                    })}
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <View style={styles.stat_area}>
                        <Text>收入總額：${state.income_amount}</Text>
                        <Text>支出總額：${state.outcome_amount}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        <FlashList data={list}
                            estimatedListSize={{height: 10,width: 10}}
                            refreshing={loading}
                            ref={flashListRef}
                            keyExtractor={(item) => item.id}
                            onEndReached={listGenerate}
                            estimatedItemSize={scale(0.1)}
                            ListFooterComponent={<View style={{alignItems:'center'}}>
                                {loading?<ActivityIndicator size={14}/> :null }
                            </View>}
                            renderItem={({ item }) => {
                                return <Pressable style={styles.card_item} key={item.id} onPress={()=>{
                                    navigate('BillDetail',{id: item.id})
                                }}>
                                    <View style={styles.card_title}>
                                        <Text style={{ color: colors.gray800, fontSize: scale(18) }}>{item.title}</Text>
                                        <Text style={{ color: colors.gray800, fontSize: scale(24), fontWeight: '700' }}>${Number((item.amount / 100)).toFixed(2)}</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text style={{ fontSize: scale(12), color: colors.gray400 }}>{item.time}</Text>
                                    </View>
                                </Pressable>
                            }} />
                    </View>
                </View>
            </View>
        </View>
    </View>
}


const styles = StyleSheet.create({
    main_container: {
        backgroundColor: 'white',
        borderRadius: scale(14),
        padding: scale(24),
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

export default WalletRecordPage

