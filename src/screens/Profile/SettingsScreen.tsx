/**
 * ============================================================================
 * SETTINGS SCREEN - Simply App
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { biometricsEnabled, darkMode, notifications } = useSelector((state: RootState) => state.app);
  
  const [biometrics, setBiometrics] = useState(biometricsEnabled);
  const [pushEnabled, setPushEnabled] = useState(notifications);
  const [darkModeEnabled, setDarkMode] = useState(darkMode);

  const sections = [
    {
      title: 'Cuenta',
      items: [
        { icon: 'person-outline', label: 'Datos personales', action: () => navigation.navigate('PersonalData') },
        { icon: 'location-outline', label: 'Dirección', action: () => navigation.navigate('Address') },
        { icon: 'document-outline', label: 'Documentos', action: () => navigation.navigate('Documents') },
      ],
    },
    {
      title: 'Seguridad',
      items: [
        { icon: 'finger-print', label: 'Biometría', toggle: true, value: biometrics, onToggle: setBiometrics },
        { icon: 'lock-closed-outline', label: 'Cambiar contraseña', action: () => navigation.navigate('ChangePassword') },
        { icon: 'key-outline', label: 'PIN de tarjeta', action: () => navigation.navigate('CardPIN') },
        { icon: 'shield-checkmark-outline', label: '2FA', action: () => navigation.navigate('TwoFactor') },
      ],
    },
    {
      title: 'Preferencias',
      items: [
        { icon: 'notifications-outline', label: 'Notificaciones push', toggle: true, value: pushEnabled, onToggle: setPushEnabled },
        { icon: 'moon-outline', label: 'Modo oscuro', toggle: true, value: darkModeEnabled, onToggle: setDarkMode },
        { icon: 'globe-outline', label: 'Idioma', value: 'Español', action: () => {} },
      ],
    },
    {
      title: 'Límites y Alias',
      items: [
        { icon: 'speedometer-outline', label: 'Límites de operación', action: () => navigation.navigate('Limits') },
        { icon: 'at-outline', label: 'Editar alias', action: () => Alert.prompt('Editar alias', 'Ingresá tu nuevo alias (palabra.palabra.palabra)', [{ text: 'Cancelar' }, { text: 'Guardar' }]) },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { icon: 'help-circle-outline', label: 'Centro de ayuda', action: () => navigation.navigate('Help') },
        { icon: 'chatbubbles-outline', label: 'Chat con soporte', action: () => {} },
        { icon: 'bug-outline', label: 'Reportar problema', action: () => {} },
      ],
    },
    {
      title: 'Legal',
      items: [
        { icon: 'document-text-outline', label: 'Términos y condiciones', action: () => {} },
        { icon: 'shield-outline', label: 'Política de privacidad', action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, iIndex) => (
                <TouchableOpacity key={iIndex} style={[styles.row, iIndex < section.items.length - 1 && styles.rowBorder]}
                  onPress={item.action} disabled={item.toggle}>
                  <View style={styles.rowLeft}>
                    <Icon name={item.icon} size={22} color={colors.gray600} />
                    <Text style={styles.rowLabel}>{item.label}</Text>
                  </View>
                  {item.toggle ? (
                    <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: colors.gray300, true: colors.primary }}
                      thumbColor={colors.white} />
                  ) : item.value ? (
                    <Text style={styles.rowValue}>{item.value}</Text>
                  ) : (
                    <Icon name="chevron-forward" size={20} color={colors.gray400} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Cerrar sesión', '¿Estás seguro?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar sesión', style: 'destructive', onPress: () => {} },
        ])}>
          <Icon name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Simply v1.2.0</Text>
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
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowLabel: { fontSize: 15, color: colors.textPrimary },
  rowValue: { fontSize: 14, color: colors.textSecondary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginHorizontal: spacing.base, paddingVertical: spacing.base, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.error, marginTop: spacing.md },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.error },
  version: { textAlign: 'center', fontSize: 12, color: colors.textSecondary, marginTop: spacing.lg },
});

export default SettingsScreen;
