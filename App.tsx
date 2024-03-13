import React, { useCallback, useEffect,useRef } from 'react';
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
import { initNotification } from './src/service/notification.service'

import { navigate } from "./src/lib/root-navigation";
import messaging,{FirebaseMessagingTypes} from '@react-native-firebase/messaging';


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

globalThis.TextEncoder = TextEncoder;
function App(): JSX.Element {
  const init = useCallback(async () => {
    const res = await SysApi.getInfo()
    globalStorage.setItem('sys-pub-key', res.pub_key);
    globalStorage.setItem('sys-static-url', res.static_url);

    await initNotification()

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      console.log('发起跳转');
      navigate('NotificationClick',remoteMessage.data)
    }); 
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage.notification,
    //       );
    //       navigate('NotificationClick',remoteMessage.data)
    //     }
    //   });

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
