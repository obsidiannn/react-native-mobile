>> 加密数据交换

>> POST /api/auth/qrcode

# 响应
```
{
   session_id: "xxx"
}
```

>> POST /api/auth/getQrcodeInfo

# 参数
```
{
   session_id: "xxx"
}
```

# 响应
{
   data: "加密数据"
}


>> POST /api/auth/pushQrcodeInfo

# 参数
```
{
   session_id: "xxx",
   data: "加密数据"
}
```


```shell
yarn add  @notifee/react-native
yarn add @react-native-firebase/app
yarn add @react-native-firebase/messaging 

Reverse the port that the adb device will listen on: adb reverse tcp:8081 tcp:8081

Start the Metro server on the same port: npx react-native start --port 8090

Open another admin CMD/Powershell window and run:

Start the android build/run on the same port: npx react-native run-android --port=8090

The last command should also start the emulator automatically.

If the metro server errors out after you do the run-android command, just run the npx react-native start --port 8090 again in the same window.
```

* 使用mumu模拟器联调

  ```
    mumu模拟器开启调试模式
    adb connect 127.0.0.1:7555
    adb devices
    adb reverse tcp:8081 tcp:8081

  ```