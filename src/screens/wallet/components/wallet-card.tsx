import colors from "@/config/colors";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pressable, Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import { Image } from "expo-image";

import { WalletDetailResp } from "@/api/types/wallet";
import walletApi from '@/api/v2/wallet'
import { navigate } from "@/lib/root-navigation";

export default (props: {
    bottomRadius: boolean,
    navigateToRecord?: boolean
}) => {

    const [walletDetail, setWalletDetail] = useState<WalletDetailResp>()

    const getWalletInfo = () => {
        walletApi.mineWalletDetail().then(res => {
            setWalletDetail(res)
        })
    }

    useEffect(() => {
        getWalletInfo()
    }, [])

    return <View style={styles.wallet_container}>

        <View style={styles.wallet_card} >
            <Pressable onPress={() => {
                getWalletInfo()
                if(props.navigateToRecord){
                    navigate('WalletRecord')
                }
            }} style={{
                width: '100%',
                alignItems: 'center',
                paddingBottom: scale(18),
            }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ width: scale(28), height: scale(28) }}
                        source={require('../icons/dollar.svg')} />
                    <Text style={styles.wallet_title}>賬戶餘額</Text>
                </View>
                <View >

                    <Text style={{
                        ...styles.wallet_title,
                        fontSize: scale(20),
                        fontWeight: '900',
                        marginTop: scale(8)
                    }}>$ {Number((walletDetail?.balance ?? 0) / 100).toFixed(2)}</Text>
                </View>
            </Pressable>
            <View style={styles.bottom_button_area}>
                <View>
                    <Button style={styles.buttom_button} label="收款" /></View>
                <View><Button style={styles.buttom_button} label="存入" /></View>
                <View><Button style={{ ...styles.buttom_button, marginRight: 0 }} label="取款" /></View>
            </View>
        </View>

    </View>
}

const styles = StyleSheet.create({
    wallet_container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: scale(24),
        padding: scale(10),
        overflow: 'hidden',
    },
    wallet_card: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.gray600,
        alignItems: 'center',
        padding: scale(14),
        borderRadius: scale(18),
        

        // marginLeft: scale(14),
        // marginRight: scale(14),
        // marginBottom: -30
    },
    wallet_title: {
        color: 'white',
        fontWeight: '500',
        fontSize: scale(18)
    },
    bottom_button_area: {
        display: 'flex',
        flexDirection: 'row',
        padding: scale(8),
        justifyContent: 'space-between',
    },
    buttom_button: {
        marginRight: scale(18),
        backgroundColor: colors.gray500,
        borderRadius: scale(6),
        paddingLeft: scale(4),
        paddingRight: scale(4)
    },
    cut_area: {

    }
})