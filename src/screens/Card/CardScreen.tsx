/**
 * ============================================================================
 * CARD SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.base * 2;
const CARD_HEIGHT = CARD_WIDTH * 0.63;

const CardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Mock card data
  const card = {
    id: '1',
    type: 'VIRTUAL',
    number: '4517 8901 2345 6789',
    expiry: '12/27',
    cvv: '123',
    status: 'ACTIVE',
    balance: 125000,
    limit: 500000,
    spent: 75000,
  };

  const recentTransactions = [
    { id: '1', merchant: 'Mercado Libre', amount: -15000, date: 'Hoy', icon: 'cart' },
    { id: '2', merchant: 'Spotify', amount: -1299, date: 'Ayer', icon: 'musical-notes' },
    { id: '3', merchant: 'Netflix', amount: -2499, date: '2 Ene', icon: 'tv' },
  ];

  const cardActions = [
    { icon: 'eye-outline', label: 'Ver datos', action: () => setShowCardNumber(!showCardNumber) },
    { icon: 'lock-closed-outline', label: 'Bloquear', action: () => {} },
    { icon: 'settings-outline', label: 'Límites', action: () => navigation.navigate('CardLimits') },
    { icon: 'key-outline', label: 'PIN', action: () => navigation.navigate('CardPIN') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tarjeta</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CardHistory')}>
            <Icon name="time-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={getLevelGradient(user?.level || 'PLATA')}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>VISA {card.type}</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{user?.level || 'PLATA'}</Text>
              </View>
            </View>

            {/* Card Number */}
            <Text style={styles.cardNumber}>
              {showCardNumber ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
            </Text>

            {/* Card Details */}
            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.cardLabel}>TITULAR</Text>
                <Text style={styles.cardValue}>{user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>VENCE</Text>
                <Text style={styles.cardValue}>{showCardNumber ? card.expiry : '••/••'}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>CVV</Text>
                <Text style={styles.cardValue}>{showCardNumber ? card.cvv : '•••'}</Text>
              </View>
            </View>

            {/* VISA Logo */}
            <View style={styles.visaLogo}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Card Actions */}
        <View style={styles.actionsRow}>
          {cardActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionBtn} onPress={action.action}>
              <View style={styles.actionIcon}>
                <Icon name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spending Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del mes</Text>
          <View style={styles.spendingCard}>
            <View style={styles.spendingHeader}>
              <View>
                <Text style={styles.spendingLabel}>Gastado</Text>
                <Text style={styles.spendingValue}>{formatCurrency(card.spent)}</Text>
              </View>
              <View style={styles.spendingLimit}>
                <Text style={styles.spendingLabel}>Límite</Text>
                <Text style={styles.limitValue}>{formatCurrency(card.limit)}</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(card.spent / card.limit) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round((card.spent / card.limit) * 100)}% usado</Text>
            </View>
          </View>
        </View>

        {/* Request Physical Card */}
        <TouchableOpacity style={styles.requestCard} onPress={() => navigation.navigate('RequestCard', { type: 'physical' })}>
          <LinearGradient colors={['#1F2937', '#374151']} style={styles.requestGradient}>
            <View style={styles.requestIcon}>
              <Icon name="card" size={28} color={colors.white} />
            </View>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>¿Querés tu tarjeta física?</Text>
              <Text style={styles.requestSubtitle}>Pedila gratis y recibila en tu casa</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="rgba(255,255,255,0.5)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos consumos</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
          </View>
          <View style={styles.transactionsCard}>
            {recentTransactions.map((tx, index) => (
              <View key={tx.id} style={[styles.transaction, index < recentTransactions.length - 1 && styles.transactionBorder]}>
                <View style={styles.txIcon}>
                  <Icon name={tx.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txMerchant}>{tx.merchant}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={styles.txAmount}>{formatCurrency(tx.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beneficios de tu tarjeta</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <Icon name="shield-checkmark" size={24} color={colors.success} />
              <Text style={styles.benefitTitle}>Compra protegida</Text>
              <Text style={styles.benefitText}>90 días de protección</Text>
            </View>
            <View style={styles.benefitCard}>
              <Icon name="airplane" size={24} color={colors.info} />
              <Text style={styles.benefitTitle}>Viajes</Text>
              <Text style={styles.benefitText}>Seguro incluido</Text>
            </View>
            <View style={styles.benefitCard}>
              <Icon name="gift" size={24} color={colors.secondary} />
              <Text style={styles.benefitTitle}>Puntos x2</Text>
              <Text style={styles.benefitText}>En restaurantes</Text>
            </View>
            <View style={styles.benefitCard}>
              <Icon name="wallet" size={24} color={colors.warning} />
              <Text style={styles.benefitTitle}>Cashback</Text>
              <Text style={styles.benefitText}>1% en compras</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  cardContainer: { paddingHorizontal: spacing.base },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 20, padding: spacing.lg, justifyContent: 'space-between', ...shadows.xl },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  cardBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cardBadgeText: { fontSize: 11, fontWeight: '600', color: colors.white },
  cardNumber: { fontSize: 22, fontWeight: '600', color: colors.white, letterSpacing: 2, marginVertical: spacing.md },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  cardValue: { fontSize: 13, fontWeight: '600', color: colors.white },
  visaLogo: { position: 'absolute', bottom: spacing.lg, right: spacing.lg },
  visaText: { fontSize: 28, fontWeight: '700', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.xl, paddingHorizontal: spacing.base },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  actionLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  seeAll: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  spendingCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  spendingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  spendingLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  spendingValue: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  spendingLimit: { alignItems: 'flex-end' },
  limitValue: { fontSize: 18, fontWeight: '600', color: colors.textSecondary },
  progressContainer: { marginTop: spacing.sm },
  progressBar: { height: 8, backgroundColor: colors.gray200, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.textSecondary, textAlign: 'right', marginTop: 4 },
  requestCard: { marginHorizontal: spacing.base, marginBottom: spacing.lg, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  requestGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.base },
  requestIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  requestInfo: { flex: 1 },
  requestTitle: { fontSize: 15, fontWeight: '600', color: colors.white },
  requestSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  transactionsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  transaction: { flexDirection: 'row', alignItems: 'center', padding: spacing.base },
  transactionBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  txIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  txDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  benefitCard: { width: (width - spacing.base * 2 - spacing.md) / 2, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base, ...shadows.sm },
  benefitTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginTop: spacing.sm },
  benefitText: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
});

export default CardScreen;
