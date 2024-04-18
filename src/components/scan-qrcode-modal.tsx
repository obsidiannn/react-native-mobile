import { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native-ui-lib";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { requestCameraPermission } from "../lib/permissions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { scale, verticalScale } from "react-native-size-matters/extend";
export interface ScanQrcodeModalType {
    open: () => void;
}
export default forwardRef((props: {
    onScan: (data: string) => void;
}, ref) => {
    const [visible, setVisible] = useState(false);
    const [scanned, setScanned] = useState(true);
    const insets = useSafeAreaInsets();
    useImperativeHandle(ref, () => ({
        open: async () => {
            await requestCameraPermission();
            setVisible(true);
            setScanned(false);
        }
    }));
    const handleBarCodeScanned = (data: any) => {
        console.log(data.data);
        props.onScan(data.data);
        setScanned(true);
        setVisible(false);
    };
    return <Modal
        visible={visible}
        animationType="slide"
        style={{
            flex: 1,
            width: '100%',
        }}>
        <View style={{
            flex: 1,
        }}>
            <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                    flex: 1,
                    width: '100%',
                }}
                focusable={true}
            >
                <View style={{
                    flex: 1,
                    width: '100%',
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                    <View style={{
                        height: verticalScale(44),
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{
                            width: scale(39),
                            display: 'flex',
                            alignItems: 'center',
                        }} onPress={() => {
                            setVisible(false);
                            setScanned(true);
                        }}>
                            <Image source={require('../assets/icons/arrow-left-white.svg')} style={{
                                width: scale(24),
                                height: scale(24),
                                marginLeft: scale(15),
                            }} />
                        </TouchableOpacity>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            paddingRight: scale(39),
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontWeight: '500', color: 'white', fontSize: 16, textAlign: 'center' }}>掃一掃</Text>
                        </View>
                    </View>
                    <View style={{
                        paddingHorizontal: scale(70),
                        flex: 1,
                        justifyContent: 'center',
                        display: 'flex',
                    }}>
                        <View>
                            <Image source={require('@/assets/icons/scan-window.svg')} style={{
                                width: scale(235),
                                height: scale(235),
                            }} />
                        </View>
                        <View style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity>
                                <Image source={require('@/assets/icons/light.svg')} style={{
                                    width: scale(50),
                                    height: scale(50),
                                    marginTop: verticalScale(55),
                                }} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('@/assets/icons/albums.svg')} style={{
                                    width: scale(50),
                                    height: scale(50),
                                    marginTop: verticalScale(55),
                                }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BarCodeScanner>
        </View>
    </Modal>
});
