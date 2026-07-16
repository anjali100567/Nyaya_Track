import { AppRegistry, Platform } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  AppRegistry.runApplication('main', {
    rootTag: document.getElementById('root') ?? document.body
  });
} else {
  registerRootComponent(App);
}
