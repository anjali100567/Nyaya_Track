import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

// Initialize mock API adapter
import './src/services/mockAdapter';

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
