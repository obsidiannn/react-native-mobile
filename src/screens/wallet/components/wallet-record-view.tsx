import { WalletItem } from "@/api/types/wallet"
import CardItem from "@/components/wallet/card-item"
import colors from "@/config/colors"
import { StyleSheet, ScrollView, Text, View,TouchableOpacity } from "react-native"
import { scale } from "react-native-size-matters/extend"
import Icon from 'react-native-vector-icons/MaterialIcons'
import { navigate } from "@/lib/root-navigation";
const WalletRecordView = (props: {
    data: WalletItem[],
    total: number,
    type_state: string
}) => {
    return <ScrollView style={styles.tab_page} showsVerticalScrollIndicator={false}>
        {props.data.map(item => {
            return <CardItem data={item} key={item.id} bgColor={colors.gray200} onClick={() => { 
                navigate('BillDetail',{id: item.id})
            }} />
        })}
        {props.total > props.data.length ?
            <TouchableOpacity style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                margin: scale(12)
            }} onPress={()=>{
                navigate('WalletRecordPage',{ typeState: props.type_state })
            }}
            >
                <Text>查看更多</Text>
                <Icon name="keyboard-arrow-right" size={14}></Icon>
            </TouchableOpacity>
            : null}
    </ScrollView>
}
const styles = StyleSheet.create({
    tab_page: {
        display: 'flex',
        flexDirection: 'column',
        // margin: 0
    }
})

export default WalletRecordView