import { Image } from "@/components/image";
import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import toast from "@/lib/toast";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
export interface UpdateRemarkModalType {
    open: (uid: string, remark: string) => void;
}
export default forwardRef((_, ref) => {
    const [uid, setUid] = useState("");
    const [remark, setRemark] = useState('');
    const [visible, setVisible] = useState(true);
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        open: async (uid: string, remark: string) => {
            setUid(uid);
            setRemark(remark);
            setVisible(true);
        }
    }));
    return <Modal visible={visible} animationType="slide" style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <Navbar onLeftPress={() => setVisible(false)} title="設置備註" />
            <ScrollView keyboardDismissMode="interactive" style={{
                paddingHorizontal: scale(25),
                paddingTop: scale(20),
            }}>
                <View style={{
                    height: scale(42),
                    borderRadius: scale(21),
                    borderWidth: 1,
                    borderColor: '#F4F4F4',
                    backgroundColor: '#F8F8F8',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: scale(15),
                }}>
                    <TextInput placeholder="設置備註" style={{
                        flex: 1,
                        fontSize: scale(14),
                        fontWeight:'400'
                    }} placeholderTextColor="#ABABB2" value={remark} onChangeText={(v) => {
                        setRemark(v);
                    }} />
                    <Image source={require('@/assets/icons/edit.svg')} style={{
                        width: scale(24),
                        height: scale(24),
                    }} />
                </View>
                <Button size="large" style={styles.button} backgroundColor={colors.primary} onPress={async () => {
                    if (loading) {
                        return;
                    }
                    setLoading(true);
                    try {
                        toast('更新成功!');
                    } catch (error) {
                        toast('更新失敗!');
                    }finally{
                        setLoading(false);
                        setTimeout(() => {
                            setVisible(false);
                        },1000);
                    }
                }} label="保存" labelStyle={styles.buttonLabel} />
            </ScrollView>
        </View>
    </Modal>
});

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: scale(50),
        borderRadius: scale(16),
        marginTop: scale(168)
    },
    buttonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});