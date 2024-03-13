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
  await messaging().requestPermission()
  try {
    await requestNotificationPermission()
  }catch(e){
    console.log(e)
  }
  // 获取firebase token ,如果不存在，则发起注册

  const token = await messaging().getToken();
  if(!token){
    await messaging().registerDeviceForRemoteMessages()
    const newToken = await messaging().getToken()
    globalThis.token = newToken    
  }else{
    globalThis.token = token
  }

  console.log('====================================');
  console.log('firebase token : ', globalThis.token);
  console.log('====================================');

  messaging().onTokenRefresh(res=>{
    console.log('on refresh');
    globalThis.token = res
  })

  // 注册channel
  if(Platform.OS === 'android'){
    await notifee.createChannel({
      id: channelId,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH
    })
      
  }
  
  // 注册
  notifee.registerForegroundService((notification):Promise<void> => {
    return new Promise(() => {
      console.log('get');
    });
  });

}

/**
 * 提交token 与 wallet的address传至server
 */
export const sumbitToken = () => {
  if(globalThis.wallet){
    //
  } 
}

// 订阅
const subscribe = async ()=>{
  // 后台消息处理
  messaging().setBackgroundMessageHandler(async(msg)=>{
    await onDisplayNotification(msg)
  })

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('onBackgroundEvent ',type,detail);
    const {notification, pressAction} = detail;
    if (type === EventType.ACTION_PRESS) {
      console.log('[onBackgroundEvent] ACTION_PRESS: first_action_reply');
      if (notification?.id) {
        await notifee.cancelNotification(notification?.id);
      }
    }

    // if (type === EventType.APP_BLOCKED) {
    //   if(detail.blocked){
    //   }  
    // }
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


/**
 * 发送消息
 * @param message 
 */
const onDisplayNotification = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  try {
    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        asForegroundService: true,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_react_icon',
        color: '#9c27b0',
        sound: 'default',
        pressAction:{
          id: 'default',
        }
      },
    });
  } catch (error) {
    console.error(error)
  }
}





