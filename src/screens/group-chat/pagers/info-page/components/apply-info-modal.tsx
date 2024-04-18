import { GroupApplyItem } from "@/api/types/group";
import Navbar from "@/components/navbar";
import groupService from "@/service/group.service";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Modal } from "react-native-ui-lib"
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import * as clipboard from 'expo-clipboard';
import toast from "@/lib/toast";
import colors from "@/config/colors";
import { handleAddress } from "@/lib/account";
import quickAes from "@/lib/quick-aes";
import { ethers } from "ethers";
import userService from "@/service/user.service";
export interface ApplyInfoModalRef {
    open: (item: GroupApplyItem) => void;
}
export default forwardRef((props: {
    onCheck: (item: GroupApplyItem) => void;
    onReject: (item: GroupApplyItem) => void;
}, ref) => {
    const [visible, setVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [item, setItem] = useState<GroupApplyItem>();
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        open: (v: GroupApplyItem) => {
            setItem(v);
            setVisible(true);
        }
    }));
    return <Modal animationType="slide" visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="驗證信息" onLeftPress={() => setVisible(false)} />
            </View>
            <View>
                <View style={{ paddingHorizontal: scale(15), paddingTop: verticalScale(21) }}>
                    <View style={{
                        height: verticalScale(82),
                        borderWidth: 1,
                        borderColor: '#F4F4F4',
                        backgroundColor: '#F8F8F8',
                        width: '100%',
                        borderRadius: verticalScale(16),
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: scale(15),
                    }}>
                        <Image style={{
                            width: verticalScale(50),
                            height: verticalScale(50),
                            borderRadius: verticalScale(25),
                            borderWidth: 1,
                            borderColor: '#F0F0F0',
                            marginRight: scale(15),
                        }} source={item?.avatar} />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>{item?.name}</Text>
                            <TouchableOpacity onPress={async () => {
                                await clipboard.setStringAsync(item?.uid ?? '');
                                toast('複製成功');
                            }} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400' }}>{handleAddress(item?.uid ?? '')}</Text>
                                <Image style={{
                                    width: verticalScale(20),
                                    height: verticalScale(20),
                                }} source={require('@/assets/icons/copy.svg')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#F4F4F4',
                        backgroundColor: '#F8F8F8',
                        width: '100%',
                        borderRadius: verticalScale(16),
                        paddingHorizontal: scale(15),
                        paddingVertical: verticalScale(17),
                        marginTop: verticalScale(10),
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#333'
                        }}>備註</Text>
                    </View>
                </View>
                <View style={{
                    paddingHorizontal: scale(23),
                }}>
                    {item?.status === 1 ? <>
                        <Button size="large" style={{
                            width: '100%',
                            height: verticalScale(50),
                            borderRadius: verticalScale(16),
                            marginTop: verticalScale(30),
                        }} backgroundColor={colors.primary} onPress={async () => {
                            if (loading) {
                                return
                            };
                            setLoading(true);
                            try {
                                const encInfo = await groupService.encInfo(item.gid);
                                const group = await groupService.getInfo(item.gid);
                                if (!group) {
                                    throw new Error('羣不存在')
                                }
                                if (!globalThis.wallet) {
                                    throw new Error('羣公鑰不存在')
                                }
                                const sharedSecret = globalThis.wallet.signingKey.computeSharedSecret(Buffer.from(group.pub.substring(2), 'hex')).substring(4);
                                const groupPri = quickAes.De(encInfo.enc_pri, sharedSecret)
                                const groupKey = quickAes.De(encInfo.enc_key, sharedSecret);
                                const groupWallet = new ethers.Wallet(groupPri);
                                console.log('groupKey', groupKey)
                                const user = await userService.getInfo(item.uid);
                                if (!user) {
                                    throw new Error('用戶不存在')
                                }
                                const userSharedSecret = groupWallet.signingKey.computeSharedSecret(Buffer.from(user.pub_key.substring(2), 'hex')).substring(4);
                                const userGroupEncKey = quickAes.En(groupKey, userSharedSecret)
                                console.log('userGroupEncKey', userGroupEncKey)
                                console.log({
                                    id: item.gid,
                                    uid: item.uid,
                                    enc_key: userGroupEncKey,
                                })
                                await groupService.adminAgree({
                                    id: item.gid,
                                    uid: item.uid,
                                    enc_key: userGroupEncKey,
                                })
                                toast('成功通過')
                            } catch (e) {
                                console.log(e);
                            } finally {
                                setLoading(false);
                            }

                        }} labelStyle={{
                            fontSize: 16,
                            fontWeight: '700',
                        }} label="通過" />
                        <Button size="large" style={{
                            width: '100%',
                            height: verticalScale(50),
                            borderRadius: verticalScale(16),
                            marginTop: verticalScale(16),
                        }} outlineColor={colors.primary} backgroundColor="white" onPress={() => {
                            if (loading) {
                                return
                            };
                            setLoading(true);
                            groupService.rejectJoin(item?.gid ?? '', [item?.uid ?? '']).then(res => {
                                toast('已拒絕');
                                setTimeout(() => {
                                    setVisible(false);
                                }, 500)
                            }).finally(() => {
                                setLoading(false);
                            })
                            console.log('拒絕');
                        }} labelStyle={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: colors.primary,
                        }} label="拒絕" />
                    </> : null}
                </View>
            </View>
        </View>
    </Modal>
});
