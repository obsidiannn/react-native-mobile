import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import { useEffect, useRef, useState } from "react";
import { scale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import { Switch } from "react-native-ui-lib";
import ConfirmModal, { ConfirmModalType } from "@/components/confirm-modal";
import colors from "@/config/colors";
import messageService from "@/service/message.service";
import toast from "@/lib/toast";
import InfoCard from "./components/info-card";
import ActionItem from "./components/action-item";

type Props = StackScreenProps<RootStackParamList, 'UserChatInfo'>;

const UserChatInfoScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [params, setParams] = useState<{
        uid: string;
        name: string;
        avatar: any;
        disturb: boolean;
        top: boolean;
        chatId: string;
    }>({
        uid: '',
        name: '',
        avatar: '',
        disturb: false,
        top: false,
        chatId: '',
    });
    const confirmModalRef = useRef<ConfirmModalType>(null);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setParams(route.params);
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
                <Navbar title="聊天詳情" />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                marginTop: scale(20),
            }}>
                <InfoCard avatar={params?.avatar ?? ''} name={params?.name ?? ''} />
                <View style={{
                    marginTop: scale(15),
                }}>
                    <ActionItem title="消息免打擾" rightComponent={<Switch height={scale(24)} onColor={colors.primary} value={params?.disturb} onValueChange={(v) => {
                        setParams({
                            ...params,
                            disturb: v,
                        });
                    }} />} />
                </View>
                <View style={{
                    marginTop: scale(15),
                }}>
                    <ActionItem title="置頂聊天" rightComponent={<Switch height={scale(24)} onColor={colors.primary} value={params?.top} onValueChange={(v) => {
                        setParams({
                            ...params,
                            top: v,
                        });
                    }} />} />
                </View>
                <View style={{
                    marginTop: scale(15),
                }}>
                    <ActionItem onPress={() => {
                        confirmModalRef.current?.open({
                            title: '清空聊天記錄',
                            desc: '將清空與該好友的聊天記錄，且無法恢復',
                            onSubmit: () => {
                                messageService.clearAll([params?.chatId ?? '']);
                                toast('清空成功');
                            }
                        })
                    }} title="清空聊天記錄" textColor="#FB3737" rightComponent={<Image source={require('@/assets/icons/arrow-right-gray.svg')} style={{
                        width: scale(20),
                        height: scale(20),
                    }} />} />
                </View>
            </View>
            <ConfirmModal ref={confirmModalRef} />
        </View>
    );
};

export default UserChatInfoScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});