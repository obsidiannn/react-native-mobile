import { StyleSheet, TextInput, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Image } from "../../../components/image";
import { useRef, useState } from "react";

export default (props: {
    onSearch: (address: string) => void;
}) => {
    const inputRef = useRef<TextInput>(null);
    const [address, setAddress] = useState<string>('');
    return <View style={styles.container}>
        <Image style={styles.icon} source={require('../../../assets/icons/search.svg')} />
        <TextInput style={styles.input} placeholderTextColor='#33333366'
            onEndEditing={() => {
                props.onSearch(address);
            }} ref={inputRef} returnKeyType="done" placeholder="請輸入好友地址" value={address}
            onChangeText={(v) => setAddress(v)} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        height: scale(48),
        borderRadius: scale(12),
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
        paddingHorizontal: scale(15),
    },
    icon: {
        width: scale(24),
        height: scale(24),
        marginRight: scale(10),
    },
    input: {
        flex: 1,
        fontSize: scale(16),
        color: '#333'
    }
})