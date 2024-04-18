import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import { DataType, IMessage } from "../../input-toolkit/types";

export default (props: {
    children: React.ReactNode;
    isSelf: boolean;
    style?: ViewStyle;
    onPress?: (m: IMessage<DataType>) => void;
    onLongPress?: (m: IMessage<DataType>) => void;
    message: IMessage<DataType>;
}) => {
    // const statusComponent = <View style={{
    //     width: scale(20),
    //     backgroundColor: 'red',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // }}>
    //     <Text>狀態</Text>
    // </View>;
    const statusComponent = null;
    return <View style={[
        styles.container,
        props.isSelf ? styles.selfContainer : styles.userContainer,
        props.style,
    ]}>
        {props.isSelf ? statusComponent : null}
        <Pressable onLongPress={() => {
            props.onLongPress && props.onLongPress(props.message);
        }} onPress={() => {
            props.onPress && props.onPress(props.message);
        }}>
            {props.children}
        </Pressable>
        {!props.isSelf ? statusComponent : null}
    </View>
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    selfContainer: {
        justifyContent: 'flex-end',
        paddingLeft: scale(54),
    },
    userContainer: {
        paddingRight: scale(39),
    },
})