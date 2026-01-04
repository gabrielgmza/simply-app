/**
 * ============================================================================
 * SECURITY SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const SecurityScreen = () => {
  const navigation = useNavigation<any>();
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);

  const securityScore = 75;

  const activeSessions = [
    { id: '1', device: 'iPhone 14 Pro', location: 'Buenos Aires, AR', lastActive: 'Ahora', current: true },
    { id: '2', device: 'MacBook Pro', location: 'Buenos Aires, AR', lastActive: 'Hace 2 horas', current: false },
  ];

  const recentActivity = [
    { id: '1', action: 'Inicio de sesión', device: 'iPhone 14 Pro', date: '04 Ene 2025, 14:30', success: true },
    { id: '2', action: 'Cambio de contraseña', device: 'iPhone 14 Pro', date: '02 Ene 2025, 10:15', success: true },
    { id: '3', action: 'Intento de inicio fallido', device: 'Desconocido', date: '01 Ene 2025, 03:22', success: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguridad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Security Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{securityScore}%</Text>
            <Text style={styles.scoreLabel}>Seguridad</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Tu cuenta está protegida</Text>
            <Text style={styles.scoreSubtitle}>Activa 2FA para mejorar tu puntuación</Text>
          </View>
        </View>

        {/* Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autenticación</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Icon name="finger-print" size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Biometría</Text>
                  <Text style={styles.rowDesc}>Face ID / Touch ID</Text>
                </View>
              </View>
              <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ false: colors.gray300, true: colors.primary }} />
            </View>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: `${colors.success}15` }]}>
                  <Icon name="shield-checkmark" size={22} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Autenticación 2FA</Text>
                  <Text style={styles.rowDesc}>{twoFactor ? 'Activado' : 'Desactivado'}</Text>
                </View>
              </View>
              <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: colors.gray300, true: colors.success }} />
            </View>
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: `${colors.warning}15` }]}>
                  <Icon name="key" size={22} color={colors.warning} />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Cambiar contraseña</Text>
                  <Text style={styles.rowDesc}>Última actualización: hace 30 días</Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas de seguridad</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Alertas de inicio de sesión</Text>
              </View>
              <Switch value={loginAlerts} onValueChange={setLoginAlerts} trackColor={{ false: colors.gray300, true: colors.primary }} />
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Alertas de transacciones</Text>
              </View>
              <Switch value={transactionAlerts} onValueChange={setTransactionAlerts} trackColor={{ false: colors.gray300, true: colors.primary }} />
            </View>
          </View>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sesiones activas</Text>
            <TouchableOpacity onPress={() => Alert.alert('Cerrar sesiones', '¿Cerrar todas las sesiones excepto esta?', [
              { text: 'Cancelar' }, { text: 'Cerrar todas', style: 'destructive' }
            ])}>
              <Text style={styles.closeAll}>Cerrar todas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {activeSessions.map((session, index) => (
              <View key={session.id} style={[styles.sessionRow, index < activeSessions.length - 1 && styles.rowBorder]}>
                <Icon name={session.device.includes('iPhone') ? 'phone-portrait' : 'laptop'} size={24} color={colors.textSecondary} />
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDevice}>{session.device} {session.current && <Text style={styles.currentBadge}>(Este dispositivo)</Text>}</Text>
                  <Text style={styles.sessionMeta}>{session.location} • {session.lastActive}</Text>
                </View>
                {!session.current && (
                  <TouchableOpacity><Icon name="close-circle" size={22} color={colors.error} /></TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          <View style={styles.card}>
            {recentActivity.map((activity, index) => (
              <View key={activity.id} style={[styles.activityRow, index < recentActivity.length - 1 && styles.rowBorder]}>
                <View style={[styles.activityIcon, { backgroundColor: activity.success ? `${colors.success}15` : `${colors.error}15` }]}>
                  <Icon name={activity.success ? 'checkmark' : 'close'} size={18} color={activity.success ? colors.success : colors.error} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityMeta}>{activity.device} • {activity.date}</Text>
                </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  scoreCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadows.md },
  scoreCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: colors.success, justifyContent: 'center', alignItems: 'center', marginRight: spacing.lg },
  scoreValue: { fontSize: 22, fontWeight: '700', color: colors.success },
  scoreLabel: { fontSize: 10, color: colors.textSecondary },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  scoreSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase' },
  closeAll: { fontSize: 13, color: colors.error, fontWeight: '500' },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: colors.textPrimary },
  rowDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  sessionInfo: { flex: 1 },
  sessionDevice: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  currentBadge: { fontSize: 12, color: colors.success, fontWeight: '400' },
  sessionMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  activityIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityAction: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  activityMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});

export default SecurityScreen;
