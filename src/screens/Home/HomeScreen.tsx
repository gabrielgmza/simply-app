/**
 * HOME SCREEN - Simply App (Dashboard Principal)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { dashboardService, bannerService } from '../../services/api';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [data, setData] = useState({
    balance: 125000,
    invested: 750000,
    returns: 18500,
    financing: 50000,
    availableFinancing: 62500,
    level: 'ORO',
    points: 2450,
  });

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

  const quickActions = [
    { icon: 'arrow-up-circle', label: 'Enviar', color: colors.primary, route: 'Transfer' },
    { icon: 'arrow-down-circle', label: 'Recibir', color: colors.success, route: 'QR' },
    { icon: 'qr-code', label: 'QR', color: colors.secondary, route: 'QR' },
    { icon: 'trending-up', label: 'Invertir', color: '#F59E0B', route: 'NewInvestment' },
  ];

  const recentTx = [
    { id: '1', title: 'Rendimiento FCI', amount: 83.33, type: 'in', time: 'Hoy 21:00' },
    { id: '2', title: 'Transferencia a Juan', amount: -15000, type: 'out', time: 'Hoy 14:30' },
    { id: '3', title: 'Mercado Libre', amount: -8500, type: 'out', time: 'Ayer 16:45' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await dashboardService.getData();
      if (response.data.data) setData(response.data.data);
    } catch (e) {}
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {user?.firstName || 'Usuario'} 👋</Text>
            <View style={styles.levelBadge}>
              <Icon name="diamond" size={12} color={data.level === 'ORO' ? '#F59E0B' : colors.primary} />
              <Text style={styles.levelText}>{data.level}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
              <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
              <Icon name="person-circle-outline" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <LinearGradient colors={getLevelGradient(data.level)} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Tu saldo disponible</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Icon name={showBalance ? 'eye' : 'eye-off'} size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{showBalance ? formatCurrency(data.balance) : '$ ••••••'}</Text>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Invertido</Text>
              <Text style={styles.balanceStatValue}>{showBalance ? formatCurrency(data.invested) : '••••'}</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Rendimientos</Text>
              <Text style={[styles.balanceStatValue, { color: '#34D399' }]}>+{showBalance ? formatCurrency(data.returns) : '••••'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.quickAction} onPress={() => navigation.navigate(action.route)}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Financing Card */}
        <TouchableOpacity style={styles.financingCard} onPress={() => navigation.navigate('Invest')}>
          <View style={styles.financingInfo}>
            <Text style={styles.financingTitle}>Financiación disponible</Text>
            <Text style={styles.financingAmount}>{formatCurrency(data.availableFinancing)}</Text>
            <Text style={styles.financingSubtext}>a 0% de interés</Text>
          </View>
          <View style={styles.financingAction}>
            <Text style={styles.financingActionText}>Solicitar</Text>
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Investment Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus inversiones</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Invest')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.investCard}>
            <View style={styles.investRow}>
              <View style={styles.investItem}>
                <Text style={styles.investLabel}>Capital invertido</Text>
                <Text style={styles.investValue}>{formatCurrency(data.invested)}</Text>
              </View>
              <View style={styles.investItem}>
                <Text style={styles.investLabel}>Rendimientos</Text>
                <Text style={[styles.investValue, { color: colors.success }]}>+{formatCurrency(data.returns)}</Text>
              </View>
            </View>
            <View style={styles.investRate}>
              <Icon name="trending-up" size={16} color={colors.success} />
              <Text style={styles.investRateText}>TNA 22.08% • Rendimiento diario</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos movimientos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.txCard}>
            {recentTx.map((tx, i) => (
              <TouchableOpacity key={tx.id} style={[styles.txRow, i < recentTx.length - 1 && styles.txRowBorder]}
                onPress={() => navigation.navigate('TransactionDetail', { id: tx.id })}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'in' ? `${colors.success}15` : `${colors.error}15` }]}>
                  <Icon name={tx.type === 'in' ? 'arrow-down' : 'arrow-up'} size={18} color={tx.type === 'in' ? colors.success : colors.error} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
                <Text style={[styles.txAmount, tx.amount > 0 && styles.txAmountPositive]}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner}>
          <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.promoGradient}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Invitá amigos y ganá $5.000</Text>
              <Text style={styles.promoSubtext}>Por cada amigo que se registre</Text>
            </View>
            <Icon name="gift" size={40} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  greeting: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  levelText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 8 },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  balanceCard: { marginHorizontal: 16, borderRadius: borderRadius.xl, padding: 20, ...shadows.lg },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#fff', marginVertical: 8 },
  balanceStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: borderRadius.md, padding: 12, marginTop: 8 },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  balanceStatValue: { fontSize: 16, fontWeight: '600', color: '#fff', marginTop: 4 },
  balanceStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, paddingHorizontal: 16 },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionLabel: { fontSize: 12, color: colors.textSecondary },
  financingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: borderRadius.xl, padding: 16, borderWidth: 1, borderColor: colors.primary, ...shadows.sm },
  financingInfo: {},
  financingTitle: { fontSize: 13, color: colors.textSecondary },
  financingAmount: { fontSize: 24, fontWeight: '700', color: colors.primary, marginVertical: 4 },
  financingSubtext: { fontSize: 12, color: colors.success },
  financingAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  financingActionText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  seeAll: { fontSize: 14, color: colors.primary },
  investCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  investRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  investItem: { alignItems: 'center' },
  investLabel: { fontSize: 12, color: colors.textSecondary },
  investValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  investRate: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: `${colors.success}10`, borderRadius: borderRadius.md, paddingVertical: 8 },
  investRateText: { fontSize: 12, color: colors.success },
  txCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  txRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  txTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  txAmountPositive: { color: colors.success },
  promoBanner: { marginHorizontal: 16, marginTop: 24, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  promoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  promoContent: {},
  promoTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  promoSubtext: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
});

export default HomeScreen;
