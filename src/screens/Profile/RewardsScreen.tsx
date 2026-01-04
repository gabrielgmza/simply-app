import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

const RewardsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>RewardsScreen</Text>
    <Text style={styles.subtitle}>En desarrollo...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
});

export default RewardsScreen;
