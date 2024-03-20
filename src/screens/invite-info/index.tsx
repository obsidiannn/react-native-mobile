import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "react-native-ui-lib";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import friendApi from "@/api/v2/friend";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import Remark from "./components/remark";
import UserInfo from "./components/user-info";
import { Image } from "@/components/image";
import friendService from "@/service/friend.service";
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'InviteInfo'>;

const InviteInfoScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [remark, setRemark] = useState<string>('');
    const [info, setInfo] = useState<{
        id: string;
        uid: string;
        avatar: string;
        name: string;
        remark: string;
        status: number;
        isSelf: boolean;
    }>({
        id: '',
        uid: '',
        avatar: '',
        name: '',
        status: 1,
        isSelf: false,
        remark: '',
    });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const authUid = globalThis.wallet?.address??''
            const isSelf = authUid === route.params.obj_uid
            setInfo({
                id: route.params.id,
                uid: isSelf? route.params.obj_uid:route.params.uid,
                avatar: route.params.avatar,
                name: route.params.name,
                status: route.params.status,
                remark: route.params.remark,
                isSelf: isSelf
            })
        });
        return unsubscribe;
    }, [navigation])
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="验证信息" />
            </View>
            <ScrollView keyboardDismissMode="interactive">
                <View style={styles.infoContainer}>
                    <UserInfo avatar={info.avatar} name={info.name} address={info.uid} />
                    <Remark content={info.remark} />
                    {info.status === 1 && !info.isSelf ? <View style={{
                        height: verticalScale(50),
                        borderRadius: verticalScale(25),
                        backgroundColor: '#F8F8F8',
                        borderWidth:1,
                        borderColor:'#F4F4F4',
                        display: 'flex',
                        flexDirection: 'row',
                        paddingHorizontal: scale(15),
                        marginTop: verticalScale(20),
                    }}>
                        <TextInput value={remark} onChangeText={(v) => setRemark(v)} placeholder="输入备注" style={{
                            flex: 1
                        }}/>
                        <Image source={require('@/assets/icons/edit.svg')} style={{
                            width: verticalScale(20),
                            height: verticalScale(20),
                            marginLeft: scale(15),
                            marginTop: verticalScale(15),
                        }} />
                    </View> : null}
                </View>
                <View style={styles.actionContainer}>
                    {info.status === 1 && !info.isSelf ? <>
                        <Button size="large" style={styles.accpetButton} backgroundColor={colors.primary} onPress={() => {
                            if (loading) {
                                return
                            };
                            setLoading(true);
                            friendApi.inviteAgree({id: info.id,alias: info.name}).then(() => {
                                navigation.goBack();
                            }).finally(() => {
                                setLoading(false);
                            });
                        }} labelStyle={styles.label} label="通过" />
                        <Button size="large" style={styles.rejectButton} outlineColor={colors.primary} backgroundColor="white" onPress={async () => {
                            if (loading) {
                                return
                            };
                            setLoading(true);
                            await friendApi.inviteReject({id: info.id,reason: ''});
                            try {
                                await friendService.updateRemark(info.uid, remark);
                            } catch (error) {
                                console.log(error);
                            }finally{
                                navigation.goBack();
                                setLoading(false);
                            }
                        }} labelStyle={{
                            ...styles.label,
                            color: colors.primary,
                        }} label="拒绝" />
                    </> : null}
                    {info.status === 1 && info.isSelf ? <Button disabled={true} size="large" style={styles.waitButton} backgroundColor={colors.primary} label="等待验证" /> : null}
                </View>
            </ScrollView>
        </View>
    );
};

export default InviteInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    infoContainer: {
        paddingHorizontal: scale(15),
        paddingTop: verticalScale(21)
    },
    actionContainer: {
        paddingHorizontal: scale(23),
        marginTop: verticalScale(100),
    },
    accpetButton: {
        width: '100%',
        height: verticalScale(50),
        borderRadius: verticalScale(16),
        marginTop: verticalScale(30),
    },
    rejectButton: {
        width: '100%',
        height: verticalScale(50),
        borderRadius: verticalScale(16),
        marginTop: verticalScale(16),
    },
    waitButton: {
        width: '100%',
        height: verticalScale(50),
        borderRadius: verticalScale(16),
        marginTop: verticalScale(30),
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    }
});