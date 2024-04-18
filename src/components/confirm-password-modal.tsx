import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import PasswordInput from "./password-input";
export interface ConfirmPasswordOption {
    title: string;
    desc: string;
    onSubmit?: (v: string) => void;
    onCancel?: () => void;
}
export interface ConfirmPasswordModalType {
    open: (option: ConfirmPasswordOption) => void;
}
export default forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [option, setOption] = useState<ConfirmPasswordOption>({
        title: '',
        desc: '',
    });
    useImperativeHandle(ref, () => ({
        open: async (v: ConfirmPasswordOption) => {
            setPassword('');
            setOption(v);
            setVisible(true);
        }
    }));
    return <Modal animationType="fade" transparent={true} visible={visible} style={{
        flex: 1,
    }}>
        <View style={{
            flex: 1,
            backgroundColor: '#00000066',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scale(15),
            flexDirection: 'row',
        }}>
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                paddingTop: verticalScale(34),
                borderRadius: scale(15),
            }}>
                <View style={{
                    paddingHorizontal: scale(18),
                }}>
                    <Text style={{
                        fontSize: scale(16),
                        fontWeight: '500',
                        textAlign: 'center',
                    }}>{option.title}</Text>
                    <Text style={{
                        color: '#666',
                        fontSize: scale(16),
                        fontWeight: '500',
                        marginBottom: verticalScale(15),
                        marginTop: verticalScale(25),
                    }}>輸入安全密碼</Text>
                    <PasswordInput onChange={(v) => setPassword(v)} />
                    <Text style={{
                        color: '#FF4018',
                        fontSize: scale(14),
                        marginTop: verticalScale(15),
                        marginBottom: verticalScale(30),
                        fontWeight: '400',
                    }}>{option.desc}</Text>
                </View>
                <View style={{
                    borderTopColor: '#F4F4F4',
                    borderTopWidth: verticalScale(1),
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity onPress={() => {
                        if (password.length < 6) {
                            return
                        }
                        setVisible(false)
                        option.onSubmit && option.onSubmit(password)
                    }} style={{
                        width: scale(171),
                        height: verticalScale(66),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{
                            color: password.length < 6 ? '#999999' : 'black',
                            fontSize: scale(16),
                            fontWeight: '500',
                        }}>確認</Text>
                    </TouchableOpacity>
                    <View style={{
                        width: scale(1),
                        height: '100%',
                        backgroundColor: '#F4F4F4',
                    }}></View>
                    <TouchableOpacity onPress={() => {
                        setVisible(false)
                        option.onCancel && option.onCancel()
                    }} style={{
                        width: scale(171),
                        height: verticalScale(66),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{
                            color: '#D90000',
                            fontSize: scale(16),
                            fontWeight: '500',
                        }}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
});
