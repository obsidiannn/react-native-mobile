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
interface Protocol {
    name: string;
    url: string;
}
export default ({ navigation }: StackScreenProps<RootStackParamList, 'Entry'>) => {
    const [protocols, setProtocols] = React.useState<Protocol[]>([]);
    const [protocolStatus, setProtocolStatus] = React.useState<boolean>(false);
    const init = useCallback(async () => {
        if (await isEmptyAccountDataList()) {
            navigation.navigate('Unlock');
        }
    }, []);
    useEffect(() => {
        setProtocols([
            {
                name: '《隱私協議》',
                url: 'https://pages.ducloud.buzz/#/user-agreement'
            },
            {
                name: '《可接受條款》',
                url: 'https://pages.ducloud.buzz/#/privacy-policy'
            },
        ]);
        init();
    }, []);
    const onLogin = useCallback(() => {
        navigation.navigate('Login')
    }, [])
    const onRegister = useCallback(() => {
        navigation.navigate('Register')
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../assets/logo.svg')} />
                </View>
                <View style={styles.sloganContainer}>
                    <Text style={styles.sloganPrimaryText}>歡迎使用</Text>
                    {/* <Text style={styles.sloganNormalText}>享受自由的世界</Text> */}
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonContainer}>
                    <Button size="large" style={styles.loginButton} backgroundColor={colors.primary} onPress={() => {
                        if (!protocolStatus) {
                            toast('請先閱讀並同意相關協議！');
                            return;
                        }
                        onLogin();
                    }} label="登陸" labelStyle={styles.loginButtonLabel} />
                    <Button size="large" style={styles.registerButton} backgroundColor="white" onPress={() => {
                        if (!protocolStatus) {
                            toast('請先閱讀並同意相關協議！');
                            return
                        }
                        onRegister();
                    }} label="註冊TDchat賬號" labelStyle={styles.registerButtonLabel} />
                </View>
                <View style={styles.protocolContainer}>
                    <View style={styles.protocolContentContainer}>
                        <Checkbox borderRadius={scale(9)} color={colors.primary} iconColor="white" size={scale(18)} value={protocolStatus} onValueChange={(value) => setProtocolStatus(value)} />
                        <View style={styles.protocolTextContainer}>
                            <TouchableOpacity onPress={() => setProtocolStatus(!protocolStatus)}>
                                <Text style={styles.protocolText}>我已閱讀並同意</Text>
                            </TouchableOpacity>
                            {protocols.map((protocol, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => {
                                        navigation.push('Web', { url: protocol.url })
                                    }}>
                                        <Text style={styles.protocolText}>{protocol.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topContainer: {
        flex: 1,
    },
    bottomContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        paddingBottom: verticalScale(37)
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        marginTop: verticalScale(76),
        width: moderateScale(87),
        height: moderateScale(87),
    },
    sloganContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: verticalScale(16),
    },
    sloganPrimaryText: {
        fontSize: 24,
        fontWeight: '400',
        color: colors.primary
    },
    sloganNormalText: {
        fontSize: 16,
        fontWeight: '300',
        color: colors.primary,
        marginTop: verticalScale(8),
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        width: scale(327),
        height: scale(56),
        borderRadius: scale(16),
    },
    loginButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    registerButton: {
        width: scale(327),
        height: scale(56),
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: scale(16),
        marginTop: verticalScale(21),
    },
    registerButtonLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary
    },
    protocolContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        marginTop: verticalScale(26),
    },
    protocolContentContainer: {
        width: scale(327),
        paddingLeft: scale(7),
        flexDirection: 'row',
        display: 'flex',
    },
    protocolTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: scale(4)
    },
    protocolText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#858C9D',
        lineHeight: 18,
    }
});