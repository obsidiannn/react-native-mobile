import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native"


interface ConfirmItem {
    uid: string
    amount: number
    remark: number
}

type Props = StackScreenProps<RootStackParamList, 'PayConfirm'>;
const PayConfirmScreen = ()=>{

}

const styles = StyleSheet.create({
    
})

export default PayConfirmScreen