
import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { StyleSheet, Text, TextInput, View } from "react-native"
import userService from "@/service/user.service";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { UserInfoItem } from "@/api/types/user";
import { Button, NumberInput, Picker, WheelPicker, WheelPickerAlign, } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import PayConfirmModel, { PayConfirmModalType } from "@/components/common/pay-confirm-model";
import walletApi from '@/api/v2/wallet'
import toast from "@/lib/toast";
import { WalletDetailResp, WalletRemitReq, WalletRemitResp } from "@/api/types/wallet";
import { CurrencyTypeEnum } from "@/api/types/enums";
import utils from "@/lib/utils";
import { readAccount } from "@/lib/account";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types";
import FontIcon from 'react-native-vector-icons/FontAwesome'
import { PickerSingleValue } from "react-native-ui-lib/src/components/picker/types";
import { Image } from 'expo-image'
export interface GroupPacketCreateModalType {
    open: (params: {
        uid: string
        targetUser?: UserInfoItem
        onFinish: (obj: WalletRemitReq | null) => void;
    }) => void;
}

type Props = StackScreenProps<RootStackParamList, 'GroupPacket'>;

const GroupPacket = ((props: Props) => {
    const packetTypes = [
        { label: '普通紅包', value: '1' },
        { label: '拼手氣紅包', value: '2' },
        { label: '專屬紅包', value: '3' },
    ]
    const dropdownIcon = <FontIcon name="angle-down" color='#c29f5c' size={scale(18)} style={{ marginLeft: scale(4) }} />;

    const [targetUser, setTargetUser] = useState<UserInfoItem>()
    const [amount, setAmount] = useState<string>('')
    const [remark, setRemark] = useState('')
    const [packetType, setPacketType] = useState<string>('1')
    const [walletBalance, setWalletBalance] = useState<WalletDetailResp>({
        balance: 0,
        currency: CurrencyTypeEnum.USD,
        type: 1
    })
    const onClose = () => {
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
    // useImperativeHandle(ref, () => ({
    //     open: (params: {
    //         uid: string
    //         targetUser?: UserInfoItem
    //         onFinish: (obj: WalletRemitReq | null) => void;
    //     }) => {
    //         const uid = params.uid
    //         userService.getInfo(uid).then((res) => {
    //             if (res !== null) {
    //                 setTargetUser(res)
    //             }
    //         })
    //         walletApi.mineWalletDetail().then((res: WalletDetailResp) => {
    //             setWalletBalance(res)
    //         })
    //         onFinishRef.current = params.onFinish
    //         setVisible(true)
    //     }
    // }));

    const renderPickerItems = () => {
        return packetTypes.map(option => (
            <Picker.Item key={option.value} value={option.value} label={option.label} z>
            </Picker.Item>
        ))
    }
    return <View style={{ flex: 1, backgroundColor: colors.gray200 }}
    // transparent={false} visible={visible} 
    >
        <Navbar title="發紅包" onLeftPress={() => {
            onClose()
            setVisible(false)
        }} />
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: scale(16) }}>
            <View style={styles.head_container}>
                <Picker
                    style={{ color: '#c29f5c' }}
                    placeholder="紅包"
                    value={packetType}
                    trailingAccessory={dropdownIcon}
                    onChange={(item) => {
                        setPacketType(item?.toLocaleString() ?? '1')
                    }}
                    labelColor='#c29f5c'
                    fieldType="filter"
                >
                    {renderPickerItems()}
                </Picker>
            </View>
            <View style={styles.content_container}>
                <View style={{ display: 'flex', flexDirection: 'row',alignItems: 'center' }}>
                    <Image source={require('./icon/red-packet.svg')} 
                        style={{ width: scale(20), height: scale(24),marginRight: scale(8) }} 
                    />
                    <Text>紅包個數</Text>
                </View>
                <View>
                    <NumberInput initialValue={0} onChangeNumber={(v) => {
                        console.log(v);

                    }} placeholder={'填寫紅包個數'} />
                </View>
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
                                const uid = targetUser?.id ?? ''
                                if (uid === '') {
                                    return
                                }
                                const oneWallet = await readAccount(val)
                                if (oneWallet !== null) {
                                    const remitReq: WalletRemitReq = {
                                        id: utils.generateId(),
                                        objUId: targetUser?.id ?? '',
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
                            } finally {
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
    </View>
})

const styles = StyleSheet.create({
    head_container: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        padding: scale(18),
        alignItems: 'center'
    },
    content_container: {
        padding: scale(18),
        backgroundColor: 'white',
        borderRadius: scale(8),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default GroupPacket
