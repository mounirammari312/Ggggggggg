import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, I18nManager, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
} from '@expo-google-fonts/cairo';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';

import './lib/i18n';
import AppNavigator from './navigation/AppNavigator';
import { useAppStore } from './lib/store';
import { COLORS } from './lib/theme';

export default function App() {
  const { setLanguage, language } = useAppStore();
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('language');
        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedLang) {
          await setLanguage(savedLang as any);
        }
        // Set RTL for Arabic
        if (savedLang === 'ar' || !savedLang) {
          if (Platform.OS !== 'web') {
            I18nManager.forceRTL(true);
          }
        }
      } catch (e) {
        console.log('Init error:', e);
      } finally {
        setAppReady(true);
      }
    };
    initApp();
  }, []);

  if (!fontsLoaded || !appReady) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashLogo}>Businfo</Text>
        <Text style={styles.splashTagline}>منصة B2B الأولى في الجزائر</Text>
        <View style={styles.splashLoader}>
          <View style={styles.splashLoaderBar} />
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  splashLogo: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 3,
  },
  splashTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  splashLoader: {
    width: 200,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginTop: 24,
    overflow: 'hidden',
  },
  splashLoaderBar: {
    width: '60%',
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
});
