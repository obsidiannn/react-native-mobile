import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { scale } from "react-native-size-matters/extend";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Image } from "@/components/image";
import { GroupMemberItemVO } from "@/api/types/group";
dayjs.extend(relativeTime)

export default (props: {
    item: GroupMemberItemVO,
    isLast: boolean,
    onPress: ()=>void
}) => {
    const { item, isLast } = props;
    return <TouchableOpacity onPress={props.onPress} style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
        </View>
        <View style={{
            ...styles.rightContainer,
            borderBottomColor: isLast ? 'white' : '#F4F4F4',
        }}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.alias}</Text>
            </View>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        height: scale(76),
        width: '100%',
        paddingHorizontal: scale(16),
        display: 'flex',
        flexDirection: 'row',
        backgroundColor:"white",
        borderBottomColor: "e5e7eb",
    },
    avatarContainer: {
        width: scale(57),
        height: scale(76),
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(10),
        marginRight: scale(10),
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    rightContainer: {
        width: scale(260),
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    nameContainer: {
        flex: 1,
        display: 'flex',
        marginLeft: scale(10),
        justifyContent: 'center',
    },
    nameText: {
        fontWeight: '400',
        fontSize: 16,
        color: '#333'
    },
});