import { StyleSheet, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import { RelationListItem } from "@/api/types/friend";
import { useEffect, useRef, useState } from "react";
import { scale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import { Button, Switch } from "react-native-ui-lib";
import colors from "@/config/colors";
import ConfirmModal, { ConfirmModalType } from "@/components/confirm-modal";

type Props = StackScreenProps<RootStackParamList, 'UserSetting'>;

const UserChatInfoScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState<RelationListItem>();
    const [blacklisted, setBlacklisted] = useState(false);
    const confirmModalRef = useRef<ConfirmModalType>(null);
    useEffect(() => {
        setUser({
            uid: 'xxx',
            avatar: 'https://img1.baidu.com/it/u=3709586903,1286591012&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            name: 'xxxxxx',
            remark: '',
            isFriend: 0,
            sign: '',
            gender: 0,
        })
        const unsubscribe = navigation.addListener('focus', () => {
            // 拉取用戶信息
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
                paddingTop: scale(20),
            }}>
                
                <View style={{
                    height: scale(50),
                    borderRadius: scale(14),
                    paddingHorizontal: scale(15),
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#F4F4F4',
                    backgroundColor: '#F8F8F8',
                    marginTop: scale(15),
                }}>
                    <Text style={{
                        flex: 1,
                        fontSize: scale(15),
                        color: '#000',
                        fontWeight: '400',
                    }}>加入黑名單</Text>
                    <Switch height={scale(24)} onColor={colors.primary} value={blacklisted} onValueChange={(v) => setBlacklisted(v)}/>
                </View>
                <View style={{
                    marginTop: scale(168),
                }}>
                    <Button outlineColor="#FB3737" borderRadius={scale(12)} backgroundColor="white" labelStyle={{
                        color: "#FB3737"
                    }} label="刪除好友" onPress={() => {
                        confirmModalRef.current?.open({
                            title: '刪除好友',
                            desc: '刪除好友後，將清空與該好友的聊天記錄，且無法恢復',
                            onSubmit: () => {
                            }
                        })
                    }}/>
                </View>
            </View>
            <ConfirmModal ref={confirmModalRef}/>
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