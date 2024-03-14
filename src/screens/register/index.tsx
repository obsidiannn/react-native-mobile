import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import PagerView from 'react-native-pager-view';
import { useRecoilState } from "recoil";
import { NowAccount } from "@/stores/app";
import SecurityPasswordComponent from "./components/security-password";
import BaseInfoForm, { RegisterFormData } from "./components/base-info-form";
import Navbar from "@/components/navbar";
import toast from "@/lib/toast";
import authService from "@/service/auth.service";
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        avatar: '',
        name: '',
        gender: 1,
    });
    const [password, setPassword] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(0);
    const pagerViewRef = useRef<PagerView>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [_, setNowAccount] = useRecoilState(NowAccount)
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Navbar title="创建账号" />
            </View>
            <PagerView onPageSelected={(e) => {
                setPageIndex(e.nativeEvent.position);
            }} ref={pagerViewRef} style={{ flex: 1 }} initialPage={0} scrollEnabled={false}>
                <ScrollView key="1" style={styles.pageItem} contentContainerStyle={{ paddingBottom: keyboardHeight }} keyboardShouldPersistTaps="handled">
                    <BaseInfoForm pageIndex={pageIndex} onChange={(v) => setFormData(v)} key="1" onNext={() => pagerViewRef.current?.setPage(1)} />
                </ScrollView>
                <ScrollView key="2" style={styles.pageItem} contentContainerStyle={{ paddingBottom: keyboardHeight }} keyboardShouldPersistTaps="handled">
                    <SecurityPasswordComponent
                        pageIndex={pageIndex}
                        loading={loading}
                        onPrev={() => pagerViewRef.current?.setPage(0)}
                        onChange={(v) => {
                            setPassword(v);
                        }} onNext={async () => {
                            if (loading) {
                                return;
                            }
                            setLoading(true);
                            const result = await authService.register(password);
                            if (!result) {
                                toast('注册失败，请重试');
                                setNowAccount(null);
                                setLoading(false);
                                return;
                            } else {
                                setNowAccount(result);
                            }
                            try {
                                await authService.updateName(formData.name);
                                await authService.updateGender(formData.gender);
                                await authService.updateAvatar(formData.avatar);
                            } catch (error) {
                                console.log(error);
                            }finally{
                                navigation.replace('AuthStackNav');
                                toast('注册成功');
                                setLoading(false);
                            }
                        }}
                    />
                </ScrollView>
            </PagerView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
    },
    pageItem: {
        flex: 1,
    }
})