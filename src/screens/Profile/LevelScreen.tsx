/**
 * ============================================================================
 * LEVEL SCREEN - Simply App
 * ============================================================================
 */

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors, spacing, borderRadius, shadows, getLevelGradient } from '../../theme';

const { width } = Dimensions.get('window');

const LevelScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const currentLevel = user?.level || 'ORO';
  const currentInvestment = 350000;

  const levels = [
    { id: 'PLATA', name: 'Plata', minInvestment: 0, multiplier: 1.0, cashback: 0.5, dailyLimit: 100000, color: '#9CA3AF' },
    { id: 'ORO', name: 'Oro', minInvestment: 100000, multiplier: 1.25, cashback: 1.0, dailyLimit: 500000, color: '#F59E0B' },
    { id: 'BLACK', name: 'Black', minInvestment: 500000, multiplier: 1.5, cashback: 1.5, dailyLimit: 2000000, color: '#374151' },
    { id: 'DIAMANTE', name: 'Diamante', minInvestment: 2000000, multiplier: 2.0, cashback: 2.0, dailyLimit: 10000000, color: '#60A5FA' },
  ];

  const currentLevelData = levels.find(l => l.id === currentLevel) || levels[0];
  const nextLevel = levels.find(l => l.minInvestment > currentInvestment);
  const progressToNext = nextLevel ? Math.min((currentInvestment / nextLevel.minInvestment) * 100, 100) : 100;

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);

  const benefits = [
    { icon: 'star', label: 'Multiplicador de puntos', value: `${currentLevelData.multiplier}x` },
    { icon: 'cash', label: 'Cashback en compras', value: `${currentLevelData.cashback}%` },
    { icon: 'speedometer', label: 'Límite diario', value: formatCurrency(currentLevelData.dailyLimit) },
    { icon: 'card', label: 'Descuento tarjeta', value: currentLevel === 'PLATA' ? '0%' : currentLevel === 'ORO' ? '25%' : '50%' },
    { icon: 'headset', label: 'Soporte prioritario', value: ['BLACK', 'DIAMANTE'].includes(currentLevel) ? 'Sí' : 'No' },
    { icon: 'gift', label: 'Tarjeta física gratis', value: ['BLACK', 'DIAMANTE'].includes(currentLevel) ? 'Sí' : 'No' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Nivel</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Level Card */}
        <LinearGradient colors={getLevelGradient(currentLevel)} style={styles.levelCard}>
          <View style={styles.levelBadge}>
            <Icon name="diamond" size={24} color={colors.white} />
          </View>
          <Text style={styles.levelName}>{currentLevelData.name}</Text>
          <Text style={styles.levelInvestment}>Inversión: {formatCurrency(currentInvestment)}</Text>
          
          {nextLevel && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressToNext}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {formatCurrency(nextLevel.minInvestment - currentInvestment)} más para {nextLevel.name}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus beneficios</Text>
          <View style={styles.benefitsCard}>
            {benefits.map((benefit, index) => (
              <View key={index} style={[styles.benefitRow, index < benefits.length - 1 && styles.benefitBorder]}>
                <View style={styles.benefitLeft}>
                  <Icon name={benefit.icon} size={20} color={currentLevelData.color} />
                  <Text style={styles.benefitLabel}>{benefit.label}</Text>
                </View>
                <Text style={styles.benefitValue}>{benefit.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* All Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todos los niveles</Text>
          {levels.map((level) => {
            const isCurrentLevel = level.id === currentLevel;
            const isLocked = level.minInvestment > currentInvestment;
            
            return (
              <View key={level.id} style={[styles.levelRow, isCurrentLevel && styles.levelRowActive]}>
                <View style={[styles.levelIcon, { backgroundColor: level.color }]}>
                  <Icon name="diamond" size={18} color={colors.white} />
                </View>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelRowName}>{level.name}</Text>
                  <Text style={styles.levelRowMin}>Desde {formatCurrency(level.minInvestment)}</Text>
                </View>
                <View style={styles.levelRowRight}>
                  <Text style={styles.levelRowMultiplier}>{level.multiplier}x</Text>
                  {isCurrentLevel && <Icon name="checkmark-circle" size={20} color={colors.success} />}
                  {isLocked && <Icon name="lock-closed" size={18} color={colors.gray400} />}
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('NewInvestment')}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.ctaGradient}>
            <Text style={styles.ctaText}>Invertir más y subir de nivel</Text>
            <Icon name="arrow-forward" size={20} color={colors.white} />
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
  levelCard: { marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, ...shadows.lg },
  levelBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  levelName: { fontSize: 28, fontWeight: '700', color: colors.white, marginBottom: spacing.xs },
  levelInvestment: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  progressSection: { width: '100%', marginTop: spacing.lg },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.white, borderRadius: 4 },
  progressText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.sm },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  benefitsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  benefitBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  benefitLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitLabel: { fontSize: 14, color: colors.textSecondary },
  benefitValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  levelRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.sm },
  levelRowActive: { borderWidth: 2, borderColor: colors.primary },
  levelIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  levelInfo: { flex: 1 },
  levelRowName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  levelRowMin: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  levelRowRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  levelRowMultiplier: { fontSize: 14, fontWeight: '600', color: colors.primary },
  ctaButton: { marginHorizontal: spacing.base, borderRadius: borderRadius.lg, overflow: 'hidden', marginTop: spacing.md },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: 16 },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.white },
});

export default LevelScreen;
