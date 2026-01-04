/**
 * ============================================================================
 * NEW FINANCING SCREEN - Simply App
 * ============================================================================
 * 
 * Solicitud de financiación colateralizada a 0% interés.
 * El cliente elige monto y cantidad de cuotas (2-48).
 * 
 * PRODUCTO ESTRELLA SIMPLY:
 * - Financiación = 15% del capital invertido
 * - 0% de interés (sin scoring tradicional)
 * - Colateralizada por la inversión
 * - Cuotas se descuentan del saldo automáticamente
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const INSTALLMENT_OPTIONS = [2, 3, 6, 9, 12, 18, 24, 36, 48];

const NewFinancingScreen = () => {
  const navigation = useNavigation<any>();
  const { availableFinancing } = useSelector((state: RootState) => state.investments);
  
  // Mock: financiación disponible basada en inversión
  const maxFinancing = availableFinancing || 112500;
  
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedInstallments, setSelectedInstallments] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calcular cuota (sin interés)
  const installmentAmount = selectedAmount > 0 ? selectedAmount / selectedInstallments : 0;

  // Opciones de monto predefinidas
  const amountOptions = [
    { value: maxFinancing * 0.25, label: '25%' },
    { value: maxFinancing * 0.50, label: '50%' },
    { value: maxFinancing * 0.75, label: '75%' },
    { value: maxFinancing, label: '100%' },
  ];

  // Generar cronograma de cuotas
  const generateSchedule = () => {
    const schedule = [];
    const today = new Date();
    
    for (let i = 1; i <= Math.min(selectedInstallments, 6); i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      schedule.push({
        number: i,
        amount: installmentAmount,
        dueDate: dueDate.toLocaleDateString('es-AR'),
      });
    }
    
    return schedule;
  };

  const handleRequestFinancing = () => {
    if (selectedAmount <= 0) {
      Alert.alert('Seleccioná un monto', 'Elegí cuánto querés financiar');
      return;
    }

    Alert.alert(
      'Confirmar financiación',
      `¿Confirmas solicitar ${formatCurrency(selectedAmount)} en ${selectedInstallments} cuotas de ${formatCurrency(installmentAmount)}?\n\n• 0% de interés\n• Colateralizado por tu inversión\n• Cuotas se debitan automáticamente`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                '¡Financiación aprobada!',
                `${formatCurrency(selectedAmount)} ya están disponibles en tu cuenta.`,
                [{ text: 'Ver detalle', onPress: () => navigation.goBack() }]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Solicitar Financiación</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Available Card */}
        <LinearGradient colors={colors.gradientPrimary} style={styles.availableCard}>
          <Text style={styles.availableLabel}>Disponible para financiar</Text>
          <Text style={styles.availableAmount}>{formatCurrency(maxFinancing)}</Text>
          <View style={styles.availableInfo}>
            <Icon name="shield-checkmark" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.availableInfoText}>15% de tu inversión • 0% interés</Text>
          </View>
        </LinearGradient>

        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cuánto necesitás?</Text>
          <View style={styles.amountGrid}>
            {amountOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.amountOption,
                  selectedAmount === option.value && styles.amountOptionActive,
                ]}
                onPress={() => setSelectedAmount(option.value)}
              >
                <Text style={[
                  styles.amountOptionValue,
                  selectedAmount === option.value && styles.amountOptionValueActive,
                ]}>
                  {formatCurrency(option.value)}
                </Text>
                <Text style={[
                  styles.amountOptionLabel,
                  selectedAmount === option.value && styles.amountOptionLabelActive,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Installments Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿En cuántas cuotas?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.installmentsScroll}>
            {INSTALLMENT_OPTIONS.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.installmentOption,
                  selectedInstallments === num && styles.installmentOptionActive,
                ]}
                onPress={() => setSelectedInstallments(num)}
              >
                <Text style={[
                  styles.installmentNum,
                  selectedInstallments === num && styles.installmentNumActive,
                ]}>
                  {num}
                </Text>
                <Text style={[
                  styles.installmentLabel,
                  selectedInstallments === num && styles.installmentLabelActive,
                ]}>
                  cuotas
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary */}
        {selectedAmount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Monto solicitado</Text>
                <Text style={styles.summaryValue}>{formatCurrency(selectedAmount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cantidad de cuotas</Text>
                <Text style={styles.summaryValue}>{selectedInstallments}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Interés</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>0%</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelBold}>Cuota mensual</Text>
                <Text style={styles.summaryValueBold}>{formatCurrency(installmentAmount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelBold}>Total a pagar</Text>
                <Text style={styles.summaryValueBold}>{formatCurrency(selectedAmount)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Schedule Preview */}
        {selectedAmount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cronograma de cuotas</Text>
            <View style={styles.scheduleCard}>
              {generateSchedule().map((item) => (
                <View key={item.number} style={styles.scheduleRow}>
                  <View style={styles.scheduleNumber}>
                    <Text style={styles.scheduleNumberText}>{item.number}</Text>
                  </View>
                  <Text style={styles.scheduleDate}>{item.dueDate}</Text>
                  <Text style={styles.scheduleAmount}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}
              {selectedInstallments > 6 && (
                <View style={styles.scheduleMore}>
                  <Text style={styles.scheduleMoreText}>
                    + {selectedInstallments - 6} cuotas más de {formatCurrency(installmentAmount)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="information-circle" size={24} color={colors.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>¿Cómo funciona la financiación?</Text>
              <Text style={styles.infoText}>
                Tu financiación está respaldada por tu inversión. Las cuotas se descuentan 
                automáticamente de tu saldo disponible cada mes. Si no tenés saldo, se usa 
                tu garantía (inversión retenida).
              </Text>
            </View>
          </View>

          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Beneficios Simply</Text>
            <View style={styles.benefitsList}>
              {[
                { icon: 'checkmark-circle', text: '0% de interés, siempre' },
                { icon: 'shield-checkmark', text: 'Sin scoring tradicional' },
                { icon: 'flash', text: 'Aprobación inmediata' },
                { icon: 'refresh', text: 'Cancelá anticipadamente sin cargo' },
                { icon: 'trending-up', text: 'Tu inversión sigue generando rendimientos' },
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name={benefit.icon} size={20} color={colors.success} />
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, selectedAmount <= 0 && styles.ctaButtonDisabled]}
          onPress={handleRequestFinancing}
          disabled={selectedAmount <= 0 || isLoading}
        >
          <LinearGradient
            colors={selectedAmount > 0 ? colors.gradientPrimary : [colors.gray300, colors.gray400]}
            style={styles.ctaGradient}
          >
            {isLoading ? (
              <Text style={styles.ctaText}>Procesando...</Text>
            ) : (
              <>
                <Text style={styles.ctaText}>
                  {selectedAmount > 0 
                    ? `Solicitar ${formatCurrency(selectedAmount)}` 
                    : 'Seleccioná un monto'}
                </Text>
                {selectedAmount > 0 && <Icon name="arrow-forward" size={20} color={colors.white} />}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
        {selectedAmount > 0 && (
          <Text style={styles.ctaSubtext}>
            {selectedInstallments} cuotas de {formatCurrency(installmentAmount)} sin interés
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  availableCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg },
  availableLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.xs },
  availableAmount: { fontSize: 36, fontWeight: '700', color: colors.white, marginBottom: spacing.sm },
  availableInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  availableInfoText: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amountOption: { width: (width - spacing.base * 2 - spacing.sm) / 2, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', ...shadows.sm },
  amountOptionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  amountOptionValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  amountOptionValueActive: { color: colors.primary },
  amountOptionLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  amountOptionLabelActive: { color: colors.primary },
  installmentsScroll: { marginHorizontal: -spacing.base, paddingHorizontal: spacing.base },
  installmentOption: { width: 70, height: 70, backgroundColor: colors.surface, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm, borderWidth: 2, borderColor: 'transparent', ...shadows.sm },
  installmentOptionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  installmentNum: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  installmentNumActive: { color: colors.primary },
  installmentLabel: { fontSize: 10, color: colors.textSecondary },
  installmentLabelActive: { color: colors.primary },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.sm },
  summaryLabelBold: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  summaryValueBold: { fontSize: 18, fontWeight: '700', color: colors.primary },
  scheduleCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  scheduleNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  scheduleNumberText: { fontSize: 12, fontWeight: '700', color: colors.white },
  scheduleDate: { flex: 1, fontSize: 14, color: colors.textSecondary },
  scheduleAmount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  scheduleMore: { padding: spacing.md, alignItems: 'center', backgroundColor: colors.gray50 },
  scheduleMoreText: { fontSize: 13, color: colors.textSecondary },
  infoCard: { flexDirection: 'row', backgroundColor: `${colors.info}10`, borderRadius: borderRadius.lg, padding: spacing.base, marginBottom: spacing.md },
  infoContent: { flex: 1, marginLeft: spacing.md },
  infoTitle: { fontSize: 14, fontWeight: '600', color: colors.info, marginBottom: spacing.xs },
  infoText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  benefitsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  benefitsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  benefitsList: { gap: spacing.sm },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  benefitText: { fontSize: 14, color: colors.textSecondary },
  ctaContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.base, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.gray100 },
  ctaButton: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaButtonDisabled: { opacity: 0.7 },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.white },
  ctaSubtext: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
});

export default NewFinancingScreen;
