/**
 * FORGOT PASSWORD SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Ingresá un email válido'); return; }
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      Alert.alert('Código enviado', 'Revisá tu email para obtener el código de verificación');
      setStep('code');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Error al enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (code.length !== 6) { setError('El código debe tener 6 dígitos'); return; }
    setStep('password');
  };

  const handleResetPassword = async () => {
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword({ token: code, password });
      Alert.alert('¡Listo!', 'Tu contraseña fue actualizada', [{ text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }]);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => step === 'email' ? navigation.goBack() : setStep(step === 'code' ? 'email' : 'code')} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: step === 'password' ? `${colors.success}20` : `${colors.primary}20` }]}>
            <Icon name={step === 'email' ? 'mail' : step === 'code' ? 'keypad' : 'lock-closed'} size={40} color={step === 'password' ? colors.success : colors.primary} />
          </View>
          <Text style={styles.title}>
            {step === 'email' ? 'Recuperar contraseña' : step === 'code' ? 'Verificar código' : 'Nueva contraseña'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'email' ? 'Ingresá tu email y te enviaremos un código de verificación' : step === 'code' ? `Ingresá el código de 6 dígitos enviado a ${email}` : 'Ingresá tu nueva contraseña'}
          </Text>

          {step === 'email' && (
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color={colors.gray400} />
              <TextInput style={styles.input} placeholder="tu@email.com" placeholderTextColor={colors.gray400}
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
          )}

          {step === 'code' && (
            <View style={styles.codeContainer}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={[styles.codeBox, code[i] && styles.codeBoxFilled]}>
                  <Text style={styles.codeText}>{code[i] || ''}</Text>
                </View>
              ))}
              <TextInput style={styles.codeInput} value={code} onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad" maxLength={6} autoFocus />
            </View>
          )}

          {step === 'password' && (
            <>
              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="Nueva contraseña" placeholderTextColor={colors.gray400}
                  value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.gray400} />
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer, { marginTop: 16 }]}>
                <Icon name="lock-closed-outline" size={20} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="Confirmar contraseña" placeholderTextColor={colors.gray400}
                  value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
              </View>
            </>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.btn} disabled={isLoading}
            onPress={step === 'email' ? handleSendCode : step === 'code' ? handleVerifyCode : handleResetPassword}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
              <Text style={styles.btnText}>
                {isLoading ? 'Procesando...' : step === 'email' ? 'Enviar código' : step === 'code' ? 'Verificar' : 'Cambiar contraseña'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {step === 'code' && (
            <TouchableOpacity style={styles.resendBtn} onPress={handleSendCode}>
              <Text style={styles.resendText}>¿No recibiste el código? <Text style={styles.resendLink}>Reenviar</Text></Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: { marginLeft: 16, marginTop: 16 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: 16, ...shadows.sm },
  input: { flex: 1, paddingVertical: 16, marginLeft: 12, fontSize: 16, color: colors.textPrimary },
  codeContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, position: 'relative' },
  codeBox: { width: 48, height: 56, borderRadius: borderRadius.md, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  codeBoxFilled: { borderColor: colors.primary },
  codeText: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  codeInput: { position: 'absolute', width: '100%', height: '100%', opacity: 0 },
  errorText: { fontSize: 14, color: colors.error, textAlign: 'center', marginTop: 16 },
  btn: { borderRadius: borderRadius.lg, overflow: 'hidden', marginTop: 32 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  resendBtn: { marginTop: 24, alignItems: 'center' },
  resendText: { fontSize: 14, color: colors.textSecondary },
  resendLink: { color: colors.primary, fontWeight: '600' },
});

export default ForgotPasswordScreen;
