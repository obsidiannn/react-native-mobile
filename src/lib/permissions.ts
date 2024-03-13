import { Alert, NativeModules, Platform } from 'react-native';
import { NotificationOption, check, Permission, PERMISSIONS, RESULTS, request, openSettings,checkNotifications ,requestNotifications, NotificationsResponse} from 'react-native-permissions';
import toast from './toast';
import RNFS from 'react-native-fs';
import { globalStorage } from '../lib/storage'

// 请求写入权限
export const requestWritePermission = async () => {
    if (Platform.OS === 'android') {
        await requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }
    return true
}
export const requestDirectoryPermission = async (): Promise<string | null> => {
    if (Platform.OS == "android") {
        if (Platform.Version >= 30) {
            const downloadDir = await RNFS.DownloadDirectoryPath;
            const dir = downloadDir + '/bobochat';
            // 创建目录
            await RNFS.mkdir(dir);
            return dir;
        } else {
            return RNFS.DownloadDirectoryPath;
        }

    }
    return null;

}
export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        requestPermission(PERMISSIONS.ANDROID.CAMERA);
    }
    return requestPermission(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
}
export const requestMicrophonePermission = async () => {
    return requestPermission(Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
}
export const requestPhotoPermission = async () => {
    return requestPermission(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
}
export const requestDocumentPermission = async () => {
    return requestPermission(Platform.OS === 'ios' ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
}

/**
 * 请求通知权限
 * @returns
 */
export const requestNotificationPermission = async () => {
    const result = await checkNotifications()
    if(result.status === RESULTS.GRANTED){
        return;   
    }
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.REMINDERS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS
    const options:NotificationOption[] = ['alert','sound','badge','provisional','providesAppSettings']
    return requestNotifications(options).then((result:NotificationsResponse) => {
        console.log('notify result = ',result.status);
        if (result.status === RESULTS.GRANTED) {
            console.log('开启权限成功')
        } else {
            if(result.status === RESULTS.BLOCKED||result.status === RESULTS.DENIED){
                if(!(globalStorage.contains(IGNORE_NOTIFY_APPLY_KEY) && globalStorage.getBoolean(IGNORE_NOTIFY_APPLY_KEY))){
                    if(Platform.OS === 'android'){
                        Alert.alert('通知开启','是否开启通知',[
                            {text:'确认',onPress:() =>  {openNotifySetting()} },
                            {text:'不再提醒',onPress:() =>  {ignoreNotifyPermissionApply()} },
                            {text:'取消',style:'cancel'}
                        ],{cancelable:false});
                    }
                }
            }
        }
    });
}
// 跳转到权限设置
const openNotifySetting = ()=>{
    const notifyModule = NativeModules.OpenSettingsModule
    notifyModule.openNotificationSettings((res)=>{
        console.log(res);
    })
}

const IGNORE_NOTIFY_APPLY_KEY = "IGNORE_NOTIFY_PERMISSION_APPLY"
// 忽略权限申请
const ignoreNotifyPermissionApply = () =>{
    globalStorage.setItem(IGNORE_NOTIFY_APPLY_KEY,true)
}

export const requestPermission = async (permission: Permission) => {
    return new Promise((resolve, reject) => {
        check(permission)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        toast('This feature is not available (on this device / in this context)');
                        reject('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        request(permission).then((result) => {
                            if (result === RESULTS.GRANTED) {
                                resolve(true);
                            } else {
                                toast(permission + ' is denied');
                                reject(permission + ' is denied');
                            }
                        });
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        resolve(true);
                        break;
                    case RESULTS.BLOCKED:
                        openSettings()
                        break;
                    default:
                        break;
                }
            })
            .catch((error) => {
                toast('Something went wrong');
                reject('Something went wrong');
            });
    });
}