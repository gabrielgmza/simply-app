/**
 * RECHARGE SCREEN - Simply App (Recargas celular, SUBE, etc)
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const RechargeScreen = () => {
  const navigation = useNavigation<any>();
  const [type, setType] = useState<'celular' | 'sube' | 'otros'>('celular');
  const [phone, setPhone] = useState('');
  const [subeNumber, setSubeNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (v: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(v);

  const carriers = [
    { id: 'personal', name: 'Personal', color: '#00A0E4' },
    { id: 'claro', name: 'Claro', color: '#E60012' },
    { id: 'movistar', name: 'Movistar', color: '#00A19C' },
    { id: 'tuenti', name: 'Tuenti', color: '#8B5CF6' },
  ];

  const amounts = [100, 200, 500, 1000, 2000, 5000];

  const handleRecharge = async () => {
    if (type === 'celular' && (!phone || !carrier || !amount)) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (type === 'sube' && (!subeNumber || !amount)) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('¡Recarga exitosa!', type === 'celular' 
        ? `Recargaste ${formatCurrency(parseInt(amount))} a ${phone}`
        : `Cargaste ${formatCurrency(parseInt(amount))} a tu SUBE`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recargar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Type Selection */}
        <View style={styles.typeSelection}>
          {[
            { id: 'celular', icon: 'phone-portrait', label: 'Celular' },
            { id: 'sube', icon: 'bus', label: 'SUBE' },
            { id: 'otros', icon: 'apps', label: 'Otros' },
          ].map((t) => (
            <TouchableOpacity key={t.id} style={[styles.typeBtn, type === t.id && styles.typeBtnActive]}
              onPress={() => setType(t.id as any)}>
              <Icon name={t.icon} size={24} color={type === t.id ? colors.primary : colors.gray400} />
              <Text style={[styles.typeLabel, type === t.id && styles.typeLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {type === 'celular' && (
          <>
            {/* Phone Number */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Número de celular</Text>
              <View style={styles.phoneInput}>
                <Text style={styles.phonePrefix}>+54 9</Text>
                <TextInput style={styles.phoneField} placeholder="11 2345 6789" placeholderTextColor={colors.gray400}
                  value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={12} />
              </View>
            </View>

            {/* Carrier */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Compañía</Text>
              <View style={styles.carrierGrid}>
                {carriers.map((c) => (
                  <TouchableOpacity key={c.id} style={[styles.carrierBtn, carrier === c.id && { borderColor: c.color }]}
                    onPress={() => setCarrier(c.id)}>
                    <View style={[styles.carrierDot, { backgroundColor: c.color }]} />
                    <Text style={[styles.carrierName, carrier === c.id && { color: c.color }]}>{c.name}</Text>
                    {carrier === c.id && <Icon name="checkmark-circle" size={18} color={c.color} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {type === 'sube' && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Número de SUBE</Text>
            <TextInput style={styles.input} placeholder="6061 2800 0000 0000 0" placeholderTextColor={colors.gray400}
              value={subeNumber} onChangeText={setSubeNumber} keyboardType="numeric" maxLength={19} />
            <View style={styles.subeInfo}>
              <Icon name="information-circle" size={16} color={colors.info} />
              <Text style={styles.subeInfoText}>Encontrás el número en el frente de tu tarjeta</Text>
            </View>
          </View>
        )}

        {type === 'otros' && (
          <View style={styles.otrosGrid}>
            {[
              { icon: 'game-controller', label: 'Gaming', desc: 'Steam, PlayStation' },
              { icon: 'gift', label: 'Gift Cards', desc: 'Netflix, Spotify' },
              { icon: 'car', label: 'Peajes', desc: 'Telepase' },
              { icon: 'train', label: 'Trenes', desc: 'Tren Mitre, Sarmiento' },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.otrosItem}>
                <View style={styles.otrosIcon}><Icon name={item.icon} size={28} color={colors.primary} /></View>
                <Text style={styles.otrosLabel}>{item.label}</Text>
                <Text style={styles.otrosDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {type !== 'otros' && (
          <>
            {/* Amount */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Monto a recargar</Text>
              <View style={styles.amountsGrid}>
                {amounts.map((a) => (
                  <TouchableOpacity key={a} style={[styles.amountBtn, amount === a.toString() && styles.amountBtnActive]}
                    onPress={() => setAmount(a.toString())}>
                    <Text style={[styles.amountText, amount === a.toString() && styles.amountTextActive]}>
                      {formatCurrency(a)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.orText}>O ingresá otro monto</Text>
              <View style={styles.customAmount}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput style={styles.customInput} placeholder="0" placeholderTextColor={colors.gray400}
                  value={amount} onChangeText={setAmount} keyboardType="numeric" />
              </View>
            </View>

            {/* Summary */}
            {amount && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Recarga</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(parseInt(amount) || 0)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Comisión</Text>
                  <Text style={[styles.summaryValue, { color: colors.success }]}>Gratis</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelBold}>Total</Text>
                  <Text style={styles.summaryValueBold}>{formatCurrency(parseInt(amount) || 0)}</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {type !== 'otros' && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={[styles.ctaBtn, !amount && styles.ctaBtnDisabled]} onPress={handleRecharge} disabled={isLoading || !amount}>
            <LinearGradient colors={amount ? colors.gradientPrimary : [colors.gray300, colors.gray400]} style={styles.ctaGradient}>
              <Text style={styles.ctaText}>{isLoading ? 'Procesando...' : 'Recargar'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  typeBtn: { flex: 1, alignItems: 'center', paddingVertical: 16, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 2, borderColor: 'transparent', ...shadows.sm },
  typeBtnActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}05` },
  typeLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  typeLabelActive: { color: colors.primary, fontWeight: '600' },
  inputSection: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 12 },
  phoneInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: 16, ...shadows.sm },
  phonePrefix: { fontSize: 16, color: colors.textSecondary, marginRight: 8 },
  phoneField: { flex: 1, paddingVertical: 16, fontSize: 16, color: colors.textPrimary },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: colors.textPrimary, ...shadows.sm },
  carrierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  carrierBtn: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: 14, borderWidth: 2, borderColor: 'transparent', ...shadows.sm },
  carrierDot: { width: 12, height: 12, borderRadius: 6 },
  carrierName: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  subeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  subeInfoText: { fontSize: 12, color: colors.info },
  amountsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amountBtn: { width: '31%', paddingVertical: 14, backgroundColor: colors.surface, borderRadius: borderRadius.lg, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', ...shadows.sm },
  amountBtnActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}05` },
  amountText: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  amountTextActive: { color: colors.primary },
  orText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginVertical: 16 },
  customAmount: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: colors.textPrimary },
  customInput: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, minWidth: 100, textAlign: 'center' },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  summaryLabelBold: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  summaryValueBold: { fontSize: 16, fontWeight: '700', color: colors.primary },
  summaryDivider: { height: 1, backgroundColor: colors.gray100, marginVertical: 8 },
  otrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  otrosItem: { width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  otrosIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  otrosLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  otrosDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  ctaContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.gray100 },
  ctaBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default RechargeScreen;
