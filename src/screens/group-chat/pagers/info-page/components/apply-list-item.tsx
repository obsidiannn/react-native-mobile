import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { navigate } from '@/lib/root-navigation';
import { scale } from "react-native-size-matters/extend";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Image } from "@/components/image";
import { GroupApplyItem } from "@/api/types/group";
dayjs.extend(relativeTime)
export default (props: {
    item: GroupApplyItem,
    isLast: boolean,
    onCheck: () => void;
}) => {
    const { item, isLast } = props;
    return <TouchableOpacity onPress={() => {
        if (item.status === 1) {
            props.onCheck();
        } else {
            const authUid = globalThis.wallet?.address.toLowerCase() || '';
            navigate('UserInfo', {
                uid: item.uid,
            });
        }
    }} style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.avatar} />
        </View>
        <View style={{
            ...styles.rightContainer,
            borderBottomColor: isLast ? 'white' : '#F4F4F4',
        }}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={{
                    ...styles.statusText,
                    color: item.status === 1 ? '#009B0F' : '#999',
                }}>
                    {item.status === 2 && '已添加'}
                    {item.status === 3 && '已拒絕'}
                    {item.status === 1 && '等待驗證'}
                </Text>
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
    statusContainer: {
        width: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    statusText: {
        fontWeight: '400',
        fontSize: 12,
        textAlign: 'left',
        marginRight: scale(6),
    }
});