/**
 * REQUEST CARD SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { cardService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const RequestCardScreen = () => {
  const navigation = useNavigation<any>();
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual');
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', number: '', floor: '', city: '', province: '', postalCode: '' });

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      if (cardType === 'virtual') {
        await cardService.requestVirtual();
        Alert.alert('¡Tarjeta creada!', 'Tu tarjeta virtual ya está lista para usar', [
          { text: 'Ver tarjeta', onPress: () => navigation.goBack() }
        ]);
      } else {
        if (!address.street || !address.number || !address.city) {
          Alert.alert('Error', 'Completá la dirección de envío');
          setIsLoading(false);
          return;
        }
        await cardService.requestPhysical({ deliveryAddress: address });
        Alert.alert('¡Pedido realizado!', 'Tu tarjeta llegará en 7-10 días hábiles', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'No se pudo procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = cardType === 'virtual' ? [
    { icon: 'flash', text: 'Disponible al instante' },
    { icon: 'cart', text: 'Compras online' },
    { icon: 'phone-portrait', text: 'Apple Pay / Google Pay' },
    { icon: 'shield-checkmark', text: 'Máxima seguridad' },
  ] : [
    { icon: 'card', text: 'Tarjeta VISA física' },
    { icon: 'storefront', text: 'Compras en comercios' },
    { icon: 'cash', text: 'Retiros en cajeros' },
    { icon: 'globe', text: 'Uso internacional' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar tarjeta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Card Type Selection */}
        <View style={styles.typeSelection}>
          <TouchableOpacity style={[styles.typeCard, cardType === 'virtual' && styles.typeCardActive]} onPress={() => setCardType('virtual')}>
            <Icon name="phone-portrait" size={32} color={cardType === 'virtual' ? colors.primary : colors.gray400} />
            <Text style={[styles.typeTitle, cardType === 'virtual' && styles.typeTitleActive]}>Virtual</Text>
            <Text style={styles.typeSubtitle}>Inmediata y gratis</Text>
            {cardType === 'virtual' && <View style={styles.typeCheck}><Icon name="checkmark" size={14} color="#fff" /></View>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.typeCard, cardType === 'physical' && styles.typeCardActive]} onPress={() => setCardType('physical')}>
            <Icon name="card" size={32} color={cardType === 'physical' ? colors.primary : colors.gray400} />
            <Text style={[styles.typeTitle, cardType === 'physical' && styles.typeTitleActive]}>Física</Text>
            <Text style={styles.typeSubtitle}>Envío a domicilio</Text>
            {cardType === 'physical' && <View style={styles.typeCheck}><Icon name="checkmark" size={14} color="#fff" /></View>}
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Beneficios</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Icon name={b.icon} size={20} color={colors.success} />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address (for physical) */}
        {cardType === 'physical' && (
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Dirección de envío</Text>
            <View style={styles.addressForm}>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Calle</Text>
                  <TextInput style={styles.input} placeholder="Av. Corrientes" placeholderTextColor={colors.gray400}
                    value={address.street} onChangeText={(v) => setAddress({ ...address, street: v })} />
                </View>
                <View style={[styles.inputGroup, { flex: 0.4 }]}>
                  <Text style={styles.inputLabel}>Número</Text>
                  <TextInput style={styles.input} placeholder="1234" placeholderTextColor={colors.gray400}
                    value={address.number} onChangeText={(v) => setAddress({ ...address, number: v })} keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 0.4 }]}>
                  <Text style={styles.inputLabel}>Piso/Depto</Text>
                  <TextInput style={styles.input} placeholder="3B" placeholderTextColor={colors.gray400}
                    value={address.floor} onChangeText={(v) => setAddress({ ...address, floor: v })} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Ciudad</Text>
                  <TextInput style={styles.input} placeholder="CABA" placeholderTextColor={colors.gray400}
                    value={address.city} onChangeText={(v) => setAddress({ ...address, city: v })} />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Provincia</Text>
                  <TextInput style={styles.input} placeholder="Buenos Aires" placeholderTextColor={colors.gray400}
                    value={address.province} onChangeText={(v) => setAddress({ ...address, province: v })} />
                </View>
                <View style={[styles.inputGroup, { flex: 0.4 }]}>
                  <Text style={styles.inputLabel}>CP</Text>
                  <TextInput style={styles.input} placeholder="1000" placeholderTextColor={colors.gray400}
                    value={address.postalCode} onChangeText={(v) => setAddress({ ...address, postalCode: v })} keyboardType="numeric" />
                </View>
              </View>
            </View>
            <View style={styles.deliveryInfo}>
              <Icon name="time-outline" size={16} color={colors.info} />
              <Text style={styles.deliveryText}>Tiempo de entrega: 7-10 días hábiles</Text>
            </View>
          </View>
        )}

        {/* Cost Info */}
        <View style={styles.costCard}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Costo de emisión</Text>
            <Text style={styles.costValue}>{cardType === 'virtual' ? 'Gratis' : '$2.500'}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Mantenimiento mensual</Text>
            <Text style={styles.costValue}>Gratis</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleRequest} disabled={isLoading}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.ctaGradient}>
            <Text style={styles.ctaText}>{isLoading ? 'Procesando...' : `Solicitar tarjeta ${cardType === 'virtual' ? 'virtual' : 'física'}`}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  content: { paddingHorizontal: 16, paddingBottom: 120 },
  typeSelection: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', position: 'relative', ...shadows.sm },
  typeCardActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}05` },
  typeTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: 12 },
  typeTitleActive: { color: colors.primary },
  typeSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  typeCheck: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  benefitsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 20, marginBottom: 24, ...shadows.sm },
  benefitsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  benefitText: { fontSize: 14, color: colors.textSecondary },
  addressSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  addressForm: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  input: { backgroundColor: colors.gray50, borderRadius: borderRadius.md, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: colors.textPrimary },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  deliveryText: { fontSize: 13, color: colors.info },
  costCard: { backgroundColor: colors.gray50, borderRadius: borderRadius.xl, padding: 16 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  costLabel: { fontSize: 14, color: colors.textSecondary },
  costValue: { fontSize: 14, fontWeight: '600', color: colors.success },
  ctaContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.gray100 },
  ctaBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default RequestCardScreen;
