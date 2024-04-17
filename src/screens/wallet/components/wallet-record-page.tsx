import Navbar from "@/components/navbar";
import colors from "@/config/colors";
import { RootStackParamList } from "@/types";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";

type Props = StackScreenProps<RootStackParamList, 'WalletRecordPage'>;


interface WalletPageState{
    income_amount: number
    outcome_amount: number
    page: number
    total: number
    size: number
}

const WalletRecordPage = (props: Props) => {
    
    useEffect(() => {
        console.log(props.route.params.typeState);
    }, [])
    return <View style={{ flex: 1 }}>
        <Navbar title="BOBO钱包" />
        <View style={{ padding: scale(14), backgroundColor: colors.gray200, flex: 1 }}>
            <View style={styles.main_container}>
                <View style={styles.button_area}></View>
                <View style={styles.list_area}>
                    <View style={styles.stat_area}>
                        <Button label="全部"/>
                    </View>
                </View>
            </View>
        </View>
    </View>
}


const styles = StyleSheet.create({
    main_container:{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: scale(14),
    },
    button_area: {

    },
    list_area:{},
    stat_area:{}

})

export default WalletRecordPage

