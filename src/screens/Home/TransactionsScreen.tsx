/**
 * ============================================================================
 * TRANSACTIONS SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const TransactionsScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

  const transactions = [
    { id: '1', type: 'transfer_out', title: 'Transferencia a Juan Pérez', amount: -15000, date: '2025-01-04', time: '14:30', status: 'completed' },
    { id: '2', type: 'investment_return', title: 'Rendimiento FCI', amount: 83.33, date: '2025-01-03', time: '21:00', status: 'completed' },
    { id: '3', type: 'transfer_in', title: 'Transferencia de María García', amount: 25000, date: '2025-01-03', time: '10:15', status: 'completed' },
    { id: '4', type: 'card_payment', title: 'Mercado Libre', amount: -8500, date: '2025-01-02', time: '16:45', status: 'completed' },
    { id: '5', type: 'installment', title: 'Cuota 5/12 - Financiación', amount: -6250, date: '2025-01-02', time: '09:00', status: 'completed' },
    { id: '6', type: 'investment_return', title: 'Rendimiento FCI', amount: 83.28, date: '2025-01-02', time: '21:00', status: 'completed' },
    { id: '7', type: 'service', title: 'Edenor - Luz', amount: -12500, date: '2025-01-01', time: '11:20', status: 'completed' },
    { id: '8', type: 'transfer_in', title: 'Transferencia de Carlos López', amount: 50000, date: '2024-12-30', time: '15:00', status: 'completed' },
    { id: '9', type: 'investment', title: 'Nueva inversión FCI', amount: -100000, date: '2024-12-28', time: '10:00', status: 'completed' },
    { id: '10', type: 'financing', title: 'Financiación recibida', amount: 75000, date: '2024-12-28', time: '10:05', status: 'completed' },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'in') return t.amount > 0;
    if (filter === 'out') return t.amount < 0;
    return true;
  });

  const getIcon = (type: string) => {
    const icons: Record<string, { name: string; color: string }> = {
      transfer_out: { name: 'arrow-up-circle', color: colors.error },
      transfer_in: { name: 'arrow-down-circle', color: colors.success },
      investment_return: { name: 'trending-up', color: colors.success },
      investment: { name: 'trending-up', color: colors.primary },
      card_payment: { name: 'card', color: colors.secondary },
      installment: { name: 'calendar', color: colors.warning },
      service: { name: 'flash', color: colors.info },
      financing: { name: 'cash', color: colors.success },
    };
    return icons[type] || { name: 'ellipse', color: colors.gray400 };
  };

  const groupByDate = (items: typeof transactions) => {
    const groups: { [key: string]: typeof transactions } = {};
    items.forEach(item => {
      const date = item.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Hoy';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Ayer';
    return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: typeof transactions[0] }) => {
    const icon = getIcon(item.type);
    return (
      <TouchableOpacity style={styles.txRow} onPress={() => navigation.navigate('TransactionDetail', { id: item.id })}>
        <View style={[styles.txIcon, { backgroundColor: `${icon.color}15` }]}>
          <Icon name={icon.name} size={22} color={icon.color} />
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txTitle}>{item.title}</Text>
          <Text style={styles.txTime}>{item.time}</Text>
        </View>
        <Text style={[styles.txAmount, item.amount > 0 && styles.txAmountPositive]}>
          {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  const groupedData = groupByDate(filteredTransactions);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movimientos</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="filter" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'in', label: 'Ingresos' },
          { key: 'out', label: 'Egresos' },
        ].map((f) => (
          <TouchableOpacity key={f.key} style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key as any)}>
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.date}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item: group }) => (
          <View>
            <Text style={styles.dateHeader}>{formatDateHeader(group.date)}</Text>
            {group.items.map((tx) => (
              <View key={tx.id}>{renderItem({ item: tx })}</View>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  filterBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  filters: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.gray100, borderRadius: borderRadius.full },
  filterChipActive: { backgroundColor: colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  filterChipTextActive: { color: colors.white },
  dateHeader: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, backgroundColor: colors.gray50, textTransform: 'capitalize' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  txIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  txTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  txAmountPositive: { color: colors.success },
});

export default TransactionsScreen;
