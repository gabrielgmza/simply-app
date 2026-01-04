/**
 * ============================================================================
 * INVEST DETAIL SCREEN - Simply App
 * ============================================================================
 * 
 * Detalle completo de una inversión mostrando:
 * - Capital invertido + Rendimientos acumulados
 * - Garantía retenida (por financiación activa)
 * - Línea de financiación disponible
 * - Historial de rendimientos
 */

import React, { useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';

import { colors, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

const InvestDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const investmentId = route.params?.id;

  // Mock data de inversión
  const investment = {
    id: investmentId || '1',
    status: 'ACTIVE',
    createdAt: '2024-11-15',
    
    // Montos
    initialAmount: 500000,
    currentAmount: 512500, // Capital + rendimientos
    totalReturns: 12500,
    
    // Financiación
    guaranteeRetained: 50000, // Retenido por financiación activa
    availableFinancing: 75000, // Disponible para nueva financiación (15% - usado)
    usedFinancing: 75000, // Financiación en uso
    
    // Rendimientos
    dailyRate: 0.0605, // 22.08% / 365
    yearlyRate: 22.08,
    
    // Historial reciente
    recentReturns: [
      { date: '2025-01-03', amount: 83.33, balance: 512500 },
      { date: '2025-01-02', amount: 83.28, balance: 512416.67 },
      { date: '2024-12-30', amount: 83.22, balance: 512333.39 },
      { date: '2024-12-27', amount: 83.17, balance: 512250.17 },
      { date: '2024-12-26', amount: 83.11, balance: 512167 },
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
      year: 'numeric',
    });
  };

  // Calcular porcentaje de rendimiento
  const returnPercent = ((investment.totalReturns / investment.initialAmount) * 100).toFixed(2);

  // Capital disponible (no retenido)
  const availableCapital = investment.currentAmount - investment.guaranteeRetained;

  const handleRedeem = () => {
    if (investment.guaranteeRetained > 0) {
      Alert.alert(
        'Garantía activa',
        `Tenés ${formatCurrency(investment.guaranteeRetained)} retenidos como garantía de financiación activa. Solo podés rescatar ${formatCurrency(availableCapital)}.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Rescatar disponible', onPress: () => {} },
        ]
      );
    } else {
      Alert.alert(
        'Rescatar inversión',
        `¿Querés rescatar ${formatCurrency(investment.currentAmount)}? El dinero estará disponible en tu cuenta en 24-48hs hábiles.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Rescatar todo', onPress: () => {} },
        ]
      );
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
          <Text style={styles.headerTitle}>Detalle de Inversión</Text>
          <TouchableOpacity style={styles.menuBtn}>
            <Icon name="ellipsis-vertical" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <LinearGradient colors={colors.gradientPrimary} style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <View>
              <Text style={styles.mainCardLabel}>Valor actual</Text>
              <Text style={styles.mainCardValue}>{formatCurrency(investment.currentAmount)}</Text>
            </View>
            <View style={styles.returnBadge}>
              <Icon name="trending-up" size={14} color={colors.success} />
              <Text style={styles.returnBadgeText}>+{returnPercent}%</Text>
            </View>
          </View>

          <View style={styles.mainCardDivider} />

          <View style={styles.mainCardDetails}>
            <View style={styles.mainCardDetail}>
              <Text style={styles.detailLabel}>Capital inicial</Text>
              <Text style={styles.detailValue}>{formatCurrency(investment.initialAmount)}</Text>
            </View>
            <View style={styles.mainCardDetail}>
              <Text style={styles.detailLabel}>Rendimientos</Text>
              <Text style={[styles.detailValue, { color: '#34D399' }]}>
                +{formatCurrency(investment.totalReturns)}
              </Text>
            </View>
          </View>

          <View style={styles.rateInfo}>
            <Text style={styles.rateText}>TNA {investment.yearlyRate}% • Rendimiento diario</Text>
          </View>
        </LinearGradient>

        {/* Guarantee & Financing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garantía y Financiación</Text>
          
          <View style={styles.guaranteeCard}>
            {/* Visual breakdown */}
            <View style={styles.breakdownContainer}>
              <View style={styles.breakdownBar}>
                <View 
                  style={[
                    styles.breakdownSegment, 
                    { 
                      flex: availableCapital / investment.currentAmount,
                      backgroundColor: colors.success,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.breakdownSegment, 
                    { 
                      flex: investment.guaranteeRetained / investment.currentAmount,
                      backgroundColor: colors.warning,
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                    }
                  ]} 
                />
              </View>
              <View style={styles.breakdownLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                  <Text style={styles.legendText}>Disponible</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.legendText}>Retenido (garantía)</Text>
                </View>
              </View>
            </View>

            <View style={styles.guaranteeRows}>
              <View style={styles.guaranteeRow}>
                <View style={styles.guaranteeRowLeft}>
                  <Icon name="wallet-outline" size={20} color={colors.success} />
                  <Text style={styles.guaranteeLabel}>Capital disponible</Text>
                </View>
                <Text style={styles.guaranteeValue}>{formatCurrency(availableCapital)}</Text>
              </View>

              <View style={styles.guaranteeRow}>
                <View style={styles.guaranteeRowLeft}>
                  <Icon name="lock-closed-outline" size={20} color={colors.warning} />
                  <Text style={styles.guaranteeLabel}>Garantía retenida</Text>
                </View>
                <Text style={styles.guaranteeValue}>{formatCurrency(investment.guaranteeRetained)}</Text>
              </View>

              <View style={styles.guaranteeDivider} />

              <View style={styles.guaranteeRow}>
                <View style={styles.guaranteeRowLeft}>
                  <Icon name="cash-outline" size={20} color={colors.primary} />
                  <Text style={styles.guaranteeLabel}>Financiación en uso</Text>
                </View>
                <Text style={styles.guaranteeValue}>{formatCurrency(investment.usedFinancing)}</Text>
              </View>

              <View style={styles.guaranteeRow}>
                <View style={styles.guaranteeRowLeft}>
                  <Icon name="add-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.guaranteeLabelBold}>Disponible para financiar</Text>
                </View>
                <Text style={styles.guaranteeValueBold}>{formatCurrency(investment.availableFinancing)}</Text>
              </View>
            </View>

            {investment.availableFinancing > 0 && (
              <TouchableOpacity 
                style={styles.financingBtn}
                onPress={() => navigation.navigate('NewFinancing')}
              >
                <Text style={styles.financingBtnText}>Solicitar financiación</Text>
                <Icon name="arrow-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Returns */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rendimientos recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.returnsCard}>
            {investment.recentReturns.map((ret, index) => (
              <View 
                key={index} 
                style={[
                  styles.returnRow,
                  index < investment.recentReturns.length - 1 && styles.returnRowBorder,
                ]}
              >
                <View style={styles.returnIcon}>
                  <Icon name="trending-up" size={16} color={colors.success} />
                </View>
                <View style={styles.returnInfo}>
                  <Text style={styles.returnDate}>{formatDate(ret.date)}</Text>
                  <Text style={styles.returnBalance}>Saldo: {formatCurrency(ret.balance)}</Text>
                </View>
                <Text style={styles.returnAmount}>+{formatCurrency(ret.amount)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoNote}>
            <Icon name="information-circle" size={16} color={colors.info} />
            <Text style={styles.infoNoteText}>
              Los rendimientos se acreditan a las 21:00 hs en días hábiles. Fines de semana y feriados se acumulan.
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información importante</Text>
          
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Icon name="shield-checkmark" size={24} color={colors.success} />
              <Text style={styles.infoCardTitle}>Garantía colateralizada</Text>
              <Text style={styles.infoCardText}>
                Tu financiación está respaldada por tu inversión. Si no pagás las cuotas, 
                se descuentan de tu garantía retenida.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Icon name="refresh" size={24} color={colors.primary} />
              <Text style={styles.infoCardTitle}>Tu inversión sigue creciendo</Text>
              <Text style={styles.infoCardText}>
                Aunque tengas financiación activa, tu capital total (incluyendo la garantía) 
                sigue generando rendimientos diarios.
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('NewInvestment')}>
              <Icon name="add-circle" size={24} color={colors.primary} />
              <Text style={styles.actionBtnText}>Invertir más</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={handleRedeem}>
              <Icon name="arrow-down-circle" size={24} color={colors.error} />
              <Text style={[styles.actionBtnText, { color: colors.error }]}>Rescatar</Text>
            </TouchableOpacity>
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
  menuBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
  mainCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mainCardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  mainCardValue: { fontSize: 32, fontWeight: '700', color: colors.white },
  returnBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  returnBadgeText: { fontSize: 14, fontWeight: '600', color: '#34D399' },
  mainCardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: spacing.md },
  mainCardDetails: { flexDirection: 'row', justifyContent: 'space-around' },
  mainCardDetail: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  detailValue: { fontSize: 18, fontWeight: '600', color: colors.white },
  rateInfo: { alignItems: 'center', marginTop: spacing.md },
  rateText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },

  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  seeAll: { fontSize: 14, color: colors.primary, fontWeight: '500' },

  guaranteeCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  breakdownContainer: { marginBottom: spacing.md },
  breakdownBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' },
  breakdownSegment: { height: '100%' },
  breakdownLegend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.textSecondary },
  guaranteeRows: { gap: spacing.sm },
  guaranteeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  guaranteeRowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  guaranteeLabel: { fontSize: 14, color: colors.textSecondary },
  guaranteeLabelBold: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  guaranteeValue: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  guaranteeValueBold: { fontSize: 16, fontWeight: '700', color: colors.primary },
  guaranteeDivider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.sm },
  financingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: `${colors.primary}10`, paddingVertical: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.md },
  financingBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  returnsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  returnRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  returnRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  returnIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: `${colors.success}15`, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  returnInfo: { flex: 1 },
  returnDate: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  returnBalance: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  returnAmount: { fontSize: 14, fontWeight: '600', color: colors.success },

  infoNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: `${colors.info}10`, padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.md },
  infoNoteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  infoCards: { gap: spacing.md },
  infoCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.sm },
  infoCardTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginTop: spacing.sm, marginBottom: spacing.xs },
  infoCardText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  actionsRow: { flexDirection: 'row', gap: spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: `${colors.primary}10`, paddingVertical: 14, borderRadius: borderRadius.lg },
  actionBtnOutline: { backgroundColor: `${colors.error}10` },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});

export default InvestDetailScreen;
