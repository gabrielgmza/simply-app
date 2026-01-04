/**
 * ============================================================================
 * PAY SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const PayScreen = () => {
  const navigation = useNavigation<any>();
  const { balance, cvu, alias } = useSelector((state: RootState) => state.wallet);
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { icon: 'arrow-up-circle', label: 'Enviar', color: colors.primary, screen: 'Transfer' },
    { icon: 'arrow-down-circle', label: 'Recibir', color: colors.success, screen: 'QR' },
    { icon: 'qr-code', label: 'Pagar QR', color: colors.secondary, screen: 'ScanQR' },
    { icon: 'phone-portrait', label: 'Recargar', color: colors.info, screen: 'Recharge' },
  ];

  const services = [
    { icon: 'flash', label: 'Luz', color: '#F59E0B' },
    { icon: 'water', label: 'Agua', color: '#3B82F6' },
    { icon: 'flame', label: 'Gas', color: '#EF4444' },
    { icon: 'wifi', label: 'Internet', color: '#8B5CF6' },
    { icon: 'tv', label: 'Cable', color: '#EC4899' },
    { icon: 'car', label: 'Patente', color: '#10B981' },
    { icon: 'home', label: 'ABL', color: '#6366F1' },
    { icon: 'ellipsis-horizontal', label: 'Más', color: colors.gray500 },
  ];

  const recentContacts = [
    { id: '1', name: 'Juan Pérez', alias: 'juan.perez.mp', avatar: 'J' },
    { id: '2', name: 'María García', alias: 'maria.garcia', avatar: 'M' },
    { id: '3', name: 'Carlos López', alias: 'carlos.lopez.bna', avatar: 'C' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pagar</Text>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('Transactions')}>
            <Icon name="time-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance || 125000)}</Text>
          <View style={styles.cvuRow}>
            <Text style={styles.cvuText}>CVU: {cvu || '0000003100123456789012'}</Text>
            <TouchableOpacity><Icon name="copy-outline" size={18} color={colors.primary} /></TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar CVU, alias o contacto"
            placeholderTextColor={colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickAction} onPress={() => navigation.navigate(action.screen)}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Icon name={action.icon} size={26} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contactos frecuentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
            <TouchableOpacity style={styles.addContact}>
              <View style={styles.addContactIcon}><Icon name="add" size={24} color={colors.primary} /></View>
              <Text style={styles.addContactText}>Nuevo</Text>
            </TouchableOpacity>
            {recentContacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contact} onPress={() => navigation.navigate('Transfer', { contact })}>
                <View style={styles.contactAvatar}><Text style={styles.avatarText}>{contact.avatar}</Text></View>
                <Text style={styles.contactName} numberOfLines={1}>{contact.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pagar servicios</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceItem} onPress={() => navigation.navigate('Services')}>
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                  <Icon name={service.icon} size={24} color={service.color} />
                </View>
                <Text style={styles.serviceLabel}>{service.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.promoGradient}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>¡Pagá con QR!</Text>
              <Text style={styles.promoText}>Usá tu saldo para pagar en comercios adheridos</Text>
            </View>
            <Icon name="qr-code" size={48} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  historyBtn: { padding: spacing.sm },
  balanceCard: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.md },
  balanceLabel: { fontSize: 13, color: colors.textSecondary },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginVertical: spacing.sm },
  cvuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cvuText: { fontSize: 12, color: colors.textSecondary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.base, marginTop: spacing.lg, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, ...shadows.sm },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: spacing.sm, fontSize: 15, color: colors.textPrimary },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.xl, paddingHorizontal: spacing.base },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  quickActionLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  seeAll: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  contactsScroll: { marginHorizontal: -spacing.base, paddingHorizontal: spacing.base },
  addContact: { alignItems: 'center', marginRight: spacing.lg },
  addContactIcon: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  addContactText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  contact: { alignItems: 'center', marginRight: spacing.lg },
  contactAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  avatarText: { fontSize: 20, fontWeight: '600', color: colors.white },
  contactName: { fontSize: 12, color: colors.textSecondary, width: 60, textAlign: 'center' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItem: { width: (width - spacing.base * 2 - spacing.md * 3) / 4, alignItems: 'center', marginBottom: spacing.lg },
  serviceIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  serviceLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  promoBanner: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  promoGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 4 },
  promoText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
});

export default PayScreen;
