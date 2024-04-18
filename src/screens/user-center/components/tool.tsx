import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { scale } from "react-native-size-matters/extend";
import { TouchableOpacity } from "react-native-gesture-handler";
import { navigate } from "../../../lib/root-navigation";
export default () => {
    const tools: {
        icon: any,
        name: string,
        route: string,
    }[] = [
            {
                icon: require('../../../assets/icons/user-tool.svg'),
                name: '個人資料',
                route: 'UserProfile',
            },
            {
                icon: require('../../../assets/icons/security.svg'),
                name: '安全',
                route: 'Security',
            },
            {
                icon: require('../../../assets/icons/setting.svg'),
                name: '設置',
                route: 'Setting',
            },
        ]
    return (
        <View style={styles.container}>
            {tools.map((item, index) => {
                return <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => {
                    navigate(item.route);
                }}>
                    <Image source={item.icon} style={styles.icon} />
                    <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(15),
        marginTop: scale(29),
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(12),
        backgroundColor: '#FAFAFA',
        height: scale(60),
        marginTop: scale(11),
    },
    icon: {
        width: scale(40),
        height: scale(40),
        marginRight: scale(10),
        marginLeft: scale(12),
    },
    text: {
        color: '#333',
        fontSize: 14,
        fontWeight: '400'
    }
})