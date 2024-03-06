import React, { useCallback, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import 'text-encoding-polyfill';
import { RootSiblingParent } from 'react-native-root-siblings';
import { RecoilRoot } from 'recoil';
import SysApi from './src/api/sys';
import { Platform, UIManager } from 'react-native';
import { globalStorage } from './src/lib/storage'
import KeyboardManager from 'react-native-keyboard-manager';
import MainStack from './src/stacks/index';
import toast from './src/lib/toast';
import messaging from '@react-native-firebase/messaging';
// import { Notifications } from 'react-native-notifications';

const requestUserPermission = async () => {
  await messaging().requestPermission();
};

const onMessageReceived = async (message) => {
  // Notifications.postLocalNotification({
  //   title: message.notification.title,
  //   body: message.notification.body,
  //   extra: message.data,
  // });
  toast(message.notification.title)
};

 
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(false);
  KeyboardManager.setEnableAutoToolbar(false);
}

requestUserPermission()

// messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

globalThis.TextEncoder = TextEncoder;
function App(): JSX.Element {
  const init = useCallback(async () => {
    const res = await SysApi.getInfo();
    globalStorage.setItem('sys-pub-key', res.pub_key);
    globalStorage.setItem('sys-static-url', res.static_url);

    // 获取firebase token 
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    console.log('try to get firebase token');
    
    const token = await messaging().getToken();
    console.log('====================================');
    console.log('firebase token is : ', token);
    toast(token)
    console.log('====================================');

  }, []);


  useEffect(() => {
    try {
      init();
    } catch (e) {
      toast('初始化失败!');
    }
  }, []);
  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <RootSiblingParent>
          <MainStack />
        </RootSiblingParent>
      </SafeAreaProvider>
    </RecoilRoot>
  );
}

export default App;
