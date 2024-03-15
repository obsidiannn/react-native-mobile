import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as clipboard from 'expo-clipboard';
import toast from "@/lib/toast";
import { handleAddress } from "@/lib/account";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Image } from "@/components/image";
import GenderIcon from "@/components/gender-icon";
import { UserInfoItem } from "@/api/types/user";
import { FreindInfoReleationItem } from "@/api/types/friend";
export default (props: {
    user: FreindInfoReleationItem
}) => {
    const { user } = props;
    return <View style={styles.container}>
        <View style={styles.infoBox}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={styles.rightContainer}>
                <Text style={styles.nameText}>{user.name}</Text>
                <View style={styles.infoContainer}>
                    <GenderIcon name={user.gender} style={styles.genderIcon} />
                    <View style={styles.genderLine}></View>
                    <Text style={styles.signText}>{handleAddress(user.uid)}</Text>
                    <TouchableOpacity onPress={async () => {
                        await clipboard.setStringAsync(user.uid);
                        toast('复制成功');
                    }}>
                        <Image source={require('@/assets/icons/copy.svg')} style={styles.copyIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.signContainer}>
            <Text style={styles.signText}>{user.sign == '' ? '(空)' : user.sign}</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: '#F4F4F4',
        paddingHorizontal: scale(15),
        paddingVertical: scale(20),
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: scale(50),
    },
    avatar: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    rightContainer: {
        flex: 1,
        paddingHorizontal: scale(15),
        borderColor: '#F0F0F0',
    },
    nameText: {
        fontSize: scale(16),
        fontWeight: '500',
        color: '#000',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(7),
    },
    genderLine: {
        height: verticalScale(10),
        width: scale(1),
        backgroundColor: '#B7B7B7',
        marginRight: scale(7),
    },
    genderIcon: {
        width: scale(15),
        height: scale(15),
        marginRight: scale(5),
    },
    copyIcon: {
        width: scale(15),
        height: scale(15),
        marginLeft: scale(5),
    },
    line: {
        height: 1,
        backgroundColor: '#ECECEC',
        marginLeft: scale(50),
        marginTop: verticalScale(15),
        marginBottom: verticalScale(10),
    },
    signContainer: {
        marginLeft: scale(50),
        paddingHorizontal: scale(15),
    },
    signText: {
        fontSize: scale(14),
        fontWeight: '400',
        color: '#999',
    }
});