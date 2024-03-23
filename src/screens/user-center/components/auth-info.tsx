import { Pressable, StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import toast from "../../../lib/toast";
import * as clipboard from 'expo-clipboard';
import { navigate } from "../../../lib/root-navigation";
import { Image } from "expo-image";
import EncImage  from '@/components/common/enc-image'
import util from '@/lib/utils'
import { useEffect, useState } from "react";
import { UserInfoItem } from "@/api/types/user";
import fileService from "@/service/file.service";
import { useRecoilState } from "recoil";

import { atomCurrentUser } from '@/stores/app' 

export default (
   
) => {
    const [currentUser,_] = useRecoilState(atomCurrentUser)
    // const selfKey = ():string  =>{
    //     const wallet = globalThis.wallet
    //     if(wallet){
    //         // return wallet.signingKey.computeSharedSecret(wallet.signingKey.publicKey)
    //         return wallet.signingKey.privateKey
    //     }
    //     return ''
    // }
    const localUser = () =>{
        if(currentUser){
            return currentUser
        }else{
            return globalThis.currentUser
        }
    }

    return <View style={styles.container}>

        <Image source={fileService.getFullUrl(localUser()?.avatar??'')} style={styles.avatar} />
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{localUser()?.name}</Text>
            <Pressable style={styles.uidContainer} onPress={async () => {
                if (await clipboard.setStringAsync(localUser()?.id??'')) {
                    toast('复制成功');
                }
            }}>
            <Text style={styles.uid}>{localUser()?.id}</Text>
            </Pressable>
        </View>
        <Pressable onPress={() => {
            navigate('UserCard');
        }}>
            <Image style={styles.qrcode} source={require('../../../assets/icons/qrcode.svg')} />
        </Pressable>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(59),
        paddingLeft: scale(27),
        paddingRight: scale(40),
        height: scale(50)
    },
    infoContainer: {
        flex: 1,
        height: 50,
        paddingLeft: scale(10),
        display: 'flex',
        justifyContent: "flex-start",
    },
    uidContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(6),
    },
    uid: {
        color: '#999',
        fontSize: 12,
    },
    name: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    avatar: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        borderWidth: scale(1),
        borderColor: '#F0F0F0',
    },
    qrcode: {
        width: scale(42),
        height: scale(42),
    }
});