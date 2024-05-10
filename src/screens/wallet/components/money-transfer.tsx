import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { StyleSheet, Text, TextInput, View, Image, Modal } from "react-native"
import userService from "@/service/user.service";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { UserInfoItem } from "@/api/types/user";
import { Button } from "react-native-ui-lib";

import { scale } from "react-native-size-matters/extend";
import PayConfirmModel, { PayConfirmModalType } from "@/components/common/pay-confirm-model";
import walletApi from '@/api/v2/wallet'
import toast from "@/lib/toast";
import { WalletDetailResp, WalletRemitReq, WalletRemitResp } from "@/api/types/wallet";
import { CurrencyTypeEnum } from "@/api/types/enums";
import utils from "@/lib/utils";
import { readAccount } from "@/lib/account";

export interface MoneyTransferModalType {
    open: (params: {
        uid: string
        targetUser?: UserInfoItem
        onFinish: (obj: WalletRemitReq | null) => void;
    }) => void;
}


export default forwardRef((_, ref) => {
    const [targetUser, setTargetUser] = useState<UserInfoItem>()
    const [amount, setAmount] = useState<string>('')
    const [remark, setRemark] = useState('')
    const [walletBalance, setWalletBalance] = useState<WalletDetailResp>({
        balance: 0,
        currency: CurrencyTypeEnum.USD,
        type: 1
    })
    const onClose = () =>{
        setWalletBalance({
            balance: 0,
            currency: CurrencyTypeEnum.USD,
            type: 1
        })
        setAmount('')
        setRemark('')
    }
    const onFinishRef = useRef<(obj: WalletRemitReq | null) => void>();
    const payConfirmModalRef = useRef<PayConfirmModalType>(null);
    const [visible, setVisible] = useState(false)
    useImperativeHandle(ref, () => ({
        open: (params: {
            uid: string
            targetUser?: UserInfoItem
            onFinish: (obj: WalletRemitReq | null) => void;
        }) => {
            const uid = params.uid
            userService.getInfo(uid).then((res) => {
                if (res !== null) {
                    setTargetUser(res)
                }
            })
            walletApi.mineWalletDetail().then((res: WalletDetailResp) => {
                setWalletBalance(res)
            })
            onFinishRef.current = params.onFinish
            setVisible(true)
        }
    }));

    return <Modal style={{ flex: 1, backgroundColor: colors.gray200 }}
        transparent={false} visible={visible} 
        >
        <Navbar title="轉賬" onLeftPress={()=>{
            onClose()
            setVisible(false)
        }}/>
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: scale(16) }}>
            <View style={styles.head_container}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: scale(16), fontWeight: '600', color: colors.gray950 }}>轉賬給 {targetUser?.name} </Text>
                    <Text numberOfLines={1} style={{ fontSize: scale(12), color: colors.gray500, marginTop: scale(4) }}>賬號 {targetUser?.id.substring(0, 12) + '...'} </Text>
                </View>
                <Image source={{ uri: targetUser?.avatar ?? '' }}
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
                            color: colors.gray800,
                            borderBottomColor: colors.gray100,
                            borderBottomWidth: scale(1)
                        }}
                        value={'$ ' + amount}
                        keyboardType="numeric"
                        onChangeText={text => {
                            const newVal = text.replace(/[^0-9.]/g, '')
                            const valNum = Number(newVal)

                            const maxWalletBalance = walletBalance.balance / 100
                            if (valNum > (maxWalletBalance)) {
                                setAmount(maxWalletBalance + '')
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
                        color: colors.gray800,
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
                    if (_amount > walletBalance.balance) {
                        return
                    }

                    payConfirmModalRef.current?.open({
                        title: '確認支付',
                        amount: Number(amount),
                        onChange: (v: string) => {
                            console.log('change password :' + v);
                        },
                        onNext: async (val: string) => {
                            try {
                                if (utils.isBlank(val)) {
                                    toast('密码错误')
                                    return
                                }
                                const uid = targetUser?.id??''
                                if(uid === ''){
                                    return
                                }
                                const oneWallet = await readAccount(val)
                                if (oneWallet !== null) {
                                    const remitReq: WalletRemitReq = {
                                        id: utils.generateId(),
                                        objUId: targetUser?.id??'',
                                        chatId: '',
                                        amount: Number(amount) * 100,
                                        remark: remark,
                                        content: '',
                                    }
                                    onClose()
                                    onFinishRef.current?.(remitReq)
                                }
                            } catch (e) {
                                console.error(e);
                                toast('转账失败')
                            }finally{
                                setVisible(false)
                                setRemark('')
                                setAmount('')
                            }
                        }
                    })
                }}
            />

        </View>
        <PayConfirmModel ref={payConfirmModalRef} />
        {/* <SelectMemberModal ref={selectMemberModalRef} /> */}
    </Modal>
})

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

