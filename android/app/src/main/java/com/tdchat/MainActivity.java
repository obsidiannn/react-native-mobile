package com.tdchat;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;

import expo.modules.ReactActivityDelegateWrapper;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import java.util.List;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TDChat";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled()));
  }


  @Override
  protected void onPause() {
    super.onPause();
    // 判断应用程序是否进入后台，如果是，则取消 Activity 的销毁
    if (isAppInBackground()) {
      moveTaskToBack(false);
    }
  }

  // 判断应用程序是否进入后台
  private boolean isAppInBackground() {
    ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
    List<ActivityManager.RunningTaskInfo> taskInfo = am.getRunningTasks(1);
    ComponentName componentInfo = taskInfo.get(0).topActivity;
    return !componentInfo.getPackageName().equals(getPackageName());
  }
}
