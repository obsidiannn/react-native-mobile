import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "../../components/navbar";
type Props = StackScreenProps<RootStackParamList, 'GroupApplyList'>;
const GroupApplyListScreen = ({navigation }: Props) => {
    const insets = useSafeAreaInsets();
    // 與新朋友列表一樣
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="羣申請" />
            </View>
            <View style={styles.listContainer}>
            </View>
        </View>
    );
};

export default GroupApplyListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
            backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        width: '100%' 
    }
})