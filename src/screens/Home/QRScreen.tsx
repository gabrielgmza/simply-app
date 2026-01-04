/**
 * ============================================================================
 * QR SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Share, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.65;

const QRScreen = () => {
  const navigation = useNavigation<any>();
  const { cvu, alias } = useSelector((state: RootState) => state.wallet);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'receive' | 'scan'>('receive');

  const myAlias = alias || 'usuario.simply.mp';
  const myCvu = cvu || '0000003100012345678901';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Datos para transferirme:\n\nAlias: ${myAlias}\nCVU: ${myCvu}\n\nSimply - Tu dinero, simplificado`,
        title: 'Mis datos de Simply',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = (text: string, label: string) => {
    // Clipboard.setString(text);
    Alert.alert('Copiado', `${label} copiado al portapapeles`);
  };

  const handleScanResult = (data: string) => {
    // Simular resultado de escaneo
    Alert.alert('QR Escaneado', `Datos: ${data}`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Transferir', onPress: () => navigation.navigate('Transfer', { destination: data }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Icon name="share-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'receive' && styles.tabActive]} onPress={() => setActiveTab('receive')}>
          <Icon name="arrow-down-circle" size={20} color={activeTab === 'receive' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'receive' && styles.tabTextActive]}>Recibir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'scan' && styles.tabActive]} onPress={() => setActiveTab('scan')}>
          <Icon name="scan" size={20} color={activeTab === 'scan' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.tabTextActive]}>Escanear</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'receive' ? (
        <View style={styles.receiveContainer}>
          {/* QR Code */}
          <View style={styles.qrCard}>
            <View style={styles.qrContainer}>
              {/* Simulated QR Code */}
              <View style={styles.qrCode}>
                <View style={styles.qrInner}>
                  <Icon name="qr-code" size={QR_SIZE * 0.8} color={colors.textPrimary} />
                </View>
                <View style={styles.qrCorner} />
                <View style={[styles.qrCorner, styles.qrCornerTR]} />
                <View style={[styles.qrCorner, styles.qrCornerBL]} />
                <View style={[styles.qrCorner, styles.qrCornerBR]} />
              </View>
            </View>

            <Text style={styles.userName}>{user?.firstName || 'Usuario'} {user?.lastName || 'Simply'}</Text>

            {/* Alias */}
            <TouchableOpacity style={styles.dataRow} onPress={() => handleCopy(myAlias, 'Alias')}>
              <View style={styles.dataInfo}>
                <Text style={styles.dataLabel}>Alias</Text>
                <Text style={styles.dataValue}>{myAlias}</Text>
              </View>
              <Icon name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* CVU */}
            <TouchableOpacity style={styles.dataRow} onPress={() => handleCopy(myCvu, 'CVU')}>
              <View style={styles.dataInfo}>
                <Text style={styles.dataLabel}>CVU</Text>
                <Text style={styles.dataValue}>{myCvu}</Text>
              </View>
              <Icon name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.infoText}>
            Mostrá este QR o compartí tus datos para recibir dinero
          </Text>
        </View>
      ) : (
        <View style={styles.scanContainer}>
          {/* Camera Placeholder */}
          <View style={styles.cameraContainer}>
            <View style={styles.cameraPlaceholder}>
              <View style={styles.scanFrame}>
                <View style={[styles.scanCorner, styles.scanCornerTL]} />
                <View style={[styles.scanCorner, styles.scanCornerTR]} />
                <View style={[styles.scanCorner, styles.scanCornerBL]} />
                <View style={[styles.scanCorner, styles.scanCornerBR]} />
              </View>
              <Icon name="camera" size={48} color={colors.gray400} />
              <Text style={styles.cameraText}>Apuntá al código QR</Text>
            </View>
          </View>

          <View style={styles.scanActions}>
            <TouchableOpacity style={styles.scanAction}>
              <View style={styles.scanActionIcon}>
                <Icon name="flash" size={24} color={colors.primary} />
              </View>
              <Text style={styles.scanActionText}>Flash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanAction}>
              <View style={styles.scanActionIcon}>
                <Icon name="images" size={24} color={colors.primary} />
              </View>
              <Text style={styles.scanActionText}>Galería</Text>
            </TouchableOpacity>
          </View>

          {/* Simulate scan button for demo */}
          <TouchableOpacity style={styles.simulateBtn} onPress={() => handleScanResult('maria.garcia.mp')}>
            <Text style={styles.simulateBtnText}>Simular escaneo (demo)</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  shareBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.base, backgroundColor: colors.gray100, borderRadius: borderRadius.lg, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.white, ...shadows.sm },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  receiveContainer: { flex: 1, paddingHorizontal: spacing.base, paddingTop: spacing.xl },
  qrCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', ...shadows.lg },
  qrContainer: { marginBottom: spacing.lg },
  qrCode: { width: QR_SIZE, height: QR_SIZE, backgroundColor: colors.white, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  qrInner: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  qrCorner: { position: 'absolute', width: 20, height: 20, borderColor: colors.primary, borderTopWidth: 3, borderLeftWidth: 3, top: -2, left: -2 },
  qrCornerTR: { top: -2, left: 'auto', right: -2, borderLeftWidth: 0, borderRightWidth: 3 },
  qrCornerBL: { top: 'auto', bottom: -2, left: -2, borderTopWidth: 0, borderBottomWidth: 3 },
  qrCornerBR: { top: 'auto', bottom: -2, left: 'auto', right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  userName: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.lg },
  dataRow: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: colors.gray50, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm },
  dataInfo: { flex: 1 },
  dataLabel: { fontSize: 12, color: colors.textSecondary },
  dataValue: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginTop: 2 },
  infoText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
  scanContainer: { flex: 1, paddingHorizontal: spacing.base, paddingTop: spacing.lg },
  cameraContainer: { flex: 1, marginBottom: spacing.lg },
  cameraPlaceholder: { flex: 1, backgroundColor: colors.gray900, borderRadius: borderRadius.xl, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  scanFrame: { position: 'absolute', width: width * 0.6, height: width * 0.6 },
  scanCorner: { position: 'absolute', width: 30, height: 30, borderColor: colors.primary, borderWidth: 3 },
  scanCornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  scanCornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  scanCornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  scanCornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  cameraText: { fontSize: 16, color: colors.gray400, marginTop: spacing.md },
  scanActions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.lg },
  scanAction: { alignItems: 'center' },
  scanActionIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  scanActionText: { fontSize: 12, color: colors.textSecondary },
  simulateBtn: { backgroundColor: colors.gray100, paddingVertical: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
  simulateBtnText: { fontSize: 14, color: colors.textSecondary },
});

export default QRScreen;
