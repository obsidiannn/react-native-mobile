import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { navigate } from '@/lib/root-navigation';
import { scale } from "react-native-size-matters/extend";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { FriendInfoItem } from "@/api/types/friend";
import { Image } from "@/components/image";
import chatService from "@/service/chat.service";
import { ConversationType } from "@/screens/home/components/conversation-item";
dayjs.extend(relativeTime)
export default (props: {
    item: FriendInfoItem,
    isLast: boolean,
}) => {
    const { item, isLast } = props;
    return <TouchableOpacity onPress={() => {
        chatService.chatDetail(item.chatId).then(res => {
            if (res.length > 0) {
                const item: ConversationType = {
                    ...res[0],
                    timestamp: res[0].lastTime > 0 ? dayjs(res[0].lastTime) : undefined,
                    unread: res[0].lastSequence - res[0].lastReadSequence,
                }
                navigate('UserChat', {
                    item: item
                })
            }
        })

    }} style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
        </View>
        <View style={{
            ...styles.rightContainer,
            borderBottomColor: isLast ? 'white' : '#F4F4F4',
        }}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{!item?.remark ? item.name : item.remark}</Text>
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
    },
    avatarContainer: {
        width: scale(57),
        height: scale(76),
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
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
        justifyContent: 'center',
    },
    nameText: {
        fontWeight: '400',
        fontSize: 16,
        color: '#333'
    },
});