import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import toast from "@/lib/toast";
import groupService from "@/service/group.service";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {  scale, verticalScale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
export interface ApplyJoinModalRef {
    open: (gid: string) => void;
}
export default forwardRef<ApplyJoinModalRef>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [state, setState] = useState(false)
    const [remark, setRemark] = useState('');
    const [gid, setGid] = useState<string>('');
    useImperativeHandle(ref, () => ({
        open: (v: string) => {
            setGid(v);
            setVisible(true);
        }
    }));
    return <Modal animationType="slide" visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar backgroundColor='white' title="申請加入" onLeftPress={() => setVisible(false)} />

            <ScrollView style={styles.contentContainer} keyboardDismissMode="interactive">
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="請輸入備註"
                        onChangeText={text => setRemark(text)}
                        defaultValue={remark}
                        multiline={true}
                        numberOfLines={5}
                        maxLength={120}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button disabled={state} size="large"
                        labelStyle={styles.buttonLabel}
                        style={styles.button} backgroundColor={colors.primary} onPress={async () => {
                            if (state) {
                                return;
                            }
                            setState(true);
                            try {
                                await groupService.join(gid);
                                toast('發送申請成功');
                                setTimeout(() => {
                                    setVisible(false);
                                }, 500)
                            } catch (error) {
                                console.log(error);
                            } finally {
                                setState(false);
                            }
                        }} label='發送申請' />
                </View>
            </ScrollView>
        </View>
    </Modal>
});
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    inputContainer: {
        flex: 1,
        padding: scale(15),
        borderColor: '#F4F4F4',
        borderWidth: 1,
        backgroundColor: '#F8F8F8',
        marginHorizontal: scale(15),
        borderRadius: scale(16),
        marginTop: verticalScale(20),
    },
    input: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
        height: verticalScale(82),
    },
    buttonContainer: {
        paddingHorizontal: scale(23),
        marginTop: verticalScale(20),
    },
    button: {
        width: '100%',
        height: verticalScale(50),
        borderRadius: verticalScale(16)
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '700',
    }
});