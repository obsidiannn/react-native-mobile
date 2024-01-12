import { Image } from "@/components/image"
import { navigate } from "@/lib/root-navigation"
import { StyleSheet, Text } from "react-native"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { scale, verticalScale } from "react-native-size-matters/extend"

export default () => {
    return <View>
        <TouchableOpacity onPress={() => {
            navigate("AddFriend")
        }} style={styles.item}>
            <Image style={styles.icon} source={require('@/assets/icons/useradd-red.svg')} />
            <View style={{
                ...styles.rightContainer,
                borderBottomWidth: 1,
                borderBlockColor: '#F4F4F4'
            }}>
                <Text style={styles.text}>添加好友</Text>
            </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => {
            navigate('NewFriend')
        }} style={{
            ...styles.item,
            marginTop: verticalScale(10)
        }}>
            <Image style={styles.icon} source={require('@/assets/icons/userchecked-green.svg')} />
            <View style={styles.rightContainer}>
                <Text style={styles.text}>等待验证</Text>
            </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => {
            navigate('GroupList')
        }} style={{
            ...styles.item,
            marginTop: verticalScale(10)
        }}>
            <Image style={styles.icon} source={require('@/assets/icons/userchecked-green.svg')} />
            <View style={styles.rightContainer}>
                <Text style={styles.text}>群聊</Text>
            </View>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    item: {
        height: scale(60),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scale(15),
        marginRight: scale(15),
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        height: scale(60),
    },
    icon: {
        width: scale(40),
        height: scale(40),
        marginRight: scale(10),
    },
    text: {
        color: '#333',
        fontSize: scale(16),
        fontWeight: '500'
    }
})