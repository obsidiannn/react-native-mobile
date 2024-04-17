import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { TabControllerItemProps, Text, TabController, Button } from "react-native-ui-lib";
import WalletCard from "./components/wallet-card";
import { StyleSheet, View } from "react-native";
import colors from "@/config/colors";
import Navbar from "@/components/navbar";
import { scale } from "react-native-size-matters/extend";

import PagerView from "react-native-pager-view";
import { useEffect, useRef, useState } from "react";
import WalletRecordView from "./components/wallet-record-view";
import walletApi from '@/api/v2/wallet'
import { BillRecordItem, WalletItem } from "@/api/types/wallet";
import { BillInOutEnum, BillTypeEnum } from "@/api/types/enums";
import walletConstant from '@/constants/wallet'
import dayjs from 'dayjs'
type Props = StackScreenProps<RootStackParamList, 'WalletRecord'>;

interface RecordItem {
    items: WalletItem[],
    total: number
}

const formatDate = 'YYYY-MM-DD HH:mm:ss'
export default (props: Props) => {
    const [pageIndex, setPageIndex] = useState(0);
    const pagerViewRef = useRef<PagerView>(null);
    const [list1, setList1] = useState<RecordItem>({ items: [], total: 0 })
    const [list2, setList2] = useState<RecordItem>({ items: [], total: 0 })
    const [list3, setList3] = useState<RecordItem>({ items: [], total: 0 })
    const tabs = [
        { label: '账单列表' },
        { label: '提现记录' },
        { label: '充值记录' },
    ]


    useEffect(() => {
        const page = { limit: 5, page: 1 }
        walletApi.billRecordPage({ inOut: BillInOutEnum.OUTCOME, ...page }).then(res => {
            const list = res.items.map(i => {
                return {
                    id: i.id,
                    title: walletConstant.billTypeTransfer(i.type),
                    amount: i.amount,
                    time: dayjs(i.createdAt).format(formatDate),
                    status: i.status,
                    showType: '0', type: i.type
                }
            })
            setList1({ items: list, total: res.total })
        })
        walletApi.billRecordPage({
            inOut: BillInOutEnum.INCOME,
            types: [BillTypeEnum.DRAW_CASH, BillTypeEnum.GROUP_DRAW_CASH]
            , ...page
        }).then(res => {
            const list = res.items.map(i => {
                return {
                    id: i.id,
                    title: walletConstant.billTypeTransfer(i.type),
                    amount: i.amount,
                    time: dayjs(i.createdAt).format(formatDate),
                    status: i.status,
                    showType: '1', type: i.type
                }
            })
            setList2({ items: list, total: res.total })
        })
        walletApi.billRecordPage({
            inOut: BillInOutEnum.OUTCOME,
            types: [BillTypeEnum.FILL_IN], ...page
        }).then(res => {
            const list = res.items.map(i => {
                return {
                    id: i.id,
                    title: walletConstant.billTypeTransfer(i.type),
                    amount: i.amount,
                    time: dayjs(i.createdAt).format(formatDate),
                    status: i.status,
                    showType: '2', type: i.type
                }
            })
            setList3({ items: list, total: res.total })
        })

    }, [])
    return <View style={styles.record_container}>
        <Navbar title="个人资料" />
        <WalletCard bottomRadius={false} />
        <View style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: scale(8) }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                {
                    tabs.map((i, idx) => {
                        return <Button key={'tab_btn_' + idx}
                            labelStyle={pageIndex === idx ? styles.button_label_selected : styles.button_label_default}
                            style={pageIndex === idx ? styles.button_item_selected : styles.button_item_default}
                            label={i.label}
                            onPress={() => {
                                setPageIndex(idx)
                                pagerViewRef.current?.setPage(idx)
                            }}
                        />
                    })
                }
            </View>

            <PagerView ref={pagerViewRef}
                scrollEnabled={false}
                style={{
                    flex: 1
                }} onPageSelected={(v) => {
                    setPageIndex(v.nativeEvent.position);
                }} initialPage={pageIndex}>

                <WalletRecordView key="0" type_state="0" data={list1.items} total={list1.total} />
                <WalletRecordView key="1" type_state="1" data={list2.items} total={list2.total} />
                <WalletRecordView key="2" type_state="2" data={list3.items} total={list3.total} />
            </PagerView>



        </View>
    </View>

}

const styles = StyleSheet.create({
    record_container: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.gray200,
    },
    tab_item: {
        fontSize: scale(16),
        color: colors.gray800
    },
    button_item_default: {
        backgroundColor: colors.gray200,
        borderRadius: scale(12),
        padding: scale(2),
    },
    button_item_selected: {
        backgroundColor: colors.gray100,
        borderRadius: scale(12),
        padding: scale(2),
    },
    button_label_default: {
        color: colors.gray400
    },
    button_label_selected: {
        color: colors.gray800
    },
    tab_page: {

        display: 'flex',
        flexDirection: 'column',
        padding: scale(8),
        margin: 0
    }
})