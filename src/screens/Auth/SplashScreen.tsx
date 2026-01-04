/**
 * SPLASH SCREEN - Simply App
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    await new Promise(r => setTimeout(r, 2000));
    const token = await AsyncStorage.getItem('@simply:token');
    const onboarded = await AsyncStorage.getItem('@simply:onboarded');
    if (token) navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    else if (onboarded) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    else navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <LinearGradient colors={colors.gradientPrimary} style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>S</Text></View>
        </Animated.View>
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 24 }}>
          <Text style={styles.appName}>Simply</Text>
          <Text style={styles.tagline}>Tu dinero, simplificado</Text>
        </Animated.View>
      </View>
      <Text style={styles.footer}>by PaySur</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  logoText: { fontSize: 56, fontWeight: '700', color: '#fff' },
  appName: { fontSize: 42, fontWeight: '700', color: '#fff' },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', paddingBottom: 60 },
});

export default SplashScreen;
