/**
 * REGISTER SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateForm = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: '' });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Nombre requerido';
    if (!form.lastName.trim()) e.lastName = 'Apellido requerido';
    if (!form.email) e.email = 'Email requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.phone) e.phone = 'Teléfono requerido';
    else if (form.phone.length < 10) e.phone = 'Teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = 'Contraseña requerida';
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(form.password)) e.password = 'Debe incluir mayúscula, minúscula y número';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!acceptTerms) e.terms = 'Debés aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      await authService.register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, dni: '', phone: form.phone });
      Alert.alert('¡Registro exitoso!', 'Verificá tu email para activar tu cuenta', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (key: string, label: string, icon: string, props: any = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, errors[key] && styles.inputError]}>
        <Icon name={icon} size={20} color={colors.gray400} />
        <TextInput style={styles.input} placeholderTextColor={colors.gray400} value={form[key as keyof typeof form]}
          onChangeText={(v) => updateForm(key, v)} {...props} />
        {key.includes('password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Paso {step} de 2 - {step === 1 ? 'Datos personales' : 'Seguridad'}</Text>
            <View style={styles.progress}>
              <View style={[styles.progressBar, { width: step === 1 ? '50%' : '100%' }]} />
            </View>
          </View>

          {step === 1 ? (
            <View style={styles.form}>
              {renderInput('firstName', 'Nombre', 'person-outline', { placeholder: 'Juan', autoCapitalize: 'words' })}
              {renderInput('lastName', 'Apellido', 'person-outline', { placeholder: 'Pérez', autoCapitalize: 'words' })}
              {renderInput('email', 'Email', 'mail-outline', { placeholder: 'tu@email.com', keyboardType: 'email-address', autoCapitalize: 'none' })}
              {renderInput('phone', 'Teléfono', 'call-outline', { placeholder: '1123456789', keyboardType: 'phone-pad' })}
              <TouchableOpacity style={styles.btn} onPress={handleNext}>
                <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
                  <Text style={styles.btnText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              {renderInput('password', 'Contraseña', 'lock-closed-outline', { placeholder: '••••••••', secureTextEntry: !showPassword })}
              {renderInput('confirmPassword', 'Confirmar contraseña', 'lock-closed-outline', { placeholder: '••••••••', secureTextEntry: !showPassword })}
              
              <View style={styles.requirements}>
                <Text style={styles.reqTitle}>La contraseña debe tener:</Text>
                {['Mínimo 8 caracteres', 'Una letra mayúscula', 'Una letra minúscula', 'Un número'].map((r, i) => (
                  <View key={i} style={styles.reqItem}>
                    <Icon name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.reqText}>{r}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptTerms(!acceptTerms)}>
                <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                  {acceptTerms && <Icon name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.termsText}>Acepto los <Text style={styles.termsLink}>Términos y Condiciones</Text> y la <Text style={styles.termsLink}>Política de Privacidad</Text></Text>
              </TouchableOpacity>
              {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

              <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={isLoading}>
                <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
                  <Text style={styles.btnText}>{isLoading ? 'Registrando...' : 'Crear cuenta'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Iniciá sesión</Text>
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
  backBtn: { marginTop: 16 },
  header: { marginTop: 24, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
  progress: { height: 4, backgroundColor: colors.gray200, borderRadius: 2, marginTop: 16 },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: 16, borderWidth: 1, borderColor: 'transparent', ...shadows.sm },
  inputError: { borderColor: colors.error },
  input: { flex: 1, paddingVertical: 16, marginLeft: 12, fontSize: 16, color: colors.textPrimary },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  requirements: { backgroundColor: colors.gray50, borderRadius: borderRadius.md, padding: 16, marginBottom: 20 },
  reqTitle: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  reqText: { fontSize: 13, color: colors.textSecondary },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.gray300, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  termsLink: { color: colors.primary },
  btn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 24 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});

export default RegisterScreen;
