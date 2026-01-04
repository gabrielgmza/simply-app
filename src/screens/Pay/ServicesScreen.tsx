/**
 * ============================================================================
 * SERVICES SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const ServicesScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  const categories = [
    { id: 'luz', name: 'Luz', icon: 'flash', color: '#F59E0B' },
    { id: 'agua', name: 'Agua', icon: 'water', color: '#3B82F6' },
    { id: 'gas', name: 'Gas', icon: 'flame', color: '#EF4444' },
    { id: 'internet', name: 'Internet', icon: 'wifi', color: '#8B5CF6' },
    { id: 'cable', name: 'Cable', icon: 'tv', color: '#EC4899' },
    { id: 'telefono', name: 'Teléfono', icon: 'call', color: '#10B981' },
    { id: 'patente', name: 'Patente', icon: 'car', color: '#6366F1' },
    { id: 'abl', name: 'ABL', icon: 'home', color: '#14B8A6' },
    { id: 'impuestos', name: 'Impuestos', icon: 'document', color: '#64748B' },
    { id: 'seguros', name: 'Seguros', icon: 'shield', color: '#F97316' },
    { id: 'educacion', name: 'Educación', icon: 'school', color: '#06B6D4' },
    { id: 'otros', name: 'Otros', icon: 'ellipsis-horizontal', color: '#9CA3AF' },
  ];

  const services: Record<string, any[]> = {
    luz: [
      { id: '1', name: 'Edenor', logo: 'E' },
      { id: '2', name: 'Edesur', logo: 'ES' },
      { id: '3', name: 'EPEC', logo: 'EP' },
    ],
    gas: [
      { id: '4', name: 'Metrogas', logo: 'M' },
      { id: '5', name: 'Naturgy', logo: 'N' },
      { id: '6', name: 'Camuzzi', logo: 'C' },
    ],
    internet: [
      { id: '7', name: 'Fibertel', logo: 'F' },
      { id: '8', name: 'Telecentro', logo: 'T' },
      { id: '9', name: 'Movistar', logo: 'M' },
      { id: '10', name: 'Personal', logo: 'P' },
    ],
    agua: [
      { id: '11', name: 'AySA', logo: 'A' },
    ],
  };

  const recentServices = [
    { id: 'r1', name: 'Edenor', category: 'Luz', lastPaid: '12/2024', amount: 12500 },
    { id: 'r2', name: 'Metrogas', category: 'Gas', lastPaid: '12/2024', amount: 8900 },
    { id: 'r3', name: 'Fibertel', category: 'Internet', lastPaid: '01/2025', amount: 15000 },
  ];

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

  const handleSelectService = (service: any) => {
    Alert.prompt(
      `Pagar ${service.name}`,
      'Ingresá el número de cliente o código de pago',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Buscar', onPress: (value) => {
          if (value) {
            Alert.alert('Factura encontrada', `${service.name}\nCliente: ${value}\nMonto: $15.890\nVencimiento: 15/01/2025`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Pagar', onPress: () => {
                Alert.alert('¡Pago exitoso!', `Pagaste $15.890 a ${service.name}`);
              }}
            ]);
          }
        }}
      ],
      'plain-text'
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
          <Text style={styles.headerTitle}>Pagar Servicios</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.gray400} />
          <TextInput style={styles.searchInput} placeholder="Buscar servicio..." placeholderTextColor={colors.gray400}
            value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Recent Services */}
        {recentServices.length > 0 && !selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagos recientes</Text>
            {recentServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.recentRow} onPress={() => handleSelectService(service)}>
                <View style={styles.recentIcon}>
                  <Icon name="flash" size={20} color={colors.primary} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{service.name}</Text>
                  <Text style={styles.recentCategory}>{service.category} • Último pago: {service.lastPaid}</Text>
                </View>
                <Text style={styles.recentAmount}>{formatCurrency(service.amount)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categories */}
        {!selectedCategory ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.categoryItem}
                  onPress={() => setSelectedCategory(cat.id)}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                    <Icon name={cat.icon} size={24} color={cat.color} />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity style={styles.backToCategories} onPress={() => setSelectedCategory(null)}>
              <Icon name="arrow-back" size={20} color={colors.primary} />
              <Text style={styles.backToCategoriesText}>Volver a categorías</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              {categories.find(c => c.id === selectedCategory)?.name || 'Servicios'}
            </Text>

            <View style={styles.servicesList}>
              {(services[selectedCategory] || []).map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceRow} onPress={() => handleSelectService(service)}>
                  <View style={styles.serviceLogo}>
                    <Text style={styles.serviceLogoText}>{service.logo}</Text>
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Icon name="chevron-forward" size={20} color={colors.gray400} />
                </TouchableOpacity>
              ))}

              {(!services[selectedCategory] || services[selectedCategory].length === 0) && (
                <View style={styles.emptyState}>
                  <Icon name="search" size={40} color={colors.gray300} />
                  <Text style={styles.emptyText}>No hay servicios disponibles en esta categoría</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Scan barcode */}
        <TouchableOpacity style={styles.scanCard}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.scanGradient}>
            <Icon name="barcode-outline" size={32} color={colors.white} />
            <View style={styles.scanInfo}>
              <Text style={styles.scanTitle}>Escanear código de barras</Text>
              <Text style={styles.scanSubtitle}>Pagá cualquier factura escaneando el código</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="rgba(255,255,255,0.5)" />
          </LinearGradient>
        </TouchableOpacity>

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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, marginBottom: spacing.lg, ...shadows.sm },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: spacing.sm, fontSize: 15, color: colors.textPrimary },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  recentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.sm },
  recentIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  recentCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  recentAmount: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryItem: { width: '22%', alignItems: 'center' },
  categoryIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  categoryName: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  backToCategories: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  backToCategoriesText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  servicesList: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  serviceRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  serviceLogo: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  serviceLogoText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  serviceName: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  emptyState: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' },
  scanCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  scanGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  scanInfo: { flex: 1, marginLeft: spacing.md },
  scanTitle: { fontSize: 16, fontWeight: '600', color: colors.white },
  scanSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});

export default ServicesScreen;
