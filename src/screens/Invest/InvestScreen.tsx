/**
 * ============================================================================
 * INVEST SCREEN - Simply App
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch, fetchInvestments, fetchFinancing } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const InvestScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { totalInvested, totalReturns, availableFinancing } = useSelector(
    (state: RootState) => state.investments
  );
  const { totalDebt, nextInstallment } = useSelector(
    (state: RootState) => state.financing
  );

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'investments' | 'financing'>('investments');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchInvestments()),
      dispatch(fetchFinancing()),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const mockInvestments = [
    { id: '1', amount: 500000, returns: 12500, createdAt: '2024-11-01' },
    { id: '2', amount: 250000, returns: 4800, createdAt: '2024-12-15' },
  ];

  const mockFinancing = [
    { id: '1', amount: 75000, remaining: 50000, installments: 12, paid: 4, nextDue: '2025-01-15' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inversiones</Text>
        </View>

        <LinearGradient colors={colors.gradientPrimary} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Invertido</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalInvested || 750000)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Rendimientos</Text>
              <Text style={[styles.summaryValue, { color: '#34D399' }]}>+{formatCurrency(totalReturns || 17300)}</Text>
            </View>
          </View>
          <View style={styles.rateRow}>
            <Icon name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.rateText}>TNA 22.08% • TEA 24.60%</Text>
          </View>
          <TouchableOpacity style={styles.financingRow} onPress={() => navigation.navigate('NewFinancing')}>
            <Icon name="cash-outline" size={18} color={colors.white} />
            <Text style={styles.financingText}>Financiación disponible: {formatCurrency(availableFinancing || 112500)}</Text>
            <Icon name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'investments' && styles.tabActive]} onPress={() => setActiveTab('investments')}>
            <Text style={[styles.tabText, activeTab === 'investments' && styles.tabTextActive]}>Inversiones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'financing' && styles.tabActive]} onPress={() => setActiveTab('financing')}>
            <Text style={[styles.tabText, activeTab === 'financing' && styles.tabTextActive]}>Financiación</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {activeTab === 'investments' ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('NewInvestment')}>
                <LinearGradient colors={['#10B981', '#34D399']} style={styles.actionGradient}>
                  <Icon name="add-circle" size={22} color={colors.white} />
                  <Text style={styles.actionText}>Nueva Inversión</Text>
                </LinearGradient>
              </TouchableOpacity>

              {mockInvestments.map((inv) => (
                <TouchableOpacity key={inv.id} style={styles.card} onPress={() => navigation.navigate('InvestDetail', { id: inv.id })}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIcon}><Icon name="trending-up" size={22} color={colors.primary} /></View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>FCI Money Market</Text>
                      <Text style={styles.cardSubtitle}>Desde {new Date(inv.createdAt).toLocaleDateString('es-AR')}</Text>
                    </View>
                    <View style={styles.badge}><Text style={styles.badgeText}>Activa</Text></View>
                  </View>
                  <View style={styles.cardDetails}>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Capital</Text><Text style={styles.detailValue}>{formatCurrency(inv.amount)}</Text></View>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Rendimientos</Text><Text style={[styles.detailValue, { color: colors.success }]}>+{formatCurrency(inv.returns)}</Text></View>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Actual</Text><Text style={styles.detailValue}>{formatCurrency(inv.amount + inv.returns)}</Text></View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('NewFinancing')}>
                <LinearGradient colors={colors.gradientPrimary} style={styles.actionGradient}>
                  <Icon name="cash" size={22} color={colors.white} />
                  <Text style={styles.actionText}>Solicitar Financiación</Text>
                </LinearGradient>
              </TouchableOpacity>

              {mockFinancing.map((fin) => (
                <View key={fin.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: `${colors.secondary}15` }]}><Icon name="card" size={22} color={colors.secondary} /></View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>Financiación #{fin.id}</Text>
                      <Text style={styles.cardSubtitle}>Cuota {fin.paid}/{fin.installments}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${colors.warning}15` }]}><Text style={[styles.badgeText, { color: colors.warning }]}>En curso</Text></View>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(fin.paid / fin.installments) * 100}%` }]} /></View>
                  </View>
                  <View style={styles.cardDetails}>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Original</Text><Text style={styles.detailValue}>{formatCurrency(fin.amount)}</Text></View>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Restante</Text><Text style={[styles.detailValue, { color: colors.error }]}>{formatCurrency(fin.remaining)}</Text></View>
                    <View style={styles.detail}><Text style={styles.detailLabel}>Vence</Text><Text style={styles.detailValue}>{fin.nextDue}</Text></View>
                  </View>
                  <TouchableOpacity style={styles.payBtn}><Text style={styles.payBtnText}>Pagar cuota</Text></TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  summaryCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '700', color: colors.white },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  rateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: spacing.md },
  rateText: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  financingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: borderRadius.md, padding: spacing.md },
  financingText: { flex: 1, fontSize: 13, color: colors.white, fontWeight: '500' },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.base, marginTop: spacing.lg, backgroundColor: colors.gray100, borderRadius: borderRadius.lg, padding: 4 },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.white, ...shadows.sm },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  section: { paddingHorizontal: spacing.base, paddingTop: spacing.lg },
  actionButton: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.md },
  actionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  actionText: { fontSize: 15, fontWeight: '600', color: colors.white },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, marginBottom: spacing.md, ...shadows.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  badge: { backgroundColor: `${colors.success}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.success },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray100 },
  detail: { alignItems: 'center' },
  detailLabel: { fontSize: 11, color: colors.textSecondary, marginBottom: 4 },
  detailValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  progressContainer: { marginBottom: spacing.md },
  progressBar: { height: 6, backgroundColor: colors.gray200, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  payBtn: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.sm },
  payBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },
});

export default InvestScreen;
