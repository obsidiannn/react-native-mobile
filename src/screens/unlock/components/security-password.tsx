import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { useEffect, useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import PasswordInput, { PasswordInputType } from "@/components/password-input";
export default (props: {
    onNext: () => void;
    onChange: (val: string) => void;
}) => {
    const [ready, setReady] = useState<boolean>(true);
    const passwordInputRef = useRef<PasswordInputType>(null);
    useEffect(() => {
        setTimeout(() => {
            passwordInputRef?.current?.init();
        }, 600)
    }, [])
    return <View style={styles.container}>
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>輸入安全密碼</Text>
        </View>
        <View style={styles.wordContainer}>
            <PasswordInput ref={passwordInputRef} onReady={(v) => setReady(v)} onChange={(v) => {
                props.onChange(v);
            }} />
        </View>
        <View style={styles.buttonContainer}>
            <Button disabled={!ready} size="large" style={styles.unlockButton} backgroundColor={colors.primary} onPress={() => props.onNext()} label="確認解鎖" labelStyle={styles.unlockButtonLabel} />
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
        paddingTop: verticalScale(62),
    },
    wordContainer: {
        marginTop: verticalScale(10),
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(321)
    },
    unlockButton: {
        width: scale(327),
        height: scale(56),
        borderRadius: scale(16),
    },
    unlockButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
})