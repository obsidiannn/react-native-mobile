import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useRef } from "react";
import Navbar from "../../components/navbar";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import colors from "../../config/colors";
import toast from "../../lib/toast";

const UpdateUsernameScreen = () => {
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>();
    useEffect(() => {
        inputRef.current?.focus();
    }, [])
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="更新暱稱" />
            </View>
            <ScrollView style={{
                flex: 1
            }} keyboardDismissMode="interactive">
                <View style={styles.inputBox}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholderTextColor="#ABABB2"
                            ref={(ref) => inputRef.current = ref as TextInput}
                            placeholder="暱稱(5-16位)"
                            style={styles.input}
                        />
                    </View>
                </View>
                <View style={styles.buttonBox}>
                    <Button
                        label="保存"
                        borderRadius={16}
                        style={styles.button}
                        backgroundColor={colors.primary}
                        labelStyle={styles.buttonLabel}
                        onPress={() => {
                            console.log('保存');
                            toast('保存成功');
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default UpdateUsernameScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    inputBox:{
        paddingHorizontal: scale(15),
                    marginTop: verticalScale(20),
    },
    inputContainer: {
        height: verticalScale(48),
        borderRadius: verticalScale(12),
        borderWidth: 1,
        borderColor: '#F4F4F4',
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        paddingHorizontal: scale(18),
    },
    input:{
        fontSize: 16,
        width: '100%',
        fontWeight: '400' 
    },
    buttonBox:{
        paddingHorizontal: scale(25),
        marginTop: verticalScale(116),
    },
    button:{
        height: verticalScale(50)
    },
    buttonLabel:{
        fontSize: 16,
        fontWeight: '700',
    }
});