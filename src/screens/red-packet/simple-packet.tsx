
import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import userService from "@/service/user.service";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { UserInfoItem } from "@/api/types/user";
import { Button, NumberInput, Picker, WheelPicker, WheelPickerAlign, } from "react-native-ui-lib";
import { scale } from "react-native-size-matters/extend";
import PayConfirmModel, { PayConfirmModalType } from "@/components/common/pay-confirm-model";
import walletApi from '@/api/v2/wallet'
import toast from "@/lib/toast";
import { WalletDetailResp, WalletRemitReq, WalletRemitResp } from "@/api/types/wallet";
import { CurrencyTypeEnum, RedPacketSourceEnum, RedPacketTypeEnum } from "@/api/types/enums";
import utils from "@/lib/utils";
import { readAccount } from "@/lib/account";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types";
import FontIcon from 'react-native-vector-icons/FontAwesome'
import { Image } from 'expo-image'
import { GroupMemberItemVO } from "@/api/types/group";
import GroupMemberList, { GroupMemberListType } from "../contact/components/group-list/group-member-list";

export interface GroupPacketCreateModalType {
    open: (params: {
        uid: string
        targetUser?: UserInfoItem
        onFinish: (obj: WalletRemitReq | null) => void;
    }) => void;
}

interface PacketStateType {
    type: RedPacketTypeEnum
    sourceType: RedPacketSourceEnum
    packetCount: number
    totalAmount: number
    remark: string
    singleAmount?: string
    groupId?: string
    objUids?: string[]
}

type Props = StackScreenProps<RootStackParamList, 'SimplePacket'>;

const GroupPacket = ((props: Props) => {
    const maxTotalAmount = 200
    const packetTypes = [
        { label: '普通紅包', value: '1' },
        { label: '拼手氣紅包', value: '2' },
        { label: '專屬紅包', value: '3' },
    ]
    const [targetUser, setTargetUser] = useState<UserInfoItem|null>(null)
    const [walletBalance, setWalletBalance] = useState<WalletDetailResp>({
        balance: 0,
        currency: CurrencyTypeEnum.USD,
        type: 1
    })

    const [state, setState] = useState<PacketStateType>({
        type: RedPacketTypeEnum.NORMAL,
        sourceType: RedPacketSourceEnum.USER,
        remark: '',
        packetCount: 1,
        totalAmount: 0,
    })
    const onClose = () => {
        setWalletBalance({
            balance: 0,
            currency: CurrencyTypeEnum.USD,
            type: 1
        })
        setState({
            type: RedPacketTypeEnum.RANDOM,
            sourceType: RedPacketSourceEnum.GROUP,
            remark: '',
            packetCount: 0,
            totalAmount: 0,
        })
        setTargetUser(null)
    }
    const onFinishRef = useRef<(obj: WalletRemitReq | null) => void>();
    const payConfirmModalRef = useRef<PayConfirmModalType>(null);
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState<string[]>(['', '', ''])

    const setErrorFunc = (idx: number, label: string) => {
        const _error = [...error]
        _error[idx] = label
        setError(_error)
    }

    const renderAmountNormal = () => {
        return <View style={styles.amount_top}>
            <Text style={{ fontSize: scale(16), color: colors.gray800 }}>單個金額</Text>
            <View>
                <TextInput
                    style={{
                        textAlign: 'right'
                    }}
                    placeholder="$0.00"
                    value={(state.singleAmount ?? 0) === 0 ? '' : state.singleAmount + ''}
                    keyboardType="numeric"
                    inlineImageLeft="dollar"
                    onChangeText={text => {
                        let newVal = text.replace(/[^0-9.]/g, '')
                        changeSingleAmount(newVal)
                    }}
                />
                {error[1] === '' ? null : (<Text style={{ color: 'red', fontSize: scale(12) }}>{error[1]}</Text>)}
            </View>
        </View>
    }

    // useImperativeHandle(ref, () => ({
    //     open: (params: {
    //         gid: string
    //         onFinish: (obj: WalletRemitReq | null) => void;
    //     }) => {
    //         walletApi.mineWalletDetail().then((res: WalletDetailResp) => {
    //             setWalletBalance(res)
    //         })
    //         onFinishRef.current = params.onFinish
    //         setVisible(true)
    //     }
    // }));

    const changeSingleAmount = (singleAmount: string) => {
        const _totalAmount = Number((singleAmount ?? '0')) * state.packetCount
        if (_totalAmount > maxTotalAmount) {
            setErrorFunc(1, '最大金额不可超过200')
        } else {
            setErrorFunc(1, '')
        }
        setState({
            ...state,
            totalAmount: _totalAmount,
            singleAmount: singleAmount
        })
    }

    const renderPickerItems = () => {
        return packetTypes.map(option => (
            <Picker.Item key={option.value} value={option.value} label={option.label}>
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

            <View style={styles.amount_container}>
                {renderAmountNormal()}
                <View>
                    <TextInput
                        placeholder="恭喜發財，大吉大利"
                        placeholderTextColor={colors.gray400}
                        style={styles.remark_style}
                        maxLength={140}
                        value={state.remark}
                        numberOfLines={3}
                        multiline
                        onChangeText={text => {
                            setState({
                                ...state,
                                remark: text
                            })
                        }}
                    />
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: scale(24) }}>
                <Text style={{ color: colors.gray800, fontSize: scale(32), fontWeight: '700' }}>
                    ${state.totalAmount >= maxTotalAmount ? maxTotalAmount.toFixed(2) : state.totalAmount.toFixed(2)}
                </Text>
            </View>
            <Button label="塞錢進紅包" style={{
                borderRadius: scale(12),
                backgroundColor: colors.gray700,
                // marginTop: scale(24)
            }}
                onPress={() => {
                    const _amount = Number(state.totalAmount) * 100
                    if (_amount <= 0) {
                        return
                    }
                    if (_amount > walletBalance.balance) {
                        return
                    }

                    payConfirmModalRef.current?.open({
                        title: '確認支付',
                        amount: Number(state.totalAmount),
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
                                        amount: Number(state.totalAmount) * 100,
                                        remark: state.remark,
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
                            }
                        }
                    })
                }}
            />
            <Text style={{ textAlign: 'center', marginTop: scale(64), color: '#ff4b4b' }} >未領取的紅包，將於24小時後發起退款</Text>
        </View>
        <PayConfirmModel ref={payConfirmModalRef} />
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
        paddingTop: scale(4),
        paddingBottom: scale(4),
        backgroundColor: 'white',
        borderRadius: scale(8),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    amount_container: {
        padding: scale(24),
        backgroundColor: 'white',
        borderRadius: scale(8),
        display: 'flex',
        flexDirection: 'column',
    },
    amount_top: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: colors.gray200,
        borderBottomWidth: scale(1)
    },
    remark_style: {
        fontSize: scale(14),
        padding: 0,
        margin: 0
    }
})

export default GroupPacket
