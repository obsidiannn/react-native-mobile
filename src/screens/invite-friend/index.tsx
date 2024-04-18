import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Navbar from "../../components/navbar";
import { StackScreenProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "react-native-ui-lib";
import friendApi from "../../api/v2/friend";
import toast from "../../lib/toast";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "../../config/colors";
import { RootStackParamList } from "@/types";
type Props = StackScreenProps<RootStackParamList, 'InviteFriend'>;
export default ({ navigation, route }: Props) => {
    const insets = useSafeAreaInsets();
    const [uid, setUid] = useState<string>('');
    const [remark, setRemark] = useState('');
    const [state, setState] = useState(false)
    useEffect(() => {
        // 監聽頁面獲取焦點
        const unsubscribe = navigation.addListener('focus', () => {
            setUid(route.params.uid);
        });
        return unsubscribe;
    }, [navigation])
    return <View style={{
        ...styles.container,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
    }}>
        <View>
            <Navbar title="邀請信息" />
        </View>
        <ScrollView style={styles.contentContainer} keyboardDismissMode="interactive">
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="請輸入備註"
                    onChangeText={text => setRemark(text)}
                    defaultValue={remark}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={120}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button disabled={state} size="large"
                    labelStyle={styles.buttonLabel}
                    style={styles.button} backgroundColor={colors.primary} onPress={() => {
                        setState(true);
                        friendApi.inviteApply({
                            uid,
                            remark: remark,
                        }).then(res => {
                            toast('發送邀請成功');
                            setTimeout(() => {
                                navigation.goBack();
                            }, 1000);
                        }).finally(() => {
                            setState(false)

                        })
                    }} label='發送邀請' />
            </View>
        </ScrollView>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
    },
    inputContainer: {
        flex: 1,
        padding: scale(15),
        borderColor: '#F4F4F4',
        borderWidth: 1,
        backgroundColor: '#F8F8F8',
        marginHorizontal: scale(15),
        borderRadius: scale(16),
        marginTop: verticalScale(20),
    },
    input: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
        height: verticalScale(82),
    },
    buttonContainer: {  
        paddingHorizontal: scale(23),
        marginTop: verticalScale(30),
    },
    button:{
        width: '100%',
        height: verticalScale(50),
        borderRadius:verticalScale(16) 
    },
    buttonLabel:{   
        fontSize: 16,
        fontWeight: '700',
    }
});