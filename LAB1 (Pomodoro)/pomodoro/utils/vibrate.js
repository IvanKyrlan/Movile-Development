import { Vibration } from 'react-native';

export default () => {
  console.log('Activating Vibration');
  Vibration.vibrate([500, 500, 500]);
};
