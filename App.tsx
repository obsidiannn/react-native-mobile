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
import messaging,{FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import notifee, { EventType,AndroidImportance } from '@notifee/react-native';
import { Button } from 'react-native-ui-lib';

const channelId = 'com.tdchat.default'

notifee.registerForegroundService((notification):Promise<void> => {
  return new Promise(() => {
    // Long running task...react-native/docs/android/foreground-service
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const {notification, pressAction} = detail;
  console.log(
    `[onBackgroundEvent] notification id: ${notification?.id},  event type: ${EventType[type]}, press action: ${pressAction?.id}`,
  );
  // Check if the user pressed the "Mark as read" action
  if (
    type === EventType.ACTION_PRESS &&
    pressAction?.id === 'first_action_reply'
  ) {
    console.log('[onBackgroundEvent] ACTION_PRESS: first_action_reply');

    // Remove the notification
    if (notification?.id) {
      await notifee.cancelNotification(notification?.id);
    }
  }
});
// react native 权限申请 ： 自启动权限，后台通知权限
async function onDisplayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
  try {
    console.log('发送通知');

    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        asForegroundService: true,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_react_icon',
        color: '#9c27b0',
      },
    });
  } catch (error) {
    console.error(error)
  }
}

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

messaging().requestPermission().then(res=>{
  console.log(res)
})

messaging().setBackgroundMessageHandler(async(msg)=>{
  console.log(msg)
  console.log('发起通知');
  await onDisplayNotification(msg)
})

globalThis.TextEncoder = TextEncoder;
function App(): JSX.Element {
  const init = useCallback(async () => {
    const res = await SysApi.getInfo();
    globalStorage.setItem('sys-pub-key', res.pub_key);
    globalStorage.setItem('sys-static-url', res.static_url);

    // 获取firebase token
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('====================================');
    console.log('firebase token is : ', token);
    console.log('====================================');
    await notifee.createChannel({
      id: 'com.tdchat.default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH
    })
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
