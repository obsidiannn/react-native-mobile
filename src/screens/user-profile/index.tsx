import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/navbar";
import { useEffect, useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { StackScreenProps } from "@react-navigation/stack";
import BaseInfoForm, { BaseInfoFormType } from "./components/base-info-form";
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'UserProfile'>;
const UserProfileScreen = ({ navigation }: Props) => {
    const insets = useSafeAreaInsets();
    const baseInfoFormRef = useRef<BaseInfoFormType>()
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
        const focusEvent = navigation.addListener('focus', async () => {
            baseInfoFormRef.current?.init()
        });
        const keyboardDidShowEvent = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardDidHideEvent = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => {
            focusEvent();
            keyboardDidShowEvent.remove();
            keyboardDidHideEvent.remove();
        }
    }, []);
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="個人資料" />
            </View>
            <ScrollView style={{
                width: '100%',
                flex: 1,
                paddingHorizontal: scale(15),
                paddingTop: verticalScale(5),
            }} keyboardDismissMode="interactive">
                <BaseInfoForm ref={baseInfoFormRef} />
                <View style={{width:scale(1),height: keyboardHeight}}></View>
            </ScrollView>
        </View>
    );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});