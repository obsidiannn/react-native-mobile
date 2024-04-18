import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import {Image} from "@/components/image";
export default (props: {
    onChange: (val: string) => void;
    value: string;
}) => {
    const inputRef = useRef<TextInput>();
    return <View style={styles.inputContainer}>
        <TextInput
            placeholder="設置暱稱"
            maxLength={16}
            ref={(ref) => {
                inputRef.current = ref as TextInput;
            }}
            style={styles.input}
            onChangeText={(v) => {
                props.onChange(v);
            }}
            value={props.value}
        />
        <Image source={require('@/assets/icons/edit-primary.svg')} style={{
            width: scale(24),
            height: scale(24),
        }} />
    </View>
}

const styles = StyleSheet.create({
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: scale(42),
        borderRadius: scale(21),
        paddingHorizontal: scale(15),
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
    },
    input: {
        fontSize: scale(16),
        flex: 1,
    },
});