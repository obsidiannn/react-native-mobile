import { StyleSheet, Text, View, Modal, ActivityIndicator } from "react-native";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Navbar from "../navbar";
import { Button } from "react-native-ui-lib";
import colors from "@/config/colors";
import PasswordInput, { PasswordInputType } from "@/components/password-input";
import utils from "@/lib/utils";

export interface PayConfirmModalType {
    open: (params: {
        title: string;
        amount: number;
        onNext: (val: string) => Promise<void>;
        onChange: (val: string) => void;
    }) => void;
}

export default forwardRef((_, ref) => {
    const [ready, setReady] = useState<boolean>(false);
    const [pwd,setPwd] = useState('')
    const passwordInputRef = useRef<PasswordInputType>(null);
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState<number>(0)
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const onNextRef = useRef<(val: string) => Promise<void>>();
    const onChangeRef = useRef<(val: string) => void>();

    useImperativeHandle(ref, () => ({
        open: (params: {
            title: string
            amount: number
            onNext: (val: string) => Promise<void>
            onChange: (val: string) => void
        }) => {
            setTitle(params.title);
            setAmount(params.amount)
            setPwd('')
            onNextRef.current = params.onNext
            onChangeRef.current = params.onChange
            setVisible(true);
        }
    }));

    useEffect(() => {
        setTimeout(() => {
            passwordInputRef?.current?.init();
        }, 600)
    }, [])
    return <Modal animationType="slide" transparent={true} visible={visible} style={{
        flex: 1, backgroundColor: 'white'
    }}>
        <View style={styles.container}>
            <Navbar title={title} onLeftPress={() => {
                setVisible(false);
            }} />
            <View style={{ display: 'flex', flexDirection: 'column', padding: scale(24) }}>
                <View style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', marginTop: scale(36),
                    padding: scale(36), borderBottomColor: colors.gray100, borderBottomWidth: scale(1)
                }}>
                    <Text style={{ fontSize: scale(16), color: colors.gray950, fontWeight: '400' }}>支付金額</Text>
                    <Text style={{ fontSize: scale(36), color: 'black', fontWeight: '500', marginTop: scale(12) }}>$ {Number(amount).toFixed(2)}</Text>
                </View>
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>請輸入安全密碼</Text>
                </View>
                <View style={styles.wordContainer}>
                    <PasswordInput ref={passwordInputRef} onReady={(v) => setReady(v)} onChange={(v) => {
                        onChangeRef.current?.(v)
                        setPwd(v)
                    }} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button disabled={!ready} size="large" style={styles.unlockButton}
                        backgroundColor={colors.primary}
                        onPress={async () => {
                            setLoading(true)
                            await onNextRef.current?.(pwd)
                            setLoading(false)
                            setVisible(false);
                        }} label="確認支付" labelStyle={styles.unlockButtonLabel} >
                        {loading ? <ActivityIndicator color="white" style={{marginRight: scale(2)}} /> : null}
                    </Button>
                </View>
            </View>

        </View>
    </Modal>
})

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    placeholderContainer: {
        paddingHorizontal: scale(8),
        paddingTop: verticalScale(24),
        paddingBottom: verticalScale(24),

    },
    placeholderText: {
        fontSize: scale(14),
        color: colors.gray600,
        fontWeight: '400',
    },
    wordContainer: {
        marginTop: verticalScale(10),
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(72)
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