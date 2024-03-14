import { Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Button } from "react-native-ui-lib";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import friendApi from "@/api/v2/friend";
import * as clipboard from 'expo-clipboard';
import { scale, verticalScale } from "react-native-size-matters/extend";
import { TouchableOpacity } from "react-native-gesture-handler";
import toast from "@/lib/toast";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'InviteInfo'>;

const InviteInfoScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<{
        id: string;
        uid: string;
        avatar: string;
        name: string;
        remark: string;
        status: number;
        isSelf: boolean;
    }>({
        id: 'xxx',
        uid: 'xxx',
        avatar: 'https://img1.baidu.com/it/u=3709586903,1286591012&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        name: 'xxx',
        status: 1,
        isSelf: false,
        remark: '',
    });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // const authUid = globalThis.wallet?.address.toLowerCase() || '';
            // setInfo({
            //     id: route.params.id,
            //     uid: authUid === route.params.uid ? route.params.obj_uid : route.params.uid,
            //     avatar: route.params.avatar,
            //     name: route.params.name,
            //     status: route.params.status,
            //     remark: route.params.remark,
            //     isSelf: authUid === route.params.uid,
            // })
            //
            //const { status } = route.params;
        });
        return unsubscribe;
    }, [navigation])
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="验证信息" />
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
                        }} source={{ uri: info.avatar }} />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>xxx</Text>
                            <TouchableOpacity onPress={async () => {
                                await clipboard.setStringAsync(info.uid);
                                toast('复制成功');
                            }} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400' }}>xxx</Text>
                                <Image style={{
                                    width: verticalScale(20),
                                    height: verticalScale(20),
                                }} source={require('../assets/icons/copy.svg')} />
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
                        }}>备注</Text>
                    </View>
                </View>
                <View style={{
                    paddingHorizontal: scale(23),
                }}>
                    {info.status === 1 && !info.isSelf ? <>
                        <Button size="large" style={{
                            width: '100%',
                            height: verticalScale(50),
                            borderRadius: verticalScale(16),
                            marginTop: verticalScale(30),
                        }} backgroundColor={colors.primary} onPress={() => {
                            if (loading) {
                                return
                            };
                            setLoading(true);
                            friendApi.inviteAgree({id: info.id,alias: info.name}).then(() => {
                                navigation.goBack();
                            }).finally(() => {
                                setLoading(false);
                            });
                        }} labelStyle={{
                            fontSize: 16,
                            fontWeight: '700',
                        }} label="通过" />
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
                            friendApi.inviteReject({id: info.id,reason: ''}).then(() => {
                                navigation.goBack();
                            }).finally(() => {
                                setLoading(false);
                            });
                        }} labelStyle={{ 
                            fontSize: 16,
                            fontWeight: '700',
                            color: colors.primary,
                         }} label="拒绝" />
                    </> : null}
                    {info.status === 1 && info.isSelf ? <Button disabled={true} size="large" style={{
                         width: '100%',
                         height: verticalScale(50),
                         borderRadius: verticalScale(16),
                         marginTop: verticalScale(30),
                     }} backgroundColor={colors.primary} label="等待验证" /> : null}
                </View>
            </View>
        </View>
    );
};

export default InviteInfoScreen;