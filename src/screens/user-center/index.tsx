import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthInfo from "./components/auth-info";
import Tool from "./components/tool";
import { useEffect } from "react";
type Props = StackScreenProps<RootStackParamList, 'UserCenter'>;
const UserCenterScreen = ({ }: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
        }}>
            <AuthInfo />
            <Tool />
        </View>
    )
}
export default UserCenterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
})