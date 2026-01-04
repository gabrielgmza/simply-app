/**
 * CARD DETAIL SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const CardDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [showData, setShowData] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const card = {
    id: route.params?.id || '1',
    type: 'virtual',
    status: 'active',
    number: '4517 8901 2345 6789',
    holder: 'JUAN PEREZ',
    expiry: '12/28',
    cvv: '123',
    level: 'ORO',
    limits: { daily: 500000, monthly: 2000000, perTx: 200000 },
    spent: { daily: 45000, monthly: 320000 },
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(v);

  const handleBlock = () => {
    Alert.alert(isBlocked ? 'Desbloquear tarjeta' : 'Bloquear tarjeta', isBlocked ? '¿Querés desbloquear tu tarjeta?' : 'Tu tarjeta quedará bloqueada temporalmente. Podrás desbloquearla cuando quieras.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: isBlocked ? 'Desbloquear' : 'Bloquear', style: isBlocked ? 'default' : 'destructive', onPress: () => setIsBlocked(!isBlocked) },
    ]);
  };

  const transactions = [
    { id: '1', merchant: 'Mercado Libre', amount: -8500, date: 'Hoy 16:45' },
    { id: '2', merchant: 'Spotify', amount: -1299, date: 'Ayer 00:00' },
    { id: '3', merchant: 'Netflix', amount: -2499, date: '02 Ene' },
    { id: '4', merchant: 'Pedidos Ya', amount: -3200, date: '01 Ene' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarjeta {card.type === 'virtual' ? 'Virtual' : 'Física'}</Text>
        <TouchableOpacity style={styles.menuBtn}>
          <Icon name="ellipsis-vertical" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card Visual */}
        <View style={styles.cardContainer}>
          <LinearGradient colors={getLevelGradient(card.level)} style={styles.card}>
            {isBlocked && (
              <View style={styles.blockedOverlay}>
                <Icon name="lock-closed" size={40} color="#fff" />
                <Text style={styles.blockedText}>Tarjeta bloqueada</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>{card.type === 'virtual' ? 'VIRTUAL' : 'FÍSICA'}</Text>
              <Text style={styles.visaLogo}>VISA</Text>
            </View>
            <Text style={styles.cardNumber}>{showData ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>TITULAR</Text>
                <Text style={styles.cardValue}>{card.holder}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>VENCE</Text>
                <Text style={styles.cardValue}>{showData ? card.expiry : '••/••'}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>CVV</Text>
                <Text style={styles.cardValue}>{showData ? card.cvv : '•••'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Toggle Data */}
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowData(!showData)}>
          <Icon name={showData ? 'eye-off' : 'eye'} size={20} color={colors.primary} />
          <Text style={styles.toggleText}>{showData ? 'Ocultar datos' : 'Ver datos'}</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actions}>
          {[
            { icon: 'copy-outline', label: 'Copiar datos', onPress: () => Alert.alert('Copiado', 'Datos copiados al portapapeles') },
            { icon: isBlocked ? 'lock-open' : 'lock-closed', label: isBlocked ? 'Desbloquear' : 'Bloquear', onPress: handleBlock },
            { icon: 'settings-outline', label: 'Límites', onPress: () => {} },
            { icon: 'keypad-outline', label: 'PIN', onPress: () => Alert.alert('PIN', 'Tu PIN es: 1234') },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionItem} onPress={action.onPress}>
              <View style={styles.actionIcon}><Icon name={action.icon} size={22} color={colors.primary} /></View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Limits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Límites de consumo</Text>
          <View style={styles.limitsCard}>
            {[
              { label: 'Diario', spent: card.spent.daily, limit: card.limits.daily },
              { label: 'Mensual', spent: card.spent.monthly, limit: card.limits.monthly },
            ].map((item, i) => (
              <View key={i} style={[styles.limitRow, i > 0 && styles.limitRowBorder]}>
                <View style={styles.limitInfo}>
                  <Text style={styles.limitLabel}>{item.label}</Text>
                  <Text style={styles.limitValues}>{formatCurrency(item.spent)} / {formatCurrency(item.limit)}</Text>
                </View>
                <View style={styles.limitBar}>
                  <View style={[styles.limitBarFill, { width: `${(item.spent / item.limit) * 100}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos consumos</Text>
          <View style={styles.txCard}>
            {transactions.map((tx, i) => (
              <View key={tx.id} style={[styles.txRow, i < transactions.length - 1 && styles.txRowBorder]}>
                <View style={styles.txIcon}><Icon name="cart" size={18} color={colors.secondary} /></View>
                <View style={styles.txInfo}>
                  <Text style={styles.txMerchant}>{tx.merchant}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={styles.txAmount}>{formatCurrency(tx.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  menuBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { paddingHorizontal: 24, marginTop: 16 },
  card: { width: CARD_WIDTH, height: CARD_WIDTH * 0.63, borderRadius: 16, padding: 20, justifyContent: 'space-between', position: 'relative', ...shadows.lg },
  blockedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  blockedText: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  visaLogo: { fontSize: 24, fontWeight: '700', color: '#fff', fontStyle: 'italic' },
  cardNumber: { fontSize: 20, fontWeight: '600', color: '#fff', letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  cardValue: { fontSize: 14, fontWeight: '600', color: '#fff', marginTop: 4 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  toggleText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: colors.gray100, marginHorizontal: 16 },
  actionItem: { alignItems: 'center' },
  actionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, color: colors.textSecondary },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  limitsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  limitRow: { paddingVertical: 12 },
  limitRowBorder: { borderTopWidth: 1, borderTopColor: colors.gray100 },
  limitInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  limitLabel: { fontSize: 14, color: colors.textSecondary },
  limitValues: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  limitBar: { height: 6, backgroundColor: colors.gray200, borderRadius: 3, overflow: 'hidden' },
  limitBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  txCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  txRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  txIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${colors.secondary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  txDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
});

export default CardDetailScreen;
