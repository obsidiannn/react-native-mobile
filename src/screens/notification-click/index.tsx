import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Checkbox } from 'react-native-ui-lib';
import { Image } from 'expo-image';
import { StackScreenProps } from "@react-navigation/stack";

import { moderateScale, verticalScale, scale } from 'react-native-size-matters/extend';
import colors from "../../config/colors";
import toast from "../../lib/toast";
import { isEmptyAccountDataList } from "../../lib/account";
import { navigate } from "../../lib/root-navigation";
import { RootStackParamList } from "@/types";

interface HandleResult {
    jumpTo: string
    params: any
}
export default ({ navigation,route }: StackScreenProps<RootStackParamList, 'NotificationClick'>) => {
    console.log('跳转到消息的页面：',route.params);
    
    const init = useCallback(async () => {
        const target = handleNofitication()
        // 是否存在账号
        if (await isEmptyAccountDataList()) {
            // 账号是否活跃
            if(globalThis.wallet){
                navigation.navigate('AuthStackNav',{ screen: target.jumpTo,params: target.params })
            }else{
                navigate('Unlock',target)
            }
        }else{
            navigation.navigate('Entry')
        }
    }, []);

    /**
     * 处理路由的跳转
     */
    const handleNofitication = ():HandleResult => {
        const result: HandleResult = {
            jumpTo: '',
            params: {}
        }
        const param:any = route.params??null
        if(param !== null &&(param.sourceType??null) !== null){
            if(param.sourceType === 'chat_user'){
                result.jumpTo = 'UserInfo'
            } else {
                result.jumpTo = 'AddFriend'
            }
            result.params = param
        }
        return result
    }

    useEffect(() => {
        init();
    }, []);
    return (
        <SafeAreaView >
            
        </SafeAreaView>
    );
};
