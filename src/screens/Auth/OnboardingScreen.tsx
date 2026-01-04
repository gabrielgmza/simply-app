/**
 * ONBOARDING SCREEN - Simply App
 */
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', icon: 'trending-up', title: 'Invertí y ganá', subtitle: 'Tu dinero genera rendimiento diario del 22.08% TNA. Mirá crecer tu capital cada día.', color: '#6366F1' },
  { id: '2', icon: 'cash-outline', title: 'Financiate a 0%', subtitle: 'Obtené hasta 15% de tu inversión sin intereses. Pagá en hasta 48 cuotas.', color: '#10B981' },
  { id: '3', icon: 'card-outline', title: 'Tu tarjeta VISA', subtitle: 'Pagá en cualquier comercio, comprá online y acumulá puntos con cada compra.', color: '#F59E0B' },
  { id: '4', icon: 'shield-checkmark', title: 'Seguro y simple', subtitle: 'Tu dinero protegido con los más altos estándares de seguridad bancaria.', color: '#8B5CF6' },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('@simply:onboarded', 'true');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('@simply:onboarded', 'true');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Icon name={item.icon} size={80} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.nextGradient}>
            <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? 'Comenzar' : 'Siguiente'}</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skipBtn: { position: 'absolute', top: 60, right: 20, zIndex: 10, padding: 10 },
  skipText: { fontSize: 16, color: colors.textSecondary },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconContainer: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  footer: { paddingHorizontal: 20, paddingBottom: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray300, marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: colors.primary },
  nextBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  nextText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default OnboardingScreen;
