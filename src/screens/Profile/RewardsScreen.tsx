/**
 * ============================================================================
 * REWARDS SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const { width } = Dimensions.get('window');

const RewardsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  const currentLevel = user?.level || 'ORO';
  const points = 2450;
  const multiplier = currentLevel === 'PLATA' ? 1 : currentLevel === 'ORO' ? 1.25 : currentLevel === 'BLACK' ? 1.5 : 2;

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

  const rewards = [
    { id: '1', name: 'Cashback $500', description: 'Acreditación directa en tu cuenta', points: 500, icon: 'cash', color: colors.success },
    { id: '2', name: 'Cashback $1.000', description: 'Acreditación directa en tu cuenta', points: 1000, icon: 'cash', color: colors.success },
    { id: '3', name: '10% dto. Gastronomía', description: 'Válido por 30 días', points: 800, icon: 'restaurant', color: '#F59E0B' },
    { id: '4', name: '15% dto. Entretenimiento', description: 'Cines, teatros y más', points: 1200, icon: 'film', color: '#EC4899' },
    { id: '5', name: 'Tarjeta física gratis', description: 'Sin costo de emisión', points: 2000, icon: 'card', color: colors.primary },
    { id: '6', name: '1 mes sin comisiones', description: 'En todas tus operaciones', points: 3000, icon: 'star', color: '#8B5CF6' },
  ];

  const history = [
    { id: '1', type: 'earn', description: 'Compra con tarjeta - Mercado Libre', points: 150, date: '04 Ene 2025' },
    { id: '2', type: 'earn', description: 'Transferencia recibida', points: 50, date: '03 Ene 2025' },
    { id: '3', type: 'redeem', description: 'Canjeaste: Cashback $500', points: -500, date: '02 Ene 2025' },
    { id: '4', type: 'earn', description: 'Pago de servicios', points: 30, date: '01 Ene 2025' },
    { id: '5', type: 'earn', description: 'Bonus por nivel ORO', points: 200, date: '01 Ene 2025' },
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (points < reward.points) {
      Alert.alert('Puntos insuficientes', `Necesitás ${reward.points - points} puntos más para canjear este beneficio`);
      return;
    }

    Alert.alert('Canjear beneficio', `¿Querés canjear "${reward.name}" por ${reward.points} puntos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Canjear', onPress: () => Alert.alert('¡Canjeado!', `Tu beneficio "${reward.name}" ya está disponible`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <LinearGradient colors={getLevelGradient(currentLevel)} style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsLabel}>Tus puntos</Text>
              <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
            </View>
            <View style={styles.multiplierBadge}>
              <Icon name="flash" size={16} color={colors.white} />
              <Text style={styles.multiplierText}>{multiplier}x</Text>
            </View>
          </View>
          <View style={styles.pointsInfo}>
            <Icon name="information-circle" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.pointsInfoText}>
              Por cada $100 gastados ganás {Math.round(10 * multiplier)} puntos
            </Text>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'rewards' && styles.tabActive]} onPress={() => setActiveTab('rewards')}>
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.tabTextActive]}>Canjear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'history' && styles.tabActive]} onPress={() => setActiveTab('history')}>
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Historial</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'rewards' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beneficios disponibles</Text>
            <View style={styles.rewardsGrid}>
              {rewards.map((reward) => {
                const canRedeem = points >= reward.points;
                return (
                  <TouchableOpacity key={reward.id} style={[styles.rewardCard, !canRedeem && styles.rewardCardLocked]}
                    onPress={() => handleRedeem(reward)}>
                    <View style={[styles.rewardIcon, { backgroundColor: `${reward.color}15` }]}>
                      <Icon name={reward.icon} size={24} color={reward.color} />
                    </View>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    <Text style={styles.rewardDesc}>{reward.description}</Text>
                    <View style={styles.rewardPoints}>
                      <Icon name="star" size={14} color={canRedeem ? colors.primary : colors.gray400} />
                      <Text style={[styles.rewardPointsText, !canRedeem && styles.rewardPointsLocked]}>
                        {reward.points.toLocaleString()}
                      </Text>
                    </View>
                    {!canRedeem && (
                      <View style={styles.lockedOverlay}>
                        <Icon name="lock-closed" size={20} color={colors.gray400} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Movimientos de puntos</Text>
            <View style={styles.historyCard}>
              {history.map((item, index) => (
                <View key={item.id} style={[styles.historyRow, index < history.length - 1 && styles.historyBorder]}>
                  <View style={[styles.historyIcon, { backgroundColor: item.type === 'earn' ? `${colors.success}15` : `${colors.error}15` }]}>
                    <Icon name={item.type === 'earn' ? 'add' : 'remove'} size={18} color={item.type === 'earn' ? colors.success : colors.error} />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDesc}>{item.description}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text style={[styles.historyPoints, item.type === 'earn' ? styles.historyPointsEarn : styles.historyPointsRedeem]}>
                    {item.type === 'earn' ? '+' : ''}{item.points}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Icon name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Los puntos vencen 12 meses después de ser otorgados. Usá tus puntos antes de que expiren.
          </Text>
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
  pointsCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadows.lg },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  pointsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  pointsValue: { fontSize: 40, fontWeight: '700', color: colors.white },
  multiplierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  multiplierText: { fontSize: 14, fontWeight: '600', color: colors.white },
  pointsInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pointsInfoText: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.base, backgroundColor: colors.gray100, borderRadius: borderRadius.lg, padding: 4, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.white, ...shadows.sm },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  rewardCard: { width: (width - spacing.base * 2 - spacing.md) / 2, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.md, position: 'relative', ...shadows.sm },
  rewardCardLocked: { opacity: 0.6 },
  rewardIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  rewardName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  rewardDesc: { fontSize: 11, color: colors.textSecondary, marginBottom: spacing.sm },
  rewardPoints: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardPointsText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  rewardPointsLocked: { color: colors.gray400 },
  lockedOverlay: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  historyCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  historyBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  historyIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  historyInfo: { flex: 1 },
  historyDesc: { fontSize: 14, color: colors.textPrimary },
  historyDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  historyPoints: { fontSize: 15, fontWeight: '600' },
  historyPointsEarn: { color: colors.success },
  historyPointsRedeem: { color: colors.error },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: `${colors.info}10`, marginHorizontal: spacing.base, padding: spacing.md, borderRadius: borderRadius.md },
  infoText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});

export default RewardsScreen;
