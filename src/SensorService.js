import { NativeModules } from 'react-native';

const { SensorModule } = NativeModules;

const startSensorService = () => {
  SensorModule.startSensorService();
};

const stopSensorService = () => {
  SensorModule.stopSensorService();
};

export { startSensorService, stopSensorService };