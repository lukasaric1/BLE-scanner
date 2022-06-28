import React, { useState} from 'react';
import {Device, State} from 'react-native-ble-plx';
import { LogBox } from 'react-native'; 
LogBox.ignoreAllLogs(); 
import {BleManager} from 'react-native-ble-plx';
import { 
  View,
  Text,
  FlatList,
  Button,
  PermissionsAndroid } from 'react-native';



const BLE = () => {
  const manager = new BleManager();
  const [scannedDevices, setScannedDevices] = useState({});
  const [deviceCount, setDeviceCount] = useState(0);



  const requestPermission = async () => {
    const approved = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Location Permission request",
        message: "BLE scanner requires permission to get your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return (approved === PermissionsAndroid.RESULTS.GRANTED);
  }
  


  return (
      <View style={{flex:2, padding:10, }}>
        <Text style={{fontWeight: "bold", }}> Scanned Devices ({deviceCount})</Text>
        <FlatList
          data={Object.values(scannedDevices)}
          renderItem={({item}) => {
            return (<Text> {`${item.name} (${item.id})   RSSI: ${item.rssi}`}</Text>)

          }}
        />
        <Button
          title="Scan Devices"
          onPress={async () => {
            const bluetoothState = await manager.state()
            // provjera da li je bluetooth upaljen
            if (bluetoothState!=="PoweredOn") {
              alert("Bluetooth is not turned on");
              return (false);
            }
            // traženje dopuštenja za lokaciju 
            const permission = await requestPermission();
            if (permission) {
              manager.startDeviceScan(null, null, async (error, device) => {
                  if (error) {
                    console.log(error);
                    return
                  }
                  // ako pronađe uređaj
                  if (device) {
                    console.log(`${device.name} (${device.id}))} RSSI: (${device.rssi})`);
                    const newScannedDevices = scannedDevices;
                    newScannedDevices[device.id] = device;
                    await setDeviceCount(Object.keys(newScannedDevices).length);
                    await setScannedDevices(scannedDevices);
                
                  }
              });
            } 
            return (true);
          }}
        />
      </View> 
  );
};

export default BLE;