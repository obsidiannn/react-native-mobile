
import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { Pressable, StyleSheet, Text, TextInput, View, Modal } from "react-native"
import userService from "@/service/user.service";
import { forwardRef, useImperativeHandle, useRef, useState, useMemo } from "react";
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
import FontIcon from 'react-native-vector-icons/FontAwesome'
import { Image } from 'expo-image'
import GroupMemberList, { GroupMemberListType } from "../contact/components/group-list/group-member-list";
import { GroupMemberItemVO } from "@/api/types/group";
import fileService from "@/service/file.service";
import { RedPacketCreateReq } from "@/api/types/red-packet";


export interface GroupPacketCreateModalType {
    open: (params: {
        gid: string
        onFinish: (obj: RedPacketCreateReq) => void;
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

export default forwardRef((props: { members: GroupMemberItemVO[] }, ref) => {
    const maxTotalAmount = 200
    const [groupId, setGroupId] = useState('')
    const packetTypes = [
        { label: '普通紅包', value: '1' },
        { label: '拼手氣紅包', value: '2' },
        { label: '專屬紅包', value: '3' },
    ]
    const defaultRemark = '恭喜發財，大吉大利'
    const dropdownIcon = <FontIcon name="angle-down" color='#c29f5c' size={scale(18)} style={{ marginLeft: scale(4) }} />;
    const [targetUser, setTargetUser] = useState<GroupMemberItemVO | null>(null)
    const [walletBalance, setWalletBalance] = useState<WalletDetailResp>({
        balance: 0,
        currency: CurrencyTypeEnum.USD,
        type: 1
    })
    const [state, setState] = useState<PacketStateType>({
        type: RedPacketTypeEnum.NORMAL,
        sourceType: RedPacketSourceEnum.GROUP,
        remark: '',
        packetCount: 0,
        totalAmount: 0,
    })

    const onClose = () => {
        setWalletBalance({
            balance: 0,
            currency: CurrencyTypeEnum.USD,
            type: 1
        })
        setState({
            type: RedPacketTypeEnum.NORMAL,
            sourceType: RedPacketSourceEnum.GROUP,
            remark: '',
            packetCount: 0,
            totalAmount: 0,
        })
        setTargetUser(null)
    }
    const onFinishRef = useRef<(obj: RedPacketCreateReq | null) => void>();
    const payConfirmModalRef = useRef<PayConfirmModalType>(null);
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState<string[]>(['', '', ''])

    const groupMemberModalRef = useRef<GroupMemberListType>(null);

    // 普通，上部分
    const renderNormal = () => {
        return <View style={styles.content_container}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('./icon/red-packet.svg')}
                    style={{ width: scale(20), height: scale(24), marginRight: scale(8) }}
                />
                <Text style={{ color: colors.gray800, fontSize: scale(15) }}>紅包個數</Text>
            </View>
            <View>
                <TextInput
                    style={{
                        fontSize: scale(14),
                        borderBottomColor: colors.gray100,
                        textAlign: 'right'
                    }}
                    placeholder="请填写红包个数"
                    value={((state.packetCount ?? 0) === 0) ? undefined : state.packetCount + ''}
                    keyboardType="numeric"
                    onChangeText={text => {
                        const newVal = text.replace(/[^1-9]/g, '')
                        const valNum = Number(newVal)
                        changeCount(valNum)
                    }}
                />
                {error[0] === '' ? null : (<Text style={{ color: 'red', fontSize: scale(12) }}>{error[0]}</Text>)}
            </View>
        </View>
    }

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

    const renderAmountRandom = () => {
        return <View style={styles.amount_top}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('./icon/gold-amount.svg')}
                    style={{ width: scale(20), height: scale(24), marginRight: scale(8) }}
                />
                <Text style={{ fontSize: scale(16), color: colors.gray800 }}>总金额</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
                <TextInput
                    style={{
                        borderBottomColor: colors.gray100,
                        borderBottomWidth: scale(1),
                        textAlign: 'right'
                    }}
                    placeholder="$0.00"
                    value={(state.totalAmount ?? 0) === 0 ? '' : state.totalAmount + ''}
                    keyboardType="numeric"
                    inlineImageLeft="dollar"
                    onChangeText={text => {
                        let newVal = text.replace(/[^0-9.]/g, '')
                        changeTotalAmount(newVal)
                    }}
                />
                {error[2] === '' ? null : (<Text style={{ color: 'red', fontSize: scale(12) }}>{error[2]}</Text>)}
            </View>
        </View>
    }

    const renderTargeted = () => {
        return <Pressable style={styles.content_container} onPress={() => {
            groupMemberModalRef.current?.open({
                members: props.members,
                onPress: async (uid: string) => {
                    const user = props.members.filter(p => p.uid === uid)
                    if (user && user.length > 0) {
                        setTargetUser(user[0])
                    }

                }
            })
        }}>
            <View>
                <Text style={{ color: colors.gray800, fontSize: scale(15), marginTop: scale(10), marginBottom: scale(10) }}>發給誰</Text>
            </View>


            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {targetUser !== null ? <>
                    <Image source={fileService.getFullUrl(targetUser.avatar)}
                        style={{
                            width: scale(32), height: scale(32),
                            borderRadius: scale(8), marginRight: scale(4),
                        }} />
                    <Text>{targetUser.name}</Text>
                </> : null}
                <FontIcon name="angle-right" size={16} style={{ marginLeft: scale(4) }} />
            </View>
        </Pressable>

    }

    useImperativeHandle(ref, () => ({
        open: (params: {
            gid: string
            onFinish: (obj: any) => void;
        }) => {
            walletApi.mineWalletDetail().then((res: WalletDetailResp) => {
                setWalletBalance(res)
            })
            onFinishRef.current = params.onFinish
            setGroupId(params.gid)
            setVisible(true)
        }
    }));

    const changeCount = (count: number) => {
        const _maxMember = props.members.length
        const _count = count >= _maxMember ? _maxMember : count
        const _totalAmount = Number((state.singleAmount ?? '0')) * _count
        if (state.type === RedPacketTypeEnum.NORMAL) {
            if (_totalAmount > maxTotalAmount) {
                setErrorFunc(0, '最大金额不可超过200')
            } else {
                setErrorFunc(0, '')
            }
            setState({
                ...state,
                totalAmount: _totalAmount,
                packetCount: _count
            })
        }
        if (state.type === RedPacketTypeEnum.RANDOM) {
            setState({
                ...state,
                packetCount: _count
            })
        }

    }

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

    const changeTotalAmount = (totalAmount: string) => {
        const _totalAmount = Number(totalAmount)
        if (_totalAmount > maxTotalAmount) {
            setErrorFunc(2, '最大金额不可超过200')
        } else {
            setErrorFunc(2, '')
        }
        setState({
            ...state,
            totalAmount: _totalAmount,
            singleAmount: '0'
        })
    }

    const renderPickerItems = () => {
        return packetTypes.map(option => (
            <Picker.Item key={option.value} value={option.value} label={option.label}>
            </Picker.Item>
        ))
    }

    const preCheck = (): boolean => {
        if (groupId === '') {
            return false
        }
        if (state.totalAmount <= 0 || (state.totalAmount * 100) > walletBalance.balance) {
            return false
        }
        if (error.filter(e => e !== '').length > 0) {
            return false
        }
        if (state.type === RedPacketTypeEnum.NORMAL) {
            if (state.packetCount <= 0 || (Number(state.singleAmount ?? '0')) <= 0) {
                return false
            }
        }
        if (state.type === RedPacketTypeEnum.RANDOM) {
            if (state.packetCount <= 0) {
                return false
            }
        }
        if (state.type === RedPacketTypeEnum.TARGETED) {
            if (targetUser === null) {
                return false
            }
        }
        return true
    }

    const generateReq = (): RedPacketCreateReq => {
        const redPacketCreateReq: RedPacketCreateReq = {
            id: utils.generateId(),
            type: state.type,
            sourceType: state.sourceType,
            packetCount: state.packetCount,
            remark: (state.remark ?? '') === ''?defaultRemark: state.remark,
            singleAmount: Number(state.singleAmount) * 100,
            totalAmount: state.totalAmount * 100,
            objUIds: [targetUser?.uid ?? ''],
            groupId: groupId
        }
        return redPacketCreateReq
    }

    return <Modal style={{ flex: 1, }} transparent={true} visible={visible} >
        <Navbar title="發紅包" onLeftPress={() => {
            onClose()
            setVisible(false)
        }} />
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: scale(16), backgroundColor: colors.gray200 }}>
            <View style={styles.head_container}>
                <Picker
                    style={{ color: '#c29f5c' }}
                    placeholder="紅包"
                    value={state.type + ''}
                    trailingAccessory={dropdownIcon}
                    onChange={(item) => {
                        setState({
                            ...state,
                            type: Number(item),
                            singleAmount: '',
                            totalAmount: 0,
                            packetCount: 0
                        })
                    }}
                    labelColor='#c29f5c'
                    fieldType="filter"
                >
                    {renderPickerItems()}
                </Picker>
            </View>
            {
                state.sourceType === RedPacketSourceEnum.GROUP ?
                    (
                        <>
                            {state.type === RedPacketTypeEnum.TARGETED ? renderTargeted() : renderNormal()}
                        </>
                    ) : null
            }

            {
                state.sourceType === RedPacketSourceEnum.GROUP ?
                    (<Text style={{ margin: scale(8), color: colors.gray400 }}>本群共{(props.members??[]).length}人</Text>) : null
            }


            <View style={styles.amount_container}>
                <>
                    {state.type === RedPacketTypeEnum.NORMAL ? renderAmountNormal() : renderAmountRandom()}
                </>
                <View>
                    <TextInput
                        placeholder={defaultRemark}
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
                                if (!preCheck()) {
                                    return
                                }
                                const oneWallet = await readAccount(val)
                                if (oneWallet !== null) {
                                    const redPacketCreateReq = generateReq()
                                    onClose()
                                    onFinishRef.current?.(redPacketCreateReq)
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
        <GroupMemberList ref={groupMemberModalRef} />
    </Modal>
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

