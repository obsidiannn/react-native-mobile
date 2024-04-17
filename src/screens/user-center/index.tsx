import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AuthInfo from "./components/auth-info";
import Tool from "./components/tool";
import { useEffect } from "react";
import WalletCard from "@/screens/wallet/components/wallet-card";
import { RootStackParamList } from "@/types";

type Props = StackScreenProps<RootStackParamList, 'UserCenter'>;
const UserCenterScreen = ({ }: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
        }}>
            <AuthInfo />
            <WalletCard bottomRadius={false} navigateToRecord/>
            <Tool />
        </View>
    )
}
export default UserCenterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
    }
})