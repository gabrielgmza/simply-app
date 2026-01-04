/**
 * ============================================================================
 * TRANSFER SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const TransferScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { balance } = useSelector((state: RootState) => state.wallet);
  
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(route.params?.contact?.alias || '');
  const [destinationValid, setDestinationValid] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);
  const formatInputCurrency = (text: string) => { const num = text.replace(/\D/g, ''); return num ? parseInt(num).toLocaleString('es-AR') : ''; };
  const amountNum = parseInt(amount.replace(/\D/g, '')) || 0;

  const validateDestination = async () => {
    if (!destination) return;
    setIsLoading(true);
    setTimeout(() => {
      if (destination.includes('.') || destination.length === 22) {
        setDestinationValid({ name: 'Juan Pérez', bank: 'Banco Nación', cvu: '0000003100012345678901' });
      } else {
        setDestinationValid(null);
        Alert.alert('No encontrado', 'No pudimos validar el CVU o alias');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleContinue = () => {
    if (step === 1 && destinationValid) setStep(2);
    else if (step === 2 && amountNum > 0) {
      if (amountNum > (balance || 125000)) { Alert.alert('Saldo insuficiente'); return; }
      setStep(3);
    }
  };

  const handleConfirm = () => {
    Alert.alert('Confirmar transferencia', `Enviar ${formatCurrency(amountNum)} a ${destinationValid?.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Transferir', onPress: () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          Alert.alert('¡Transferencia exitosa!', `Enviaste ${formatCurrency(amountNum)} a ${destinationValid?.name}`, [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }, 1500);
      }}
    ]);
  };

  const recentContacts = [
    { id: '1', name: 'Juan Pérez', alias: 'juan.perez.mp', avatar: 'J' },
    { id: '2', name: 'María García', alias: 'maria.garcia', avatar: 'M' },
    { id: '3', name: 'Carlos López', alias: 'carlos.lopez.bna', avatar: 'C' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{step === 3 ? 'Confirmar' : 'Transferir'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.steps}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>¿A quién le transferís?</Text>
              <View style={styles.inputContainer}>
                <Icon name="search" size={20} color={colors.gray400} />
                <TextInput style={styles.input} placeholder="CVU, alias o buscar contacto" placeholderTextColor={colors.gray400}
                  value={destination} onChangeText={(t) => { setDestination(t); setDestinationValid(null); }} onEndEditing={validateDestination} autoCapitalize="none" />
              </View>

              {destinationValid && (
                <View style={styles.validatedCard}>
                  <View style={styles.validatedAvatar}><Text style={styles.validatedAvatarText}>{destinationValid.name[0]}</Text></View>
                  <View style={styles.validatedInfo}>
                    <Text style={styles.validatedName}>{destinationValid.name}</Text>
                    <Text style={styles.validatedBank}>{destinationValid.bank}</Text>
                  </View>
                  <Icon name="checkmark-circle" size={24} color={colors.success} />
                </View>
              )}

              <Text style={styles.recentTitle}>Contactos frecuentes</Text>
              {recentContacts.map((c) => (
                <TouchableOpacity key={c.id} style={styles.contactRow} onPress={() => { setDestination(c.alias); setDestinationValid({ name: c.name, bank: 'Banco', cvu: '123' }); }}>
                  <View style={styles.contactAvatar}><Text style={styles.contactAvatarText}>{c.avatar}</Text></View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactAlias}>{c.alias}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>¿Cuánto transferís?</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput style={styles.amountInput} value={amount} onChangeText={(t) => setAmount(formatInputCurrency(t))}
                  keyboardType="numeric" placeholder="0" placeholderTextColor={colors.gray400} autoFocus />
              </View>
              <Text style={styles.balanceText}>Disponible: {formatCurrency(balance || 125000)}</Text>

              <View style={styles.quickAmounts}>
                {[10000, 25000, 50000, 100000].map((qa) => (
                  <TouchableOpacity key={qa} style={styles.quickAmount} onPress={() => setAmount(qa.toLocaleString('es-AR'))}>
                    <Text style={styles.quickAmountText}>{formatCurrency(qa)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.conceptLabel}>Concepto (opcional)</Text>
              <TextInput style={styles.conceptInput} value={concept} onChangeText={setConcept} placeholder="Ej: Alquiler, regalo..." placeholderTextColor={colors.gray400} />
            </View>
          )}

          {step === 3 && (
            <View style={styles.section}>
              <View style={styles.confirmCard}>
                <Text style={styles.confirmLabel}>Transferís</Text>
                <Text style={styles.confirmAmount}>{formatCurrency(amountNum)}</Text>
                <View style={styles.confirmDivider} />
                <Text style={styles.confirmLabel}>A</Text>
                <Text style={styles.confirmName}>{destinationValid?.name}</Text>
                <Text style={styles.confirmBank}>{destinationValid?.bank}</Text>
                {concept && <><Text style={styles.confirmLabel}>Concepto</Text><Text style={styles.confirmConcept}>{concept}</Text></>}
              </View>
              <View style={styles.feeInfo}>
                <Icon name="information-circle" size={18} color={colors.info} />
                <Text style={styles.feeText}>Sin comisión • Llegará en segundos</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.ctaContainer}>
          <TouchableOpacity style={[styles.ctaButton, ((step === 1 && !destinationValid) || (step === 2 && amountNum <= 0)) && styles.ctaDisabled]}
            onPress={step === 3 ? handleConfirm : handleContinue} disabled={isLoading || (step === 1 && !destinationValid) || (step === 2 && amountNum <= 0)}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.ctaGradient}>
              <Text style={styles.ctaText}>{isLoading ? 'Procesando...' : step === 3 ? 'Confirmar transferencia' : 'Continuar'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  steps: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray300 },
  stepDotActive: { backgroundColor: colors.primary, width: 24 },
  section: { paddingHorizontal: spacing.base },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.lg },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, ...shadows.sm },
  input: { flex: 1, paddingVertical: 16, marginLeft: spacing.sm, fontSize: 16, color: colors.textPrimary },
  validatedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${colors.success}10`, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.md, borderWidth: 1, borderColor: colors.success },
  validatedAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center' },
  validatedAvatarText: { fontSize: 18, fontWeight: '600', color: colors.white },
  validatedInfo: { flex: 1, marginLeft: spacing.md },
  validatedName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  validatedBank: { fontSize: 13, color: colors.textSecondary },
  recentTitle: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.md },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  contactAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  contactAvatarText: { fontSize: 18, fontWeight: '600', color: colors.white },
  contactInfo: { flex: 1, marginLeft: spacing.md },
  contactName: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  contactAlias: { fontSize: 13, color: colors.textSecondary },
  amountContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  currencySymbol: { fontSize: 40, fontWeight: '700', color: colors.textPrimary },
  amountInput: { fontSize: 48, fontWeight: '700', color: colors.textPrimary, minWidth: 100, textAlign: 'center' },
  balanceText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  quickAmounts: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  quickAmount: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.gray100, borderRadius: borderRadius.md },
  quickAmountText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  conceptLabel: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: spacing.sm },
  conceptInput: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: 15, color: colors.textPrimary },
  confirmCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', ...shadows.md },
  confirmLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs },
  confirmAmount: { fontSize: 40, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
  confirmDivider: { width: 40, height: 2, backgroundColor: colors.gray200, marginVertical: spacing.md },
  confirmName: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  confirmBank: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  confirmConcept: { fontSize: 15, color: colors.textPrimary },
  feeInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.lg },
  feeText: { fontSize: 14, color: colors.info },
  ctaContainer: { padding: spacing.base, borderTopWidth: 1, borderTopColor: colors.gray100 },
  ctaButton: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaDisabled: { opacity: 0.5 },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.white },
});

export default TransferScreen;
