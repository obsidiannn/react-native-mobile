import { StyleSheet, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { RootStackParamList } from "@/types";
import { scale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import { Button } from "react-native-ui-lib";
import colors from "@/config/colors";
import { GroupInfoItem } from "@/api/types/group";
import groupService from "@/service/group.service";
import toast from "@/lib/toast";
import ApplyJoinModal, { ApplyJoinModalRef } from "./components/apply-join-modal";
type Props = StackScreenProps<RootStackParamList, 'GroupInfo'>;

const GroupInfoScreen = ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [group, setGroup] = useState<GroupInfoItem | null>(null);
    const [inJoin, setInJoin] = useState(false);
    const applyJoinModalRef = useRef<ApplyJoinModalRef>(null);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const gid = route.params?.gid;
            if (!gid) {
                toast('羣聊不存在');
                setTimeout(() => {
                    navigation.goBack();
                }, 1000)
                return;
            }
            groupService.getInfo(gid).then(res => {
                setGroup(res);
                const authUid = globalThis.wallet?.address.toLowerCase();
                groupService.getMembers(gid).then(x => {
                    console.log(x);
                    setInJoin(x.some(item => item.uid === authUid));
                });
            })
        });
        return unsubscribe;
    }, [navigation])
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            backgroundColor: '#F4F4F4',
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar backgroundColor="#F4F4F4" title="羣聊詳情" />
            </View>
            <View style={{
                paddingHorizontal: scale(15),
                paddingTop: scale(20)
            }}>
                <View style={{
                    padding: scale(15),
                    backgroundColor: '#ffffff',
                    // 生成陰影
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
                    borderRadius: scale(15),
                    borderWidth: 1,
                    borderColor: '#EFF0F1',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image style={{
                            width: scale(50),
                            height: scale(50),
                            borderRadius: scale(25),
                            borderWidth: 1,
                            borderColor: '#EAEDEF',
                            marginRight: scale(15),
                        }} source={group?.avatar} />
                        <View>
                            <Text style={{
                                fontSize: scale(16),
                                fontWeight: '400',
                                color: '#333333',
                            }}>{group?.name}</Text>
                            <Text style={{
                                fontSize: scale(13),
                                fontWeight: '400',
                                color: '#999999',
                            }}>{group?.member_total ?? 0}人已加入</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: scale(13),
                            fontWeight: '400',
                            color: '#999999',
                            marginTop: scale(10),
                        }}>{group?.desc ?? '(空)'}</Text>
                    </View>
                    <Button onPress={() => {
                        if(inJoin){
                            navigation.navigate('GroupChat', {
                                chatId: group?.id,
                            });
                        }else{
                            applyJoinModalRef.current?.open(group?.id ?? '');
                        }
                    }} style={{
                        marginTop: scale(40),
                        height: scale(50),
                        borderRadius: scale(15),
                    }} backgroundColor={colors.primary} label={inJoin ? "進入羣聊" : "申請加入"} />
                </View>
            </View>
            <ApplyJoinModal ref={applyJoinModalRef} />
        </View>
    );
};

export default GroupInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});