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
} from '../screens/index'
import { RootStackParamList } from '@/types';
export default () => {

    const Stack = createStackNavigator<RootStackParamList>();
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
        </Stack.Navigator>
    );
}