import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabStack from './tab-stack';
import {
    AddFriendScreen,
    UserInfoScreen,
    UserCardScreen,
    UserChatScreen,
    NewFriendScreen,
    InviteInfoScreen,
    SecurityScreen,
    SettingScreen,
    UserProfileScreen,
    UpdateUsernameScreen,
    BackupMnemonicScreen,
    InviteFriend,
    GroupChatScreen,
    GroupApplyListScreen,
    UserSettingScreen,
    UserChatInfoScreen,
    GroupInfoScreen,
    GroupListScreen,
    WalletRecordScreen,
    WalletQrcodeScreen,
    BillDetailScreen,
    WalletRecordPageScreen,
    WalletTopupRecordScreen,
    WalletWithdrawScreen,
    RedPacketDetailScreen
} from '../screens/index'
import { RootStackParamList } from '@/types';
import { useNavigation } from '@react-navigation/native';
export default () => {
    const Stack = createStackNavigator<RootStackParamList>();
    
    const navigation = useNavigation();
    const state = navigation.getState()
    const parentState = state.routes[state.index]
    console.log('[route]',(parentState.state?.routeNames??[])[parentState.state?.index??0]);
    
    return (
        <Stack.Navigator initialRouteName='Tab' screenOptions={{
            headerShown: false,
        }}>
          
            <Stack.Screen name="Tab" component={TabStack} />
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
            <Stack.Screen name="UserInfo" component={UserInfoScreen} />
            <Stack.Screen name="UserCard" component={UserCardScreen} />
            <Stack.Screen name="UserChat" component={UserChatScreen} />
            <Stack.Screen name="GroupChat" component={GroupChatScreen} />
            <Stack.Screen name="GroupApplyList" component={GroupApplyListScreen} />
            <Stack.Screen name="NewFriend" component={NewFriendScreen} />
            <Stack.Screen name="InviteInfo" component={InviteInfoScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="UpdateUsername" component={UpdateUsernameScreen} />
            <Stack.Screen name="BackupMnemonic" component={BackupMnemonicScreen} />
            <Stack.Screen name="InviteFriend" component={InviteFriend} />
            <Stack.Screen name="UserSetting" component={UserSettingScreen} />
            <Stack.Screen name="UserChatInfo" component={UserChatInfoScreen} />
            <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
            <Stack.Screen name="GroupList" component={GroupListScreen} />
            <Stack.Screen name="WalletRecord" component={WalletRecordScreen} />
            <Stack.Screen name="WalletQrcode" component={WalletQrcodeScreen} />
            <Stack.Screen name="BillDetail" component={BillDetailScreen} />
            <Stack.Screen name="WalletRecordPage" component={WalletRecordPageScreen} />
            <Stack.Screen name="WalletTopupRecord" component={WalletTopupRecordScreen} />
            <Stack.Screen name="WalletWithdraw" component={WalletWithdrawScreen} />
            <Stack.Screen name="RedPacketDetail" component={RedPacketDetailScreen} />
        </Stack.Navigator>
    );
}