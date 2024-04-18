import { Pressable, StyleSheet, Text, View } from "react-native"
import { scale } from "react-native-size-matters/extend"

export default (props: {
    index: number;
    onChange: (v: number) => void;
}) => {
    const { index } = props;
    return <View style={styles.container}>
        <Pressable onPress={() => props.onChange(0)} style={[
            styles.textContainer,
            index === 0 ? styles.activeTextContainer : {}
        ]}>
            <Text style={index == 0 ? styles.activeText : styles.text}>好友</Text>
        </Pressable>
        <Pressable onPress={() => props.onChange(1)} style={[
            styles.textContainer,
            index === 1 ? styles.activeTextContainer : {}
        ]}>
            <Text style={index == 1 ? styles.activeText : styles.text}>羣組</Text>
        </Pressable>
    </View>
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: scale(42),
        borderRadius: scale(21),
        backgroundColor: '#E1E4E6',
        borderColor: '#F4F4F4',
        borderWidth: scale(1),
        display: 'flex',
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTextContainer: {
        backgroundColor: '#fff',
        borderColor: '#ECECEC',
        borderWidth: scale(1),
        borderRadius: scale(20),
    },
    text: {
        fontSize: scale(16),
        color: '#666',
        fontWeight: '400'
    },
    activeText: {
        fontSize: scale(16),
        color: '#333',
        fontWeight: '600'
    }
});