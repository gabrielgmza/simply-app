/**
 * HELP SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const HelpScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    { id: 'cuenta', icon: 'person', label: 'Mi cuenta', color: colors.primary },
    { id: 'inversiones', icon: 'trending-up', label: 'Inversiones', color: '#10B981' },
    { id: 'financiacion', icon: 'cash', label: 'Financiación', color: '#F59E0B' },
    { id: 'tarjeta', icon: 'card', label: 'Tarjeta', color: '#8B5CF6' },
    { id: 'transferencias', icon: 'swap-horizontal', label: 'Transferencias', color: '#EC4899' },
    { id: 'seguridad', icon: 'shield', label: 'Seguridad', color: '#EF4444' },
  ];

  const faqs = [
    { id: '1', question: '¿Cómo funciona la inversión en Simply?', answer: 'Tu dinero se invierte en un Fondo Común de Inversión (FCI) que genera rendimientos diarios del 22.08% TNA. Los rendimientos se acreditan todos los días hábiles a las 21:00 hs.' },
    { id: '2', question: '¿Qué es la financiación a 0% interés?', answer: 'Podés obtener hasta el 15% de tu inversión como financiación sin intereses. Este monto queda garantizado por tu inversión y podés pagarlo en 2 a 48 cuotas.' },
    { id: '3', question: '¿Cómo se descuentan las cuotas?', answer: 'Las cuotas se debitan automáticamente de tu saldo disponible en la fecha de vencimiento. Si no tenés saldo, se usa tu garantía (inversión retenida).' },
    { id: '4', question: '¿Puedo cancelar anticipadamente la financiación?', answer: 'Sí, podés pagar todas las cuotas restantes en cualquier momento sin penalidad. Esto libera tu garantía retenida.' },
    { id: '5', question: '¿Cómo solicito la tarjeta física?', answer: 'Desde la app, entrá en la sección Tarjeta y seleccioná "Solicitar tarjeta física". Llegará a tu domicilio en 7-10 días hábiles.' },
    { id: '6', question: '¿Qué pasa si pierdo mi tarjeta?', answer: 'Podés bloquearla inmediatamente desde la app en Tarjeta > Bloquear. Luego podés solicitar una nueva.' },
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContact = (method: string) => {
    switch (method) {
      case 'chat':
        Alert.alert('Chat', 'El chat está disponible de Lunes a Viernes de 9 a 18 hs');
        break;
      case 'email':
        Linking.openURL('mailto:soporte@paysur.com?subject=Consulta desde la app');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/5491123456789');
        break;
      case 'phone':
        Linking.openURL('tel:+541123456789');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.gray400} />
          <TextInput style={styles.searchInput} placeholder="¿En qué podemos ayudarte?" placeholderTextColor={colors.gray400}
            value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                  <Icon name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
          <View style={styles.faqsCard}>
            {filteredFaqs.map((faq, i) => (
              <TouchableOpacity key={faq.id} style={[styles.faqItem, i < filteredFaqs.length - 1 && styles.faqItemBorder]}
                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Icon name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} size={20} color={colors.gray400} />
                </View>
                {expandedFaq === faq.id && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contactanos</Text>
          <View style={styles.contactGrid}>
            {[
              { id: 'chat', icon: 'chatbubbles', label: 'Chat', desc: 'Respuesta inmediata' },
              { id: 'email', icon: 'mail', label: 'Email', desc: 'soporte@paysur.com' },
              { id: 'whatsapp', icon: 'logo-whatsapp', label: 'WhatsApp', desc: 'Envianos un mensaje' },
              { id: 'phone', icon: 'call', label: 'Teléfono', desc: '11 2345-6789' },
            ].map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactItem} onPress={() => handleContact(contact.id)}>
                <View style={styles.contactIcon}><Icon name={contact.icon} size={24} color={colors.primary} /></View>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={styles.contactDesc}>{contact.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Icon name="time-outline" size={20} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Horario de atención</Text>
            <Text style={styles.infoText}>Lunes a Viernes de 9:00 a 18:00 hs</Text>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          {[
            { label: 'Términos y condiciones', icon: 'document-text' },
            { label: 'Política de privacidad', icon: 'shield' },
            { label: 'Defensa al consumidor', icon: 'people' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.legalRow}>
              <Icon name={item.icon} size={20} color={colors.textSecondary} />
              <Text style={styles.legalText}>{item.label}</Text>
              <Icon name="chevron-forward" size={20} color={colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: borderRadius.lg, paddingHorizontal: 16, marginBottom: 24, ...shadows.sm },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: 12, fontSize: 15, color: colors.textPrimary },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryItem: { width: '30%', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: 16, alignItems: 'center', ...shadows.sm },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  faqsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  faqItem: { padding: 16 },
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginRight: 12 },
  faqAnswer: { fontSize: 13, color: colors.textSecondary, marginTop: 12, lineHeight: 20 },
  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contactItem: { width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 16, ...shadows.sm },
  contactIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  contactLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  contactDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: `${colors.info}10`, marginHorizontal: 16, padding: 16, borderRadius: borderRadius.md, marginBottom: 24 },
  infoContent: {},
  infoTitle: { fontSize: 14, fontWeight: '600', color: colors.info },
  infoText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  legalSection: { marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  legalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  legalText: { flex: 1, fontSize: 14, color: colors.textSecondary },
});

export default HelpScreen;
