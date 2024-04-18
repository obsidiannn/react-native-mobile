import { StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import { Image } from "../../../../components/image";
import { handleAddress } from "../../../../lib/account";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard'
import toast from "../../../../lib/toast";
export default (props: {
    value: string;
}) => {
    return <TouchableOpacity style={styles.container} onPress={async () => {
        await Clipboard.setStringAsync(props.value);
        toast('複製成功!');
    }}>
        <Text style={styles.text}>{handleAddress(props.value)}</Text>
        <Image source={require('../../../../assets/icons/copy.svg')} style={{
            width: scale(24),
            height: scale(24),
        }} />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: scale(42),
        borderRadius: scale(21),
        paddingHorizontal: scale(15),
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
    },
    text: {
        fontSize: scale(14),
        fontWeight:'400',
        color: '#666',
        flex: 1,
    },
});