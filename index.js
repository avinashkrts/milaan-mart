import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs([
    'RCTBridge',
    'State updates',
]);

AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreAllLogs()
