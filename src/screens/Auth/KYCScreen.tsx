/**
 * KYC SCREEN - Simply App (Integración didit)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { onboardingService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

type KYCStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

const KYCScreen = () => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<KYCStatus>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      const response = await onboardingService.checkKYCStatus();
      setStatus(response.data.data.status);
    } catch (error) {
      setStatus('pending');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartKYC = async () => {
    setIsStarting(true);
    try {
      const response = await onboardingService.startKYC();
      const { verificationUrl } = response.data.data;
      
      // Abrir URL de didit en navegador externo
      const supported = await Linking.canOpenURL(verificationUrl);
      if (supported) {
        await Linking.openURL(verificationUrl);
        setStatus('in_progress');
      } else {
        Alert.alert('Error', 'No se pudo abrir el proceso de verificación');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudo iniciar la verificación');
    } finally {
      setIsStarting(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    checkKYCStatus();
  };

  const steps = [
    { id: 1, title: 'Foto del DNI (frente)', icon: 'card', desc: 'Foto clara del frente de tu DNI' },
    { id: 2, title: 'Foto del DNI (dorso)', icon: 'card-outline', desc: 'Foto clara del dorso de tu DNI' },
    { id: 3, title: 'Selfie de verificación', icon: 'person-circle', desc: 'Foto de tu rostro mirando a cámara' },
    { id: 4, title: 'Prueba de vida', icon: 'videocam', desc: 'Video corto siguiendo instrucciones' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Verificando estado...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificación de identidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {status === 'pending' && (
          <>
            <View style={styles.iconContainer}>
              <Icon name="shield-checkmark" size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>Verificá tu identidad</Text>
            <Text style={styles.subtitle}>
              Para operar en Simply necesitamos verificar tu identidad. Es un proceso simple y seguro.
            </Text>

            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>¿Qué necesitás?</Text>
              {steps.map((step) => (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepIcon}>
                    <Icon name={step.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Icon name="time-outline" size={20} color={colors.info} />
              <Text style={styles.infoText}>El proceso toma aproximadamente 2 minutos</Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleStartKYC} disabled={isStarting}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
                {isStarting ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.btnText}>Comenzar verificación</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {status === 'in_progress' && (
          <>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}20` }]}>
              <Icon name="hourglass" size={64} color={colors.warning} />
            </View>
            <Text style={styles.title}>Verificación en proceso</Text>
            <Text style={styles.subtitle}>
              Estamos revisando tu documentación. Este proceso puede tomar hasta 24 horas hábiles.
            </Text>

            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Icon name="checkmark-circle" size={24} color={colors.success} />
                <Text style={styles.statusText}>Documentos recibidos</Text>
              </View>
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={colors.warning} />
                <Text style={styles.statusText}>En revisión...</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
              <Icon name="refresh" size={20} color={colors.primary} />
              <Text style={styles.refreshText}>Actualizar estado</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'approved' && (
          <>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.success}20` }]}>
              <Icon name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.title}>¡Identidad verificada!</Text>
            <Text style={styles.subtitle}>Tu cuenta está lista para operar. Ya podés invertir, transferir y más.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
                <Text style={styles.btnText}>Ir a Simply</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {status === 'rejected' && (
          <>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.error}20` }]}>
              <Icon name="close-circle" size={64} color={colors.error} />
            </View>
            <Text style={styles.title}>Verificación rechazada</Text>
            <Text style={styles.subtitle}>
              No pudimos verificar tu identidad. Por favor intentá nuevamente asegurándote de que las fotos sean claras.
            </Text>
            <TouchableOpacity style={styles.btn} onPress={handleStartKYC}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.btnGradient}>
                <Text style={styles.btnText}>Reintentar verificación</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  content: { flex: 1, paddingHorizontal: 24 },
  iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${colors.primary}20`, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 32, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  stepsContainer: { marginTop: 32, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  stepsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  stepDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${colors.info}15`, borderRadius: borderRadius.md, padding: 12, marginTop: 16 },
  infoText: { fontSize: 13, color: colors.info },
  btn: { borderRadius: borderRadius.lg, overflow: 'hidden', marginTop: 32 },
  btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  statusCard: { marginTop: 32, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 20, ...shadows.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  statusText: { fontSize: 15, color: colors.textPrimary },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  refreshText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
});

export default KYCScreen;
