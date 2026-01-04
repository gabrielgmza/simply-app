/**
 * ============================================================================
 * PROFILE SCREEN - Simply App
 * ============================================================================
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch, logout } from '../../store';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Datos personales', screen: 'PersonalData', color: colors.primary },
    { icon: 'shield-checkmark-outline', label: 'Seguridad', screen: 'Security', color: colors.success },
    { icon: 'star-outline', label: 'Mi nivel', screen: 'Level', color: colors.warning },
    { icon: 'gift-outline', label: 'Rewards', screen: 'Rewards', color: colors.secondary },
    { icon: 'notifications-outline', label: 'Notificaciones', screen: 'Notifications', color: colors.info },
    { icon: 'document-text-outline', label: 'Documentos', screen: 'Documents', color: colors.gray600 },
  ];

  const supportItems = [
    { icon: 'help-circle-outline', label: 'Ayuda', screen: 'Help' },
    { icon: 'chatbubbles-outline', label: 'Contacto', screen: 'Contact' },
    { icon: 'document-outline', label: 'Términos y condiciones', screen: 'Terms' },
    { icon: 'lock-closed-outline', label: 'Políticas de privacidad', screen: 'Privacy' },
  ];

  const levelColors: Record<string, string[]> = {
    PLATA: ['#9CA3AF', '#6B7280'],
    ORO: ['#F59E0B', '#D97706'],
    BLACK: ['#374151', '#1F2937'],
    DIAMANTE: ['#60A5FA', '#3B82F6'],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={levelColors[user?.level || 'PLATA']}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}{user?.lastName?.[0] || 'US'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.firstName || 'Usuario'} {user?.lastName || 'Simply'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email || 'usuario@email.com'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Icon name="pencil" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.levelBadge}>
            <Icon name="diamond" size={16} color={colors.white} />
            <Text style={styles.levelText}>{user?.level || 'PLATA'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>750K</Text>
              <Text style={styles.statLabel}>Invertido</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>2,450</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Transacciones</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Rewards Card */}
        <TouchableOpacity style={styles.rewardsCard} onPress={() => navigation.navigate('Rewards')}>
          <View style={styles.rewardsIcon}>
            <Icon name="gift" size={24} color={colors.secondary} />
          </View>
          <View style={styles.rewardsInfo}>
            <Text style={styles.rewardsTitle}>2,450 puntos disponibles</Text>
            <Text style={styles.rewardsSubtitle}>Canjeá por beneficios exclusivos</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.gray400} />
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Mi cuenta</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Icon name="chevron-forward" size={20} color={colors.gray400} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Soporte</Text>
          <View style={styles.menuCard}>
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index < supportItems.length - 1 && styles.menuItemBorder]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.gray100 }]}>
                  <Icon name={item.icon} size={20} color={colors.gray600} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Icon name="chevron-forward" size={20} color={colors.gray400} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Simply v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  profileCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.lg },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatarContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 24, fontWeight: '700', color: colors.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: colors.white },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: spacing.lg },
  levelText: { fontSize: 13, fontWeight: '600', color: colors.white },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: borderRadius.lg, padding: spacing.md },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  rewardsCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.base, marginTop: spacing.lg, borderRadius: borderRadius.xl, padding: spacing.base, ...shadows.md },
  rewardsIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.secondary}15`, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  rewardsInfo: { flex: 1 },
  rewardsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  rewardsSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  menuSection: { paddingHorizontal: spacing.base, marginTop: spacing.xl },
  menuTitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.base },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  menuLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl, marginHorizontal: spacing.base, paddingVertical: spacing.base, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.error },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.error },
  version: { textAlign: 'center', fontSize: 12, color: colors.textSecondary, marginTop: spacing.lg },
});

export default ProfileScreen;
