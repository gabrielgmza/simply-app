/**
 * ============================================================================
 * NEW INVESTMENT SCREEN - Simply App
 * ============================================================================
 * 
 * Pantalla para crear nueva inversión con simulador de rendimientos
 * y visualización de la línea de financiación disponible.
 * 
 * PRODUCTO ESTRELLA SIMPLY:
 * - Inversión con rendimiento diario (22.08% TNA)
 * - Línea de financiación = 15% del capital
 * - Financiación 0% interés colateralizada
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

// Constantes del producto
const TNA = 0.2208; // 22.08% Tasa Nominal Anual
const TEA = 0.2460; // 24.60% Tasa Efectiva Anual
const DAILY_RATE = TNA / 365;
const FINANCING_PERCENT = 0.15; // 15% del capital invertido

const NewInvestmentScreen = () => {
  const navigation = useNavigation<any>();
  const { balance } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [amountNum, setAmountNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Animación para el resultado
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const num = parseInt(amount.replace(/\D/g, '')) || 0;
    setAmountNum(num);
    
    if (num > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [amount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatInputCurrency = (text: string) => {
    const num = text.replace(/\D/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('es-AR');
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatInputCurrency(text));
  };

  // Cálculos de proyección
  const calculateProjection = (days: number) => {
    if (amountNum <= 0) return 0;
    return amountNum * Math.pow(1 + DAILY_RATE, days) - amountNum;
  };

  const projections = {
    day30: calculateProjection(30),
    day90: calculateProjection(90),
    day180: calculateProjection(180),
    day365: calculateProjection(365),
  };

  const availableFinancing = amountNum * FINANCING_PERCENT;

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleInvest = async () => {
    if (amountNum < 10000) {
      Alert.alert('Monto mínimo', 'El monto mínimo de inversión es $10.000');
      return;
    }

    if (amountNum > (balance || 0)) {
      Alert.alert('Saldo insuficiente', 'No tenés saldo suficiente para esta inversión');
      return;
    }

    Alert.alert(
      'Confirmar inversión',
      `¿Confirmas invertir ${formatCurrency(amountNum)}?\n\nObtendrás:\n• Rendimiento diario del 22.08% TNA\n• Línea de financiación de ${formatCurrency(availableFinancing)} a 0% interés`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Invertir', 
          onPress: async () => {
            setIsLoading(true);
            // Simular llamada API
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                '¡Inversión exitosa!',
                `Tu inversión de ${formatCurrency(amountNum)} ya está generando rendimientos.`,
                [{ text: 'Ver inversión', onPress: () => navigation.goBack() }]
              );
            }, 1500);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nueva Inversión</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Info Card */}
          <LinearGradient colors={colors.gradientPrimary} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Rendimiento</Text>
                <Text style={styles.infoValue}>22.08% TNA</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Financiación</Text>
                <Text style={styles.infoValue}>15% a 0%</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Cuotas</Text>
                <Text style={styles.infoValue}>2 a 48</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cuánto querés invertir?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray400}
              />
            </View>
            <Text style={styles.balanceText}>
              Saldo disponible: {formatCurrency(balance || 125000)}
            </Text>

            {/* Quick Amounts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAmounts}>
              {quickAmounts.map((qa) => (
                <TouchableOpacity
                  key={qa}
                  style={[styles.quickAmount, amountNum === qa && styles.quickAmountActive]}
                  onPress={() => setAmount(qa.toLocaleString('es-AR'))}
                >
                  <Text style={[styles.quickAmountText, amountNum === qa && styles.quickAmountTextActive]}>
                    {formatCurrency(qa)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Projection */}
          {amountNum > 0 && (
            <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
              <Text style={styles.sectionTitle}>Proyección de rendimientos</Text>
              <View style={styles.projectionCard}>
                <View style={styles.projectionRow}>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>30 días</Text>
                    <Text style={styles.projectionValue}>+{formatCurrency(projections.day30)}</Text>
                  </View>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>90 días</Text>
                    <Text style={styles.projectionValue}>+{formatCurrency(projections.day90)}</Text>
                  </View>
                </View>
                <View style={styles.projectionRow}>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>180 días</Text>
                    <Text style={styles.projectionValue}>+{formatCurrency(projections.day180)}</Text>
                  </View>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>1 año</Text>
                    <Text style={[styles.projectionValue, { color: colors.success }]}>
                      +{formatCurrency(projections.day365)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.projectionNote}>
                  *Rendimientos proyectados basados en TNA 22.08%. Los rendimientos pasados no garantizan rendimientos futuros.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Financing Available */}
          {amountNum > 0 && (
            <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
              <Text style={styles.sectionTitle}>Financiación disponible</Text>
              <View style={styles.financingCard}>
                <View style={styles.financingHeader}>
                  <Icon name="cash" size={32} color={colors.primary} />
                  <View style={styles.financingInfo}>
                    <Text style={styles.financingAmount}>{formatCurrency(availableFinancing)}</Text>
                    <Text style={styles.financingSubtext}>a 0% de interés</Text>
                  </View>
                </View>
                <View style={styles.financingDetails}>
                  <View style={styles.financingDetail}>
                    <Icon name="checkmark-circle" size={18} color={colors.success} />
                    <Text style={styles.financingDetailText}>15% de tu inversión</Text>
                  </View>
                  <View style={styles.financingDetail}>
                    <Icon name="checkmark-circle" size={18} color={colors.success} />
                    <Text style={styles.financingDetailText}>De 2 a 48 cuotas sin interés</Text>
                  </View>
                  <View style={styles.financingDetail}>
                    <Icon name="checkmark-circle" size={18} color={colors.success} />
                    <Text style={styles.financingDetailText}>Colateralizada por tu inversión</Text>
                  </View>
                  <View style={styles.financingDetail}>
                    <Icon name="checkmark-circle" size={18} color={colors.success} />
                    <Text style={styles.financingDetailText}>Cancelación anticipada sin cargo</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {/* How it Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
            <View style={styles.howItWorks}>
              {[
                { step: 1, title: 'Invertí', desc: 'Tu capital genera rendimiento diario del 22.08% TNA' },
                { step: 2, title: 'Financiate', desc: 'Obtené hasta 15% de tu inversión a 0% interés' },
                { step: 3, title: 'Pagá en cuotas', desc: 'De 2 a 48 cuotas, se descuentan de tu saldo' },
                { step: 4, title: 'Tu inversión sigue creciendo', desc: 'Mientras pagás, tu capital sigue generando rendimientos' },
              ].map((item, index) => (
                <View key={item.step} style={styles.howItWorksItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{item.step}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.ctaButton, amountNum < 10000 && styles.ctaButtonDisabled]}
            onPress={handleInvest}
            disabled={amountNum < 10000 || isLoading}
          >
            <LinearGradient
              colors={amountNum >= 10000 ? colors.gradientPrimary : [colors.gray300, colors.gray400]}
              style={styles.ctaGradient}
            >
              {isLoading ? (
                <Text style={styles.ctaText}>Procesando...</Text>
              ) : (
                <>
                  <Text style={styles.ctaText}>
                    {amountNum >= 10000 ? `Invertir ${formatCurrency(amountNum)}` : 'Ingresá un monto (mín. $10.000)'}
                  </Text>
                  {amountNum >= 10000 && <Icon name="arrow-forward" size={20} color={colors.white} />}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  infoCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around' },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '700', color: colors.white },
  infoDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...shadows.md },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginRight: spacing.sm },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: colors.textPrimary },
  balanceText: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm, marginLeft: spacing.sm },
  quickAmounts: { marginTop: spacing.md, marginHorizontal: -spacing.base, paddingHorizontal: spacing.base },
  quickAmount: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.gray100, borderRadius: borderRadius.lg, marginRight: spacing.sm },
  quickAmountActive: { backgroundColor: colors.primary },
  quickAmountText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  quickAmountTextActive: { color: colors.white },
  projectionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  projectionRow: { flexDirection: 'row', marginBottom: spacing.md },
  projectionItem: { flex: 1, alignItems: 'center' },
  projectionLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  projectionValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  projectionNote: { fontSize: 10, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.sm },
  financingCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, borderWidth: 2, borderColor: colors.primary, ...shadows.md },
  financingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  financingInfo: { marginLeft: spacing.md },
  financingAmount: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  financingSubtext: { fontSize: 14, color: colors.success, fontWeight: '600' },
  financingDetails: { gap: spacing.sm },
  financingDetail: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  financingDetailText: { fontSize: 14, color: colors.textSecondary },
  howItWorks: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  howItWorksItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: colors.white },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  stepDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  ctaContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.base, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.gray100 },
  ctaButton: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaButtonDisabled: { opacity: 0.7 },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.white },
});

export default NewInvestmentScreen;
