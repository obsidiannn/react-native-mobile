import { PermissionsAndroid, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import QRCode from 'react-native-qrcode-svg';
import { Button } from "react-native-ui-lib";
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import toast from "@/lib/toast";
import Navbar from "@/components/navbar";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntIcon from 'react-native-vector-icons/AntDesign'
import * as clipboard from 'expo-clipboard'

type Props = StackScreenProps<RootStackParamList, 'WalletQrcode'>;
// 收款
const UserCardScreen = ({ }: Props) => {
    const insets = useSafeAreaInsets();
    const viewRef = useRef<ViewShot>(null);
    const [address, setAddress] = useState<string>('');
    const [data, setData] = useState<string>('');
    useEffect(() => {
        (async () => {
            const address = await globalThis.wallet?.address.toLowerCase() ?? '';
            setAddress(address);
            setData('uid=' + address);
        })();
    }, []);
    const getCheckPermissionPromise = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                return Promise.all([
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
                    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
                ]).then(
                    ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
                        hasReadMediaImagesPermission && hasReadMediaVideoPermission,
                );
            } else {
                return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            }
        }
        return true;
    };
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="freeChat收款" />
            </View>

            <ViewShot ref={viewRef} style={styles.viewContainer}>
                <View style={styles.contentContainer}>
                    {data ? <QRCode
                        size={280}
                        value={data}
                    /> : null}
                    <View style={styles.line}></View>
                    <Text style={styles.tips}>「 掃描二維碼向我付款 」</Text>
                </View>
            </ViewShot>
            <View style={styles.buttonContainer}>
                <Button size="large" style={styles.button} backgroundColor={colors.primary} onPress={async () => {
                    if (viewRef.current == null) {
                        return;
                    }
                    try {
                        const permission = await getCheckPermissionPromise();
                        if (!permission) {
                            toast('請先允許訪問相冊');
                            return;
                        }
                        const uri = await captureRef(viewRef.current, {
                            format: "png",
                            quality: 0.8,
                            handleGLSurfaceViewOnAndroid: true,
                        });
                        await CameraRoll.save(uri);
                        toast('保存到相冊成功');
                    } catch (error) {
                        console.log(error);
                    }

                }} labelStyle={styles.buttonLabel} label="保存爲圖片" />
                <TouchableOpacity style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: scale(8)
                    }} onPress={async () => {
                        await clipboard.setStringAsync(address?? '');
                        toast('複製成功');
                    }}
                    >
                        <Text style={{ ...styles.detail_line }}>
                        {address}
                        <AntIcon name="copy1" size={12} />
                        </Text>

                        
                    </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray200,
    },
    buttonContainer: {
        paddingHorizontal: scale(24),
        marginTop: verticalScale(50),
    },
    viewContainer: {
        width: '100%',
        paddingHorizontal: scale(24)
    },
    contentContainer: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: scale(19),
        borderWidth: scale(1),
        borderColor: '#EDEDED',
        backgroundColor: 'white',

        marginTop: verticalScale(22),
        paddingBottom: verticalScale(21),
        paddingTop: verticalScale(36),
    },
    address: {
        fontSize: 12,
        color: '#666',
        fontWeight: '400',
        marginTop: verticalScale(12),
    },
    tips: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    line: {
        width: scale(297),
        height: scale(1),
        borderWidth: scale(1),
        borderColor: '#EDEDED',
        borderStyle: 'dashed',
        marginTop: verticalScale(23),
        marginBottom: verticalScale(20),
    },
    button: {
        height: scale(56),
        borderRadius: scale(16),
    },
    buttonLabel: {
        color: 'white'
    },
    detail_line: {
        backgroundColor: 'white',
        padding: scale(12),
        fontSize: scale(12),
        borderRadius: scale(14),
        marginTop: scale(12),
        color: colors.gray700,
    }
})