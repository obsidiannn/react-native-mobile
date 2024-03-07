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
import messaging,{FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import notifee, { EventType,AndroidImportance } from '@notifee/react-native';
// import { Notifications } from 'react-native-notifications';
const requestUserPermission = async () => {

};

const onMessageReceived = (message:any) => {
  // Notifications.postLocalNotification({
  //   title: message.notification.title,
  //   body: message.notification.body,
  //   extra: message.data,
  // });
  console.log('====================================');
  console.log(message.notification);
  console.log('====================================');
};

const channelId = 'com.tdchat.default'
async function onDisplayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
  try {
    console.log('on background message');
    
    await notifee.displayNotification({
      id: message.messageId,
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        asForegroundService: true,
        importance: AndroidImportance.HIGH,
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

 // Create a channel (required for Android)
messaging().onMessage(onMessageReceived)

messaging().setBackgroundMessageHandler(async(msg)=>{
  console.log(msg) 
  console.log('发起通知');
  
  await onDisplayNotification(msg)
})

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   const { notification, pressAction } = detail;

//   // Check if the user pressed the "Mark as read" action
//   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
//     // Update external API
//     await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
//       method: 'POST',
//     });

//     // Remove the notification
//     await notifee.cancelNotification(notification.id);
//   }
// });


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
    console.log('====================================');
    const _channelId = await notifee.createChannel({
      id: 'com.tdchat.default',
      name: 'Default Channel',
    })

    // notifee.registerForegroundService(() => {
    //   return new Promise(() => {
    //     // Example task subscriber
    //     onTaskUpdate(task => {
    //       if (task.complete) {
    //           notifee.stopForegroundService()
    //       }
    //     });
    //   });
    // });
    
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
