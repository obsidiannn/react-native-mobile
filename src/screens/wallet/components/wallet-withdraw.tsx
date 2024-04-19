import { PermissionsAndroid, Platform, Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { BorderRadiuses, Button } from "react-native-ui-lib";
import toast from "@/lib/toast";
import Navbar from "@/components/navbar";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import AntIcon from 'react-native-vector-icons/AntDesign'
import walletApi from '@/api/v2/wallet'
import { WalletDetailResp } from "@/api/types/wallet";
import utils from "@/lib/utils";
type Props = StackScreenProps<RootStackParamList, 'WalletWithdraw'>;
// 取款
const WalletWithdraw = ({ }: Props) => {
    const insets = useSafeAreaInsets();
    const [address, setAddress] = useState<string>('');
    const [drawAddress, setDrawAddress] = useState('')
    const [drawAmount, setDrawAmount] = useState<string>('')
    const [walletDetaill, setWalletDetail] = useState<WalletDetailResp>()
    useEffect(() => {
        (async () => {
            const address = await globalThis.wallet?.address.toLowerCase() ?? '';
            setAddress(address);
        })();
        // walletApi.mineWalletDetail().then(res=>{
        //     setWalletDetail(res)
        // })
    }, []);

    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="提現" />
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', padding: scale(18) }}>
                <View style={styles.main_container}>
                    <View style={styles.line_style}>
                        <Text style={{ color: colors.gray700, fontSize: scale(14) }}>餘額：${utils.changeF2Y(walletDetaill?.balance)}</Text>
                    </View>
                    <View style={{ ...styles.line_style, display: 'flex', flexDirection: 'row' }}>
                        <TextInput
                            placeholder="輸入取出金額"
                            placeholderTextColor={colors.gray400}
                            style={{
                                borderWidth: scale(1),
                                borderColor: colors.gray200,
                                padding: scale(8),
                                borderTopLeftRadius: scale(8),
                                borderBottomLeftRadius: scale(8),
                                flex: 1,
                            }}
                            value={drawAmount}
                            keyboardType="numeric"
                            onChangeText={text => {
                                const newVal = text.replace(/[^0-9.]/g, '')
                                setDrawAmount(newVal)
                            }}
                        />
                        <Button label="全部" style={styles.button_style} size="small" onPress={() => {
                            setDrawAmount((walletDetaill?.balance ?? 0).toString())
                        }} />
                    </View>
                    <View style={{ ...styles.line_style, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: scale(18) }}>
                        <Text style={{ color: colors.gray700, fontSize: scale(14) }}>取出網絡：tron</Text>
                        <Text style={{ color: colors.gray700, fontSize: scale(14) }}>gas費用~$0.55</Text>
                    </View>
                    <View style={{
                        ...styles.line_style, display: 'flex', flexDirection: 'row',
                    }}>
                        <TextInput
                            placeholder="輸入收款地址"
                            placeholderTextColor={colors.gray400}
                            style={{
                                borderWidth: scale(1),
                                borderColor: colors.gray200,
                                padding: scale(8),
                                borderRadius: scale(8),
                                flex: 1,
                            }}
                            value={drawAddress}
                            onChangeText={text => {
                                const newVal = text.replace(/[\W]/g, '')
                                setDrawAddress(newVal)
                            }}
                        />
                    </View>
                    <View style={{
                        ...styles.line_style, display: 'flex', flexDirection: 'row',
                        paddingBottom: scale(24), alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FF9C00' }}>請謹慎使用取出，操作後將不可撤回</Text>
                    </View>
                </View>
                <View style={{marginTop: scale(24)}}>
                    <Button style={{
                        borderRadius: scale(12),
                        backgroundColor: colors.gray600,
                    }} label="立即取出" />
                </View>
            </View>
        </View>
    );
};

export default WalletWithdraw;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray200,

    },
    main_container: {
        backgroundColor: 'white',
        borderRadius: scale(14),
        padding: scale(14),
        display: 'flex',
        flexDirection: 'column',
    },
    button_style: {
        backgroundColor: colors.gray600,
        borderRadius: scale(14),
        marginLeft: scale(-12)
    },
    line_style: {
        marginTop: scale(8),
        marginBottom: scale(8),
    }

})