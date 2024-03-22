import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useRef } from "react";
import Navbar from "../../components/navbar";
import ConfirmModal, { ConfirmModalType } from "../../components/confirm-modal";
import ConfirmPasswordModal, { ConfirmPasswordModalType } from "../../components/confirm-password-modal";
import { scale, verticalScale } from "react-native-size-matters/extend";

import ToolItem from "./components/tool-item";
import { clearAccountDataList, readMN } from "../../lib/account";
import groupService from "../../service/group.service";
import messageService from "../../service/message.service";
import RNRestart from 'react-native-restart';
import { navigate } from "@/lib/root-navigation";
const SecurityScreen = () => {
    const insets = useSafeAreaInsets();
    const confirmModalRef = useRef<ConfirmModalType>();
    const confirmPasswordModalRef = useRef<ConfirmPasswordModalType>();
    const handleReset = useCallback(() => {
        clearAccountDataList();
        RNRestart.Restart();
    }, []);
    const options = [
        {
            icon: require('../../assets/icons/disk.svg'),
            title: '备份助记词',
            onPress: () => {
                confirmPasswordModalRef.current?.open({
                    title: '备份助记词',
                    desc: '请谨慎操作！',
                    onSubmit: (password: string) => {
                        readMN(password).then((mn) => {
                            navigate('BackupMnemonic', { mnemonic:mn })
                        }).catch((e) => {
                        });
                    }
                })
            }
        },
        {
            icon: require('../../assets/icons/logout.svg'),
            title: '退出所有群聊',
            onPress: () => {
                confirmModalRef.current?.open({
                    title: '清空所有消息',
                    desc: '清空所有消息后，将无法恢复',
                    onSubmit: () => {
                        groupService.quitAll();
                    }
                })
            }
        },
        {
            icon: require('../../assets/icons/destory.svg'),
            title: '清空所有消息',
            onPress: () => {
                confirmModalRef.current?.open({
                    title: '清空所有消息',
                    desc: '清空所有消息后，将无法恢复',
                    onSubmit: () => {
                        messageService.clearAll();
                    }
                })
            }
        },
        {
            icon: require('../../assets/icons/userdel.svg'),
            title: '删除所有好友',
            onPress: () => {
                confirmModalRef.current?.open({
                    title: '删除所有好友',
                    desc: '删除所有好友后，将无法恢复'
                })
            }
        },
        {
            icon: require('../../assets/icons/reset.svg'),
            title: '重置应用',
            onPress: () => {
                confirmModalRef.current?.open({
                    title: '重置应用',
                    desc: '将清除应用所有数据',
                    onSubmit: () => {
                        handleReset();
                    }
                })
            }
        }
    ]
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="安全" />
            </View>
            <ScrollView style={{
                width: '100%',
                paddingHorizontal: scale(20),
                paddingTop: verticalScale(5)
            }}>
                {options.map((option, index) => <ToolItem item={option} key={index} />)}
            </ScrollView>
            <ConfirmModal ref={confirmModalRef} />
            <ConfirmPasswordModal ref={confirmPasswordModalRef} />
        </View>
    );
};

export default SecurityScreen;