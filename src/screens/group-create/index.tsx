import { ActivityIndicator, StyleSheet, Text, TextInput } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { RootStackParamList } from "@/types";
import { scale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import { View, Button, RadioGroup, RadioButton, Switch } from "react-native-ui-lib";
import colors from "@/config/colors";

import groupService from "@/service/group.service";
import toast from "@/lib/toast";
import Icon from "react-native-vector-icons/AntDesign";
import utils from "@/lib/utils";
import AvatarUpload from "../user-profile/components/base-info-form/avatar-upload";
import SelectMemberModal from "@/components/select-member-modal";
import fileService from "@/service/file.service";
import LoadingModal, { ILoadingModalRef } from "@/components/common/loading-modal";

type Props = StackScreenProps<RootStackParamList, 'GroupCreate'>;


interface GroupCreateType {
    name: string
    avatar: string
    searchType: string
    isEnc: boolean
}
const GroupCreateScreen = (props: Props) => {
    const insets = useSafeAreaInsets();
    const [loading,setLoading] = useState(true)
    const loadingModalRef = useRef<ILoadingModalRef>();
    const [createState, setCreateState] = useState<GroupCreateType>({
        name: '',
        avatar: '',
        searchType: '0',
        isEnc: true
    })
   
    const doGroupCreate = async () => {
        if (!utils.isNotBlank(createState.name)) {
            toast('請填寫羣組名稱')
            return 
        }
        let imgUrl = createState.avatar

        loadingModalRef.current?.open()

        if (utils.isNotBlank(imgUrl)) {
            const url = await fileService.uploadImage(imgUrl)
            if (utils.isBlank(url)) {
                toast('圖片上傳失敗')
                return
            }
            imgUrl = url??''
        }
        const group = await groupService.create(createState.name, imgUrl, createState.isEnc, createState.searchType)
        const ops = props.route.params.selected
        if (ops.length > 0) {
            await groupService.invite(group.id, ops, group);
        }
        loadingModalRef.current?.close()
        props.navigation.goBack()
        
    }

    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            backgroundColor: '#F4F4F4',
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar backgroundColor="#F4F4F4" title="創建羣聊" />
            </View>
            <View style={{
                paddingHorizontal: scale(15),
                paddingTop: scale(20),
            }}>
                 {loading ? <ActivityIndicator color="white" animating={loading} /> : null}
                <View style={{
                    ...styles.sub_area,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: scale(24),
                    paddingBottom: scale(24)

                }}>
                    <View>
                        {/* <View style={{
                            borderColor: colors.gray300,
                            borderRadius: 50,
                            borderWidth: scale(1),
                            borderStyle: 'dashed',
                            padding: scale(6)
                        }}>
                            <Icon name='plus' size={scale(16)} style={{ color: colors.gray300 }}></Icon>
                        </View> */}
                        <AvatarUpload
                            avatar={createState.avatar}
                            onChange={(uri) => {
                                setCreateState({
                                    ...createState,
                                    avatar: uri,
                                })
                            }} />
                    </View>
                    <Text style={{ padding: scale(4), fontSize: scale(12) }}>上傳封面</Text>
                </View>

                <View style={{
                    ...styles.sub_area,
                    marginTop: scale(18),
                    display: 'flex', flexDirection: 'column'

                }}>
                    <View>

                        <TextInput
                            placeholder="羣聊名稱"
                            placeholderTextColor={colors.gray600}
                            maxLength={128}
                            style={{
                                ...styles.input
                            }}
                            value={createState?.name}
                            onChangeText={text => {
                                setCreateState({
                                    ...createState,
                                    name: text
                                })
                            }}
                        />
                    </View>
                    <View style={{ marginTop: scale(8) }}>
                        <RadioGroup initialValue="0" onValueChange={(value: string) => {
                            setCreateState({
                                ...createState,
                                searchType: value
                            })
                        }}>
                            <View row style={{ padding: scale(14) }} >
                                <RadioButton color={colors.gray600} value='0' label="公開"
                                    labelStyle={{ marginRight: scale(28) }} />
                                <RadioButton color={colors.gray600} value='1' label="私密" />
                            </View>
                        </RadioGroup>
                    </View>
                    <View style={{
                        display: 'flex', flexDirection: 'row', padding: scale(8),
                        justifyContent: 'space-between', alignItems: 'center', marginTop: scale(28)
                    }}>
                        <View>
                            <Text style={{ fontSize: scale(14), color: colors.gray600 }}>加密（不可更改）</Text>
                            <Text style={{ color: colors.gray400, fontSize: scale(12) }}>不加密，用戶將直接可以加入羣聊</Text>
                        </View>
                        <View style={{ marginLeft: scale(8) }}>
                            <Switch value={createState.isEnc}
                                onColor={colors.gray600}
                                onValueChange={(e) => {
                                    setCreateState({
                                        ...createState,
                                        isEnc: e
                                    })
                                }} />
                        </View>
                    </View>

                </View>
                <Button onPress={doGroupCreate} style={{
                    marginTop: scale(40),
                    height: scale(50),
                    borderRadius: scale(15),
                }} backgroundColor={colors.primary} label="創建羣聊" />
                <LoadingModal ref={loadingModalRef} />
            </View>
        </View>
    );
};

export default GroupCreateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    sub_area: {
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


    },
    input: {
        fontSize: scale(14),
        backgroundColor: colors.gray100,
        borderRadius: scale(12),
        paddingLeft: scale(14)
    }
}
);