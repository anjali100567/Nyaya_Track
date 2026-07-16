import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, HelperText, Snackbar } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const [visible, setVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMSG('');
    try {
      const response = await api.post('/login', { badgeId, password });
      console.log('Login success', response.data);
      setVisible(true); // show success toast
      
      const user = response.data.user;
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigation.replace('AdminDashboard', { user });
        } else if (user.role === 'OFFICER') {
          navigation.replace('OfficerDashboard', { user });
        } else {
          navigation.replace('CitizenDashboard', { user });
        }
      }, 1000);
    } catch (error: any) {
      console.error('Login error', error.response?.data?.message || 'Login failed');
      setErrorMSG(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Gradient containing Branding */}
      <LinearGradient
        colors={['#05183E', '#8F0F1A']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.brandingContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🛡️</Text>
            </View>
            <Text style={styles.appName}>FIR & CASE</Text>
            <Text style={styles.appSubtitle}>TRACKING SYSTEM</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Login Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Officer Login</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Badge Number / ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. #123456"
              placeholderTextColor="#90A4AE"
              value={badgeId}
              onChangeText={setBadgeId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#90A4AE"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {errorMSG ? <HelperText type="error" visible={!!errorMSG}>{errorMSG}</HelperText> : null}

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            labelStyle={styles.loginButtonText}
            buttonColor="#D32F2F"
          >
            Login
          </Button>
        </View>

        <TouchableOpacity style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Need help logging in?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        Login successful! Simulating redirect...
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  headerGradient: {
    height: 320,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  safeArea: {
    flex: 1,
  },
  brandingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ECA05C' // matching the yellow tone from screenshot
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
    marginTop: -80, // Overlap the header
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    marginTop: 24,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  }
});
