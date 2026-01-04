/**
 * TRANSACTION DETAIL SCREEN - Simply App
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { walletService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const txId = route.params?.id;

  // Mock data
  const tx = {
    id: txId || '123456',
    type: 'transfer_out',
    status: 'completed',
    title: 'Transferencia a Juan Pérez',
    amount: -15000,
    date: '2025-01-04',
    time: '14:30:45',
    reference: 'TXN-2025-0104-143045-789456',
    
    // Detalles específicos según tipo
    recipient: { name: 'Juan Pérez', cvu: '0000003100012345678901', bank: 'Banco Nación' },
    sender: null,
    concept: 'Alquiler enero',
    
    // Fees
    fee: 0,
    total: 15000,
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(Math.abs(value));

  const isIncoming = tx.amount > 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Comprobante Simply\n\n${tx.title}\nMonto: ${formatCurrency(tx.amount)}\nFecha: ${tx.date} ${tx.time}\nReferencia: ${tx.reference}\n\nSimply - Tu dinero, simplificado`,
      });
    } catch (e) {}
  };

  const handleReport = () => {
    Alert.alert('Reportar problema', '¿Qué tipo de problema tenés con esta operación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'No reconozco esta operación', onPress: () => Alert.alert('Reportado', 'Vamos a revisar esta operación') },
      { text: 'Monto incorrecto', onPress: () => Alert.alert('Reportado', 'Vamos a revisar el monto') },
    ]);
  };

  const getStatusInfo = () => {
    switch (tx.status) {
      case 'completed': return { color: colors.success, icon: 'checkmark-circle', text: 'Completada' };
      case 'pending': return { color: colors.warning, icon: 'time', text: 'Pendiente' };
      case 'failed': return { color: colors.error, icon: 'close-circle', text: 'Fallida' };
      default: return { color: colors.gray400, icon: 'ellipse', text: 'Desconocido' };
    }
  };

  const status = getStatusInfo();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Icon name="share-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
          <Icon name={status.icon} size={16} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <View style={[styles.amountIcon, { backgroundColor: isIncoming ? `${colors.success}20` : `${colors.error}20` }]}>
            <Icon name={isIncoming ? 'arrow-down' : 'arrow-up'} size={28} color={isIncoming ? colors.success : colors.error} />
          </View>
          <Text style={[styles.amount, isIncoming && styles.amountPositive]}>
            {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
          </Text>
          <Text style={styles.txTitle}>{tx.title}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha y hora</Text>
            <Text style={styles.detailValue}>{tx.date} - {tx.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referencia</Text>
            <Text style={styles.detailValue}>{tx.reference}</Text>
          </View>

          {tx.concept && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Concepto</Text>
              <Text style={styles.detailValue}>{tx.concept}</Text>
            </View>
          )}

          {tx.recipient && (
            <>
              <View style={styles.detailDivider} />
              <Text style={styles.detailSection}>Destinatario</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nombre</Text>
                <Text style={styles.detailValue}>{tx.recipient.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CVU</Text>
                <Text style={styles.detailValue}>{tx.recipient.cvu}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Banco</Text>
                <Text style={styles.detailValue}>{tx.recipient.bank}</Text>
              </View>
            </>
          )}

          <View style={styles.detailDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal</Text>
            <Text style={styles.detailValue}>{formatCurrency(tx.amount)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Comisión</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>{tx.fee === 0 ? 'Gratis' : formatCurrency(tx.fee)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabelBold}>Total</Text>
            <Text style={styles.detailValueBold}>{formatCurrency(tx.total)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {!isIncoming && tx.recipient && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Transfer', { contact: tx.recipient })}>
              <Icon name="repeat" size={20} color={colors.primary} />
              <Text style={styles.actionBtnText}>Repetir transferencia</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Icon name="download-outline" size={20} color={colors.primary} />
            <Text style={styles.actionBtnText}>Descargar comprobante</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleReport}>
            <Icon name="alert-circle-outline" size={20} color={colors.error} />
            <Text style={[styles.actionBtnText, { color: colors.error }]}>Reportar problema</Text>
          </TouchableOpacity>
        </View>

        {/* Help */}
        <View style={styles.helpCard}>
          <Icon name="help-circle-outline" size={20} color={colors.info} />
          <Text style={styles.helpText}>
            ¿Tenés dudas sobre esta operación? Contactanos a través de nuestro chat de soporte.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  shareBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  statusBadge: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusText: { fontSize: 14, fontWeight: '600' },
  amountContainer: { alignItems: 'center', marginVertical: 24 },
  amountIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  amount: { fontSize: 36, fontWeight: '700', color: colors.textPrimary },
  amountPositive: { color: colors.success },
  txTitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
  detailsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 20, ...shadows.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  detailLabelBold: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  detailValueBold: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  detailDivider: { height: 1, backgroundColor: colors.gray100, marginVertical: 12 },
  detailSection: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  actions: { marginTop: 24, gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: `${colors.primary}10`, paddingVertical: 14, borderRadius: borderRadius.lg },
  actionBtnDanger: { backgroundColor: `${colors.error}10` },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  helpCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: `${colors.info}10`, borderRadius: borderRadius.md, padding: 16, marginTop: 24 },
  helpText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});

export default TransactionDetailScreen;
