import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { handleAddress } from "@/lib/account";
import toast from "@/lib/toast";
import * as clipboard from 'expo-clipboard';
import { Image } from "@/components/image";
export default (props: {
    avatar: string;
    address: string;
    name: string;
}) => {
    return <View style={styles.container}>
        <Image style={styles.avatar} source={props.avatar} />
        <View>
            <Text style={styles.nameText}>{props.name}</Text>
            <TouchableOpacity onPress={async () => {
                await clipboard.setStringAsync(props.address);
                toast('複製成功');
            }} style={styles.addressContainer}>
                <Text style={styles.addressText}>{handleAddress(props.address)}</Text>
                <Image style={styles.icon} source={require('@/assets/icons/copy.svg')} />
            </TouchableOpacity>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        height: verticalScale(82),
        borderWidth: 1,
        borderColor: '#F4F4F4',
        backgroundColor: '#F8F8F8',
        width: '100%',
        borderRadius: verticalScale(16),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(15),
    },
    avatar: {
        width: verticalScale(50),
        height: verticalScale(50),
        borderRadius: verticalScale(25),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginRight: scale(15),
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000'
    },
    addressContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    addressText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '400'
    },
    icon: {
        width: verticalScale(20),
        height: verticalScale(20),
    }
});