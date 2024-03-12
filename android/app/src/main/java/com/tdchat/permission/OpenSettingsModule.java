package com.tdchat.permission;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OpenSettingsModule extends ReactContextBaseJavaModule {
    @Override
    public String getName() {
        /**
* return the string name of the NativeModule which represents this class in JavaScript
* In JS access this module through React.NativeModules.OpenSettings
*/
        return "OpenSettings";
    }
    @ReactMethod
    public void openNotificationSettings(Callback cb) {
        Activity currentActivity = getCurrentActivity();
        Context context = getReactApplicationContext();
        Intent intent = new Intent();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, context.getPackageName());
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("app_package", context.getPackageName());
            intent.putExtra("app_uid", context.getApplicationInfo().uid);
        } else {
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.setData(Uri.parse("package:" + context.getPackageName()));
        }
        currentActivity.startActivity(intent);
    }
    /* constructor */
    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}
