import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { scale, verticalScale } from "react-native-size-matters/extend";
import toast from "../../../lib/toast";
import colors from "../../../config/colors";
export default (props: {
    mnemonic: string;
}) => {
    const { mnemonic } = props;
    const viewRef = useRef<View>();
    return (
        <View style={styles.container}>
            <View style={styles.qrContariner}>
                {mnemonic !== '' && <QRCode
                    value={mnemonic}
                    size={scale(234)}
                />}
            </View>
            <View ref={(ref) => viewRef.current = ref as View} style={styles.qrTipsContainer}>

                <Text style={styles.qrTipsText}>助記詞二維碼</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button size="large" style={styles.button} backgroundColor={colors.primary} onPress={async () => {
                    if (viewRef.current == null) {
                        return;
                    }
                    const uri = await captureRef(viewRef.current, {
                        format: "jpg",
                        quality: 0.8
                    });
                    await CameraRoll.save(uri);
                    toast('保存到相冊成功');
                }} label="保存到相冊" labelStyle={styles.buttonLabel} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    qrContariner: {
        width: scale(294),
        height: scale(294),
        borderRadius: scale(19),
        borderWidth: scale(1),
        borderColor: '#EDEDED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(30),
        marginTop: verticalScale(20),
    },
    qrTipsContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    qrTipsText: {
        fontSize: 16,
        color: '#000',
        marginTop: verticalScale(15),
        fontWeight: '400'
    },
    buttonContainer: {
        paddingHorizontal: scale(25),
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(40),
    },
    button: {
        width: '100%',
        height: scale(56),
        borderRadius: scale(16),
    },
    buttonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
})