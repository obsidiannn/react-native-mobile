import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Image } from "../../../../components/image";
export default (props: {
    onChange: (val: string) => void;
    value: string;
}) => {
    const inputRef = useRef<TextInput>();
    return <View style={styles.inputContainer}>
        <TextInput
            multiline={true}
            placeholder="設置簽名"
            ref={(ref) => {
                inputRef.current = ref as TextInput;
            }}
            style={styles.input}
            onChangeText={(v) => {
                props.onChange(v);
            }}
            value={props.value}
        />
        <Image source={require('../../../../assets/icons/edit-primary.svg')} style={{
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
        height: verticalScale(85),
        borderRadius: scale(16),
        padding: scale(15),
        backgroundColor: '#F3F3F3',
        alignItems: 'flex-start'
    },
    input: {
        flex: 1,
        fontSize: scale(16),
    },
});