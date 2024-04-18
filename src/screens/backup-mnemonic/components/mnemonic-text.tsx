import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-ui-lib";
import * as clipboard from 'expo-clipboard';
import { scale, verticalScale } from "react-native-size-matters/extend";
import toast from "../../../lib/toast";
import colors from "../../../config/colors";
export default (props: {
    mnemonic: string;
}) => {
    const { mnemonic } = props;
    return (
        <View style={styles.container}>
            <View style={styles.mnBox}>
                <View style={styles.mnContainer}>
                    {mnemonic.split(' ').map((word, i) => {
                        const index = ((i + 1) + '').padStart(2, '0');
                        return (
                            <View key={i} style={styles.mnItemContainer}>
                                <View style={styles.mnIndexContainer}>
                                    <Text style={styles.mnIndexText}>{index}</Text>
                                </View>
                                <View style={styles.mnWordContainer}>
                                    <Text style={styles.mnWordText}>{word}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button size="large" style={styles.button} backgroundColor={colors.primary} onPress={async () => {
                    await clipboard.setStringAsync(mnemonic);
                    toast('複製成功');
                }} label="複製助記詞" labelStyle={styles.buttonLabel} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mnBox: {
        paddingHorizontal: scale(15)
    },
    mnContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: scale(345),
        paddingHorizontal: scale(22),
        paddingBottom: verticalScale(20),
        paddingTop: verticalScale(10),
        borderRadius: scale(19),
        borderWidth: 1,
        borderColor: '#EDEDED',
        marginTop: verticalScale(20),
    },
    mnItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    mnIndexContainer: {
        height: verticalScale(30),
        width: scale(30),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mnIndexText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#333',
        textAlign: 'right',
    },
    mnWordContainer: {
        flex: 1,
        display: 'flex',
        height: verticalScale(30),
        borderRadius: verticalScale(28),
        backgroundColor: '#F4F6F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mnWordText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
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