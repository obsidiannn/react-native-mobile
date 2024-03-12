import messaging,{FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import notifee, { EventType,AndroidImportance } from '@notifee/react-native';
import { requestNotificationPermission } from '@/lib/permissions'
import { Platform } from 'react-native';
const channelId = 'com.tdchat.default'

export const initNotification = async ()=>{
  await initService()
  await subscribe()
}

const initService = async ()=>{
  messaging().requestPermission().then(res=>{
  })
  
  try {
    await requestNotificationPermission()
  }catch(e){
    console.log(e)
  }
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
  
  notifee.registerForegroundService((notification):Promise<void> => {
    return new Promise(() => {
      console.log('get');
      
    });
  });

}

const subscribe = async ()=>{
 
  messaging().setBackgroundMessageHandler(async(msg)=>{
    await onDisplayNotification(msg)
  })

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('onBackgroundEvent ',type,detail);
    const {notification, pressAction} = detail;
    if (
      type === EventType.ACTION_PRESS
    ) {
      console.log('[onBackgroundEvent] ACTION_PRESS: first_action_reply');
      if (notification?.id) {
        await notifee.cancelNotification(notification?.id);
      }
    }
  });

  if(Platform.OS !== 'ios'){
    notifee.onForegroundEvent(({ type, detail }) => {
      console.log('foreground event');
      
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.ACTION_PRESS:
          break;
      }
    });
  }
}

// react native 权限申请 ： 自启动权限，后台通知权限
const onDisplayNotification = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  try {
    console.log('receive');
    
    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        asForegroundService: true,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_react_icon',
        color: '#9c27b0',
        pressAction:{
          id: 'default',
          mainComponent: 'UserCard',
        }
      },
    });
  } catch (error) {
    console.error(error)
  }
}





