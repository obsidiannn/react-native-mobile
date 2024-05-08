import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { navigate } from '@/lib/root-navigation';
import { scale } from "react-native-size-matters/extend";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Image } from "@/components/image";
import { ChatDetailItem, ChatListItem } from "@/api/types/chat";
import { ChatTypeEnum } from "@/api/types/enums";
dayjs.extend(relativeTime)
export interface Conversation {
    id: string;
    target_id: string;
    name: string;
    type: number;
    avatar: string;
    unread: number;
    timestamp?: dayjs.Dayjs;
    last_read_sequence: number;
    last_sequence: number;
    last_time: number;
}

export interface ConversationType extends ChatDetailItem {
    timestamp?: dayjs.Dayjs
    unread: number
}

export default (props: {
    item: ConversationType,
    isLast: boolean,
}) => {
    const { item, isLast } = props;
    return <TouchableOpacity onPress={() => {
        if (item.type === ChatTypeEnum.NORMAL) {
            navigate('UserChat',{
                item: {
                    ...item,
                    timestamp: item.lastTime
                },
            })
        }else if(item.type === ChatTypeEnum.GROUP){
            console.log('group item', item);
            navigate('GroupChat',{
                item: {
                    ...item,
                    timestamp: item.lastTime
                }
            })
        }
    }} style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
            {
                item.unread > 0 ? <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.unread > 99 ? 99 : item.unread}</Text>
                </View> : null
            }
        </View>
        <View style={{
            ...styles.rightContainer,
            borderBottomColor: isLast ? 'white' : '#F4F4F4',
        }}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.chatAlias}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.timestamp?.fromNow()}</Text>
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
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        marginRight: scale(10),
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    badgeContainer: {
        position: 'absolute',
        top: scale(12),
        left: scale(32),
        width: scale(20),
        height: scale(20),
        borderWidth: 1,
        borderColor: '#ffffffcc',
        borderRadius: scale(11),
        backgroundColor: '#FF3D00',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    nameContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    },
    nameText: {
        fontWeight: '400',
        fontSize: 16,
        color: '#000000',
    },
    timeContainer: {
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    timeText: {
        color: '#999',
        fontWeight: '400',
        fontSize: 12,
        marginRight: scale(6),
    }
});