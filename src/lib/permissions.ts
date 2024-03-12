import { Platform } from 'react-native';
import { check, Permission, PERMISSIONS, RESULTS, request, openSettings,checkNotifications } from 'react-native-permissions';
import toast from './toast';
import { StorageAccessFramework } from 'expo-file-system';
import RNFS from 'react-native-fs';
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

export const requestNotificationPermission = async () => {
    return requestPermission(Platform.OS === 'ios' ? PERMISSIONS.IOS.REMINDERS : PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
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