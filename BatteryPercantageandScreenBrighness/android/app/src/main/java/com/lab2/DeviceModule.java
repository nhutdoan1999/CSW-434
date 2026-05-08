package com.lab2;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeviceModule extends ReactContextBaseJavaModule {

    DeviceModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceModule";
    }

    // Exercise 1: Use BatteryManager API to fetch battery percentage
    @ReactMethod
    public void getBatteryLevel(Promise promise) {
        try {
            Intent intent = getReactApplicationContext().registerReceiver(null,
                    new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
            if (intent != null) {
                int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                float batteryPct = level / (float) scale;
                promise.resolve((int) (batteryPct * 100));
            } else {
                promise.resolve(0);
            }
        } catch (Exception e) {
            promise.reject("BATTERY_ERR", e.getMessage());
        }
    }

    // Exercise 2: Adjust screen brightness using WindowManager.LayoutParams[cite:
    // 2]
    @ReactMethod
    public void setBrightness(float brightness) {
        final Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                WindowManager.LayoutParams layoutParams = activity.getWindow().getAttributes();
                layoutParams.screenBrightness = brightness; // Giá trị từ 0.0 - 1.0
                activity.getWindow().setAttributes(layoutParams);
            });
        }
    }
}