import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OfficerDashboardScreen from '../screens/OfficerDashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CitizenDashboardScreen from '../screens/CitizenDashboardScreen';

export type RootStackParamList = {
  Login: undefined;
  OfficerDashboard: { user: any };
  AdminDashboard: { user: any };
  CitizenDashboard: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="OfficerDashboard" 
        component={OfficerDashboardScreen} 
        options={{ title: 'My Assignments', headerBackVisible: false }} 
      />
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ title: 'Command Center', headerBackVisible: false }} 
      />
      <Stack.Screen 
        name="CitizenDashboard" 
        component={CitizenDashboardScreen} 
        options={{ title: 'Citizen Portal', headerBackVisible: false }} 
      />
    </Stack.Navigator>
  );
}
