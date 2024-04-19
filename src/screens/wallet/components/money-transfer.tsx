import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, Text, TextInput, View } from "react-native"
import userService from "@/service/user.service";
import { useEffect, useRef, useState } from "react";
import { UserInfoItem } from "@/api/types/user";
import { Button, Image } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import PayConfirmModel, { PayConfirmModalType } from "@/components/common/pay-confirm-model";
import { readAccount } from "@/lib/account";
import toast from "@/lib/toast";
import SelectMemberModal, { SelectMemberModalType } from "@/components/select-member-modal";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = StackScreenProps<RootStackParamList, 'MoneyTransfer'>;
const MoneyTransferScreen = (props: Props) => {
    const [targetUser, setTargetUser] = useState<UserInfoItem>()
    const [amount, setAmount] = useState('')
    const [remark, setRemark] = useState('')
    const [walletBalance, setWalletBalance] = useState(2000)
    
    const [password, setPassword] = useState('')
    const payConfirmModalRef = useRef<PayConfirmModalType>(null);
    useEffect(() => {
        //   const uid = props.route.params.uid
        const uid = '0xc9ed73ECb9F20C2A839Ad141aB2fC071Ddb0b6bD'
        // userService.getInfo(uid).then((res)=>{
        //     if(res!== null){
        //         setTargetUser(res)
        //     }
        // })
    }, [])

    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray200 }}>
        <Navbar title="轉賬" />
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: scale(16) }}>
            <View style={styles.head_container}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '600', color: colors.gray950 }}>轉賬給 Team Name  </Text>
                    <Text style={{ fontSize: scale(12), color: colors.gray500, marginTop: scale(4) }}>賬號 0xc9ed73ECb9F20C2A839 </Text>
                </View>
                <Image src="https://avatars.githubusercontent.com/u/122279700"
                    style={{ borderRadius: scale(8) }}
                    width={scale(46)} height={scale(46)} />
            </View>
            <View style={styles.content_container}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ color: colors.gray800, fontSize: scale(14) }}>轉賬金額</Text>
                    <TextInput
                        style={{
                            padding: scale(8),
                            paddingLeft: 0,
                            height: scale(64),
                            fontSize: scale(32),
                            borderBottomColor: colors.gray100,
                            borderBottomWidth: scale(1)
                        }}
                        value={'$ ' + amount}
                        keyboardType="numeric"
                        onChangeText={text => {
                            const newVal = text.replace(/[^0-9.]/g, '')
                            const valNum = Number(newVal)
                            if (valNum > walletBalance) {
                                setAmount(walletBalance + '')
                            } else {
                                setAmount(newVal)
                            }
                        }}
                    />

                </View>

                <TextInput
                    placeholder="添加轉賬說明"
                    placeholderTextColor={colors.gray400}
                    style={{
                        padding: scale(8),
                        fontSize: scale(14),
                    }}
                    maxLength={140}
                    value={remark}
                    numberOfLines={3}
                    multiline
                    onChangeText={text => {
                        setRemark(text)
                    }}
                />
            </View>
            <Button label="確認支付" style={{
                borderRadius: scale(12),
                backgroundColor: colors.gray700,
                marginTop: scale(24)
            }}
                onPress={() => {
                    const _amount = Number(amount)
                    if (_amount <= 0) {
                        return
                    }
                    // selectMemberModalRef.current?.open({
                    //     title: 'hi',
                    //     options: [],
                    //     callback: (options:SelectMemberOption[]) => {

                    //     },
                    // })
                    payConfirmModalRef.current?.open({
                        title: '確認支付',
                        amount: Number(amount),
                        onChange: (v: string) => { setPassword(v); },
                        onNext: async () => {
                            return new Promise(function (resolve, reject) {
                                setTimeout(() => {
                                    console.log('====================================');
                                    console.log('wait');
                                    console.log('====================================');
                                    resolve()
                                }, 3000)
                            })
                        }
                    })
                }}
            />

        </View>
        <PayConfirmModel ref={payConfirmModalRef} />
        {/* <SelectMemberModal ref={selectMemberModalRef} /> */}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    head_container: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        padding: scale(24),
        paddingTop: scale(36),
        alignItems: 'center'
    },
    content_container: {
        padding: scale(36),
        backgroundColor: 'white',
        borderRadius: scale(8)
    }
})

export default MoneyTransferScreen