/**
 * LOGIN SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Contraseña requerida';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { token, refreshToken, user } = response.data.data;
      await AsyncStorage.setItem('@simply:token', token);
      await AsyncStorage.setItem('@simply:refreshToken', refreshToken);
      await AsyncStorage.setItem('@simply:user', JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometric = async () => {
    Alert.alert('Biometría', 'Función disponible próximamente');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Ingresá a tu cuenta Simply</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Icon name="mail-outline" size={20} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="tu@email.com" placeholderTextColor={colors.gray400}
                  value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Icon name="lock-closed-outline" size={20} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={colors.gray400}
                  value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.gray400} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.loginGradient}>
                <Text style={styles.loginText}>{isLoading ? 'Ingresando...' : 'Ingresar'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometric}>
              <Icon name="finger-print" size={24} color={colors.primary} />
              <Text style={styles.biometricText}>Ingresar con biometría</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: 16, borderWidth: 1, borderColor: 'transparent', ...shadows.sm },
  inputError: { borderColor: colors.error },
  input: { flex: 1, paddingVertical: 16, marginLeft: 12, fontSize: 16, color: colors.textPrimary },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  forgotText: { fontSize: 14, color: colors.primary, textAlign: 'right', marginBottom: 24 },
  loginBtn: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: 24 },
  loginGradient: { paddingVertical: 16, alignItems: 'center' },
  loginText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray200 },
  dividerText: { paddingHorizontal: 16, fontSize: 14, color: colors.textSecondary },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 16, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.primary },
  biometricText: { fontSize: 16, fontWeight: '500', color: colors.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 24 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});

export default LoginScreen;
