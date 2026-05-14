package com.lab3hardware;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.nfc.NfcAdapter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class HardwareModule extends ReactContextBaseJavaModule implements SensorEventListener, ActivityEventListener {

    private SensorManager sensorManager;
    private Sensor rotationSensor;
    private ReactApplicationContext reactContext;

    HardwareModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.reactContext.addActivityEventListener(this);

        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            rotationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        }
    }

    @Override
    public String getName() {
        return "HardwareModule";
    }

    // --- LA BÀN ---
    @ReactMethod
    public void startCompass() {
        if (rotationSensor != null) {
            sensorManager.registerListener(this, rotationSensor, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @ReactMethod
    public void stopCompass() {
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
            float[] rotationMatrix = new float[9];
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
            float[] orientation = new float[3];
            SensorManager.getOrientation(rotationMatrix, orientation);

            double degree = Math.toDegrees(orientation[0]);
            if (degree < 0) {
                degree += 360;
            }

            double roundedDegree = Math.round(degree * 10.0) / 10.0;

            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("CompassUpdate", roundedDegree);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    // --- NFC ---
    @Override
    public void onNewIntent(Intent intent) {
        String action = intent.getAction();
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action) ||
                NfcAdapter.ACTION_TECH_DISCOVERED.equals(action) ||
                NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {

            byte[] tagId = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
            if (tagId != null) {
                StringBuilder sb = new StringBuilder();
                for (byte b : tagId) {
                    sb.append(String.format("%02X", b));
                }
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("NFCUpdate", sb.toString());
            }
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    }
}