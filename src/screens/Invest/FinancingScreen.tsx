/**
 * ============================================================================
 * FINANCING SCREEN - Simply App
 * ============================================================================
 * 
 * Detalle de financiación activa mostrando:
 * - Estado de la financiación
 * - Cronograma completo de cuotas
 * - Garantía asociada
 * - Opciones de pago anticipado
 * 
 * MODELO SIMPLY:
 * - 0% interés
 * - Cuotas se debitan automáticamente
 * - Cancelación anticipada libera garantía
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { colors, spacing, borderRadius, shadows } from '../../theme';

const FinancingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const financingId = route.params?.id;

  // Mock data de financiación
  const financing = {
    id: financingId || '1',
    status: 'ACTIVE',
    createdAt: '2024-12-01',
    
    // Montos
    originalAmount: 75000,
    remainingAmount: 50000,
    paidAmount: 25000,
    
    // Cuotas
    totalInstallments: 12,
    paidInstallments: 4,
    installmentAmount: 6250,
    
    // Garantía
    guaranteeAmount: 75000, // Retenido en inversión
    relatedInvestmentId: '1',
    
    // Cronograma
    installments: [
      { number: 1, amount: 6250, dueDate: '2024-12-15', status: 'PAID', paidDate: '2024-12-15' },
      { number: 2, amount: 6250, dueDate: '2025-01-15', status: 'PAID', paidDate: '2025-01-14' },
      { number: 3, amount: 6250, dueDate: '2025-02-15', status: 'PAID', paidDate: '2025-02-15' },
      { number: 4, amount: 6250, dueDate: '2025-03-15', status: 'PAID', paidDate: '2025-03-13' },
      { number: 5, amount: 6250, dueDate: '2025-04-15', status: 'PENDING' },
      { number: 6, amount: 6250, dueDate: '2025-05-15', status: 'PENDING' },
      { number: 7, amount: 6250, dueDate: '2025-06-15', status: 'PENDING' },
      { number: 8, amount: 6250, dueDate: '2025-07-15', status: 'PENDING' },
      { number: 9, amount: 6250, dueDate: '2025-08-15', status: 'PENDING' },
      { number: 10, amount: 6250, dueDate: '2025-09-15', status: 'PENDING' },
      { number: 11, amount: 6250, dueDate: '2025-10-15', status: 'PENDING' },
      { number: 12, amount: 6250, dueDate: '2025-11-15', status: 'PENDING' },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const progressPercent = (financing.paidInstallments / financing.totalInstallments) * 100;

  // Próxima cuota
  const nextInstallment = financing.installments.find(i => i.status === 'PENDING');

  const handlePayNext = () => {
    if (!nextInstallment) return;
    
    Alert.alert(
      'Pagar cuota',
      `¿Confirmas pagar la cuota ${nextInstallment.number} de ${formatCurrency(nextInstallment.amount)}?\n\nSe descontará de tu saldo disponible.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Pagar', onPress: () => {} },
      ]
    );
  };

  const handlePayAll = () => {
    Alert.alert(
      'Cancelar financiación',
      `¿Querés pagar todas las cuotas restantes?\n\nTotal a pagar: ${formatCurrency(financing.remainingAmount)}\n\nEsto liberará tu garantía de ${formatCurrency(financing.guaranteeAmount)} retenida en tu inversión.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Pagar todo', onPress: () => {} },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return colors.success;
      case 'PENDING': return colors.gray400;
      case 'OVERDUE': return colors.error;
      default: return colors.gray400;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return 'checkmark-circle';
      case 'PENDING': return 'time-outline';
      case 'OVERDUE': return 'alert-circle';
      default: return 'ellipse-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Financiación #{financing.id}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Card */}
        <LinearGradient colors={colors.gradientPrimary} style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <View>
              <Text style={styles.mainCardLabel}>Monto restante</Text>
              <Text style={styles.mainCardValue}>{formatCurrency(financing.remainingAmount)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Activa</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {financing.paidInstallments} de {financing.totalInstallments} cuotas pagadas
            </Text>
          </View>

          <View style={styles.mainCardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Original</Text>
              <Text style={styles.statValue}>{formatCurrency(financing.originalAmount)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pagado</Text>
              <Text style={styles.statValue}>{formatCurrency(financing.paidAmount)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Interés</Text>
              <Text style={[styles.statValue, { color: '#34D399' }]}>0%</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Next Installment */}
        {nextInstallment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próxima cuota</Text>
            <View style={styles.nextInstallmentCard}>
              <View style={styles.nextInstallmentInfo}>
                <View>
                  <Text style={styles.nextInstallmentNumber}>
                    Cuota {nextInstallment.number} de {financing.totalInstallments}
                  </Text>
                  <Text style={styles.nextInstallmentDate}>
                    Vence el {formatDate(nextInstallment.dueDate)}
                  </Text>
                </View>
                <Text style={styles.nextInstallmentAmount}>
                  {formatCurrency(nextInstallment.amount)}
                </Text>
              </View>
              <TouchableOpacity style={styles.payButton} onPress={handlePayNext}>
                <Text style={styles.payButtonText}>Pagar ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Guarantee Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garantía</Text>
          <View style={styles.guaranteeCard}>
            <View style={styles.guaranteeRow}>
              <View style={styles.guaranteeRowLeft}>
                <Icon name="lock-closed" size={20} color={colors.warning} />
                <Text style={styles.guaranteeLabel}>Monto retenido</Text>
              </View>
              <Text style={styles.guaranteeValue}>{formatCurrency(financing.guaranteeAmount)}</Text>
            </View>
            <Text style={styles.guaranteeNote}>
              Esta garantía está retenida en tu inversión y se libera a medida que pagás las cuotas.
            </Text>
            <TouchableOpacity 
              style={styles.viewInvestmentBtn}
              onPress={() => navigation.navigate('InvestDetail', { id: financing.relatedInvestmentId })}
            >
              <Text style={styles.viewInvestmentText}>Ver inversión relacionada</Text>
              <Icon name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cronograma de cuotas</Text>
          <View style={styles.scheduleCard}>
            {financing.installments.map((installment, index) => (
              <View 
                key={installment.number}
                style={[
                  styles.scheduleRow,
                  index < financing.installments.length - 1 && styles.scheduleRowBorder,
                ]}
              >
                <View style={styles.scheduleLeft}>
                  <Icon 
                    name={getStatusIcon(installment.status)} 
                    size={20} 
                    color={getStatusColor(installment.status)} 
                  />
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleNumber}>Cuota {installment.number}</Text>
                    <Text style={styles.scheduleDate}>
                      {installment.status === 'PAID' 
                        ? `Pagada el ${formatDate(installment.paidDate!)}` 
                        : `Vence ${formatDate(installment.dueDate)}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.scheduleRight}>
                  <Text style={[
                    styles.scheduleAmount,
                    installment.status === 'PAID' && styles.scheduleAmountPaid,
                  ]}>
                    {formatCurrency(installment.amount)}
                  </Text>
                  {installment.status === 'PAID' && (
                    <Text style={styles.scheduleStatus}>Pagada</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pay All Option */}
        <View style={styles.section}>
          <View style={styles.payAllCard}>
            <View style={styles.payAllInfo}>
              <Icon name="flash" size={24} color={colors.primary} />
              <View style={styles.payAllText}>
                <Text style={styles.payAllTitle}>¿Querés cancelar anticipadamente?</Text>
                <Text style={styles.payAllSubtitle}>
                  Pagá las {financing.totalInstallments - financing.paidInstallments} cuotas restantes y liberá tu garantía
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.payAllButton} onPress={handlePayAll}>
              <Text style={styles.payAllButtonText}>
                Pagar {formatCurrency(financing.remainingAmount)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>
              Las cuotas se debitan automáticamente de tu saldo disponible en la fecha de vencimiento. 
              Si no tenés saldo, se usa tu garantía retenida. No hay intereses por mora.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },

  mainCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  mainCardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  mainCardValue: { fontSize: 32, fontWeight: '700', color: colors.white },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { fontSize: 12, fontWeight: '600', color: colors.white },
  progressSection: { marginBottom: spacing.md },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: spacing.xs, textAlign: 'center' },
  mainCardStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: borderRadius.md, padding: spacing.md },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600', color: colors.white },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },

  nextInstallmentCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, borderWidth: 2, borderColor: colors.primary, ...shadows.md },
  nextInstallmentInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  nextInstallmentNumber: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  nextInstallmentDate: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  nextInstallmentAmount: { fontSize: 22, fontWeight: '700', color: colors.primary },
  payButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  payButtonText: { fontSize: 15, fontWeight: '600', color: colors.white },

  guaranteeCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  guaranteeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  guaranteeRowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  guaranteeLabel: { fontSize: 14, color: colors.textSecondary },
  guaranteeValue: { fontSize: 16, fontWeight: '600', color: colors.warning },
  guaranteeNote: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.md },
  viewInvestmentBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: `${colors.primary}10`, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  viewInvestmentText: { fontSize: 14, fontWeight: '500', color: colors.primary },

  scheduleCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  scheduleLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  scheduleInfo: {},
  scheduleNumber: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  scheduleDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  scheduleRight: { alignItems: 'flex-end' },
  scheduleAmount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  scheduleAmountPaid: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  scheduleStatus: { fontSize: 11, color: colors.success, marginTop: 2 },

  payAllCard: { backgroundColor: `${colors.primary}10`, borderRadius: borderRadius.xl, padding: spacing.base },
  payAllInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  payAllText: { flex: 1 },
  payAllTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  payAllSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  payAllButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  payAllButtonText: { fontSize: 15, fontWeight: '600', color: colors.white },

  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: `${colors.info}10`, padding: spacing.md, borderRadius: borderRadius.md },
  infoText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});

export default FinancingScreen;
