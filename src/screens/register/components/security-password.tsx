import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { useEffect, useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import PasswordInput, { PasswordInputType } from "@/components/password-input";
export default (props: {
    onNext: () => void;
    onPrev: () => void;
    onChange: (val: string) => void;
    pageIndex: number;
    loading: boolean;
}) => {
    const [ready, setReady] = useState<boolean>(false);
    const passwordInputRef = useRef<PasswordInputType>();
    useEffect(() => {
        if (props.pageIndex === 1) {
            passwordInputRef.current?.init();
        }
    },[props.pageIndex]);
    return <View style={styles.container}>
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>輸入安全密碼</Text>
        </View>
        <View style={styles.wordContainer}>
            <PasswordInput ref={passwordInputRef} onChange={(v) => {
                props.onChange(v);
            }} onReady={(v) => setReady(v)} />
        </View>
        <View style={styles.tipsContainer}>
            <Text style={styles.tipsText}>請設置安全密碼，安全密碼將用於保護你的助詞</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button disabled={!ready || props.loading}
                size="large" style={styles.loginButton} 
                backgroundColor={colors.primary} 
                onPress={() => props.onNext()} 
                label="創建賬號" labelStyle={styles.loginButtonLabel}>
                {props.loading ? <ActivityIndicator color="white" /> : null}
            </Button>
            <Button size="large" style={styles.registerButton} backgroundColor="white" onPress={() => {
                props.onChange('');
                props.onPrev();
            }} label="上一步" labelStyle={styles.registerButtonLabel} />
        </View>
    </View>;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    placeholderContainer: {
        paddingHorizontal: scale(16),
    },
    placeholderText: {
        fontSize: scale(14),
        color: '#333',
        fontWeight: '400',
        paddingTop: verticalScale(26),
    },
    wordContainer: {
        paddingHorizontal: scale(16),
        marginTop: verticalScale(10),
    },
    tipsContainer: {
        width: '100%',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(20),
    },
    tipsText: {
        textAlign: 'center',
        color: '#FF4018',
        fontSize: scale(16),
        fontWeight: '400',
        lineHeight: scale(24),
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(321)
    },
    loginButton: {
        width: scale(327),
        height: scale(56),
        borderRadius: scale(16),
    },
    loginButtonLabel: {
        color: 'white',
        fontSize: scale(16),
        fontWeight: '700',
    },
    registerButton: {
        width: scale(327),
        height: scale(56),
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: scale(16),
        marginTop: verticalScale(21),
    },
    registerButtonLabel: {
        fontSize: scale(16),
        fontWeight: '700',
        color: colors.primary
    },
})