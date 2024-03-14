import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { navigate } from "../../../lib/root-navigation"
import { RelationListItem } from "../../../api/types/friend";
import { Image } from "../../../components/image";
import { scale } from "react-native-size-matters/extend";

export default (props: {
    item: RelationListItem;
    isLast: boolean;
}) => {
    const { item, isLast } = props;
    return <TouchableOpacity onPress={() => {
        navigate('UserInfo', {
            uid: item.uid
        })
    }} style={{
        ...styles.container,
    }}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <View style={{
            ...styles.rightContainer,
            borderBottomColor: isLast ? 'white' : '#F4F4F4',
        }}>

            <Text style={styles.name}>{item.name}</Text>
            <Image style={styles.icon} source={require('../../../assets/icons/arrow-right-primary.svg')} />
        </View>
    </TouchableOpacity>
}
const styles = StyleSheet.create({
    container: {
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(15),
    },
    avatar: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginRight: scale(15),
    },
    rightContainer: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    name: {
        flex: 1,
        fontSize: scale(16),
        fontWeight: '400',
        color: '#000',
    },
    icon: {
        width: scale(20),
        height: scale(20),
    }
});