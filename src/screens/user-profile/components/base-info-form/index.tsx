import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import GenderOption from "./gender-option";
import AvatarUpload from "./avatar-upload";
import authService from "../../../../service/auth.service";
import UsernameInput from "./username-input";
import SignInput from "./sign-input";
import AddressInfo from "./address-info";
import colors from "../../../../config/colors";
import { Button } from "react-native-ui-lib";
import toast from "../../../../lib/toast";
import { GenderEnum } from "@/api/types/enums";
export interface FormData {
    avatar: string;
    gender: number;
    name: string;
}
export interface BaseInfoFormType {
    init: () => void;
}
export default forwardRef((_, ref) => {
    const [formData, setFormData] = useState({
        avatar: '',
        gender: GenderEnum.UNKNOWN,
        name: '',
        sign: ''
    });
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        init: () => {
            authService.info().then(res => {
                setFormData({
                    avatar: res.avatar,
                    gender: res.gender,
                    name: res.name,
                    sign: res.sign
                })
            })
        }
    }));
    useEffect(() => {
        setAddress((globalThis.wallet?.address ?? '').toLowerCase());
    })
    return <View>
        <View style={styles.contentContainer}>
            <AvatarUpload
                avatar={formData.avatar}
                onChange={(uri) => {
                    setFormData({
                        ...formData,
                        avatar: uri,
                    })
                }} />
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>昵称</Text>
                <UsernameInput value={formData.name} onChange={(v) => {
                    // v !== '' ? setReady(true) : setReady(false);
                    setFormData({
                        ...formData,
                        name: v,
                    });
                }} />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>性别</Text>
                <GenderOption onChange={(v) => {
                    setFormData({
                        ...formData,
                        gender: v,
                    });
                }} />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>个性签名</Text>
                <SignInput value={formData.sign} onChange={(v) => {
                    setFormData({
                        ...formData,
                        sign: v,
                    });
                }} />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>地址</Text>
                <AddressInfo value={address} />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(50),
            }}>
                <Button size="large" style={styles.nextButton} backgroundColor={colors.primary} onPress={async () => {
                    if (loading) {
                        return;
                    }
                    setLoading(true);
                    try { 
                        // TODO: 服务端待集成s3
                        await authService.updateAvatar(formData.avatar);
                
                        await authService.updateName(formData.name);
                        await authService.updateGender(formData.gender);
                        await authService.updateSign(formData.sign);
                        toast('更新成功!');
                    } catch (error) {
                        console.log(error);
                        toast("更新失败")
                    }finally{
                        setLoading(false);
                    }
                }} label="保存" labelStyle={styles.nextButtonLabel} />
            </View>
        </View>
    </View>;
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        paddingTop: verticalScale(30),
    },
    nextContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(186)
    },
    nextButton: {
        flex: 1,
        height: scale(50),
        borderRadius: scale(16),
    },
    nextButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
})