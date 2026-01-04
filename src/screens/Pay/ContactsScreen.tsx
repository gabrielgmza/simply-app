/**
 * CONTACTS SCREEN - Simply App
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { transferService } from '../../services/api';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const ContactsScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', alias: '' });

  const contacts = [
    { id: '1', name: 'Juan Pérez', alias: 'juan.perez.mp', bank: 'Mercado Pago', favorite: true },
    { id: '2', name: 'María García', alias: 'maria.garcia', bank: 'Banco Nación', favorite: true },
    { id: '3', name: 'Carlos López', alias: 'carlos.lopez.bna', bank: 'Banco Nación', favorite: false },
    { id: '4', name: 'Ana Martínez', alias: 'ana.martinez.uala', bank: 'Ualá', favorite: false },
    { id: '5', name: 'Pedro Rodríguez', alias: 'pedro.rodriguez', bank: 'Brubank', favorite: false },
  ];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter(c => c.favorite);
  const otherContacts = filteredContacts.filter(c => !c.favorite);

  const handleSelectContact = (contact: typeof contacts[0]) => {
    navigation.navigate('Transfer', { contact });
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.alias) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    try {
      await transferService.addContact({ name: newContact.name, cvu: '', alias: newContact.alias });
      Alert.alert('Contacto agregado', `${newContact.name} fue agregado a tus contactos`);
      setShowAddModal(false);
      setNewContact({ name: '', alias: '' });
    } catch (e) {
      Alert.alert('Error', 'No se pudo agregar el contacto');
    }
  };

  const handleDeleteContact = (contact: typeof contacts[0]) => {
    Alert.alert('Eliminar contacto', `¿Eliminar a ${contact.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try {
          await transferService.deleteContact(contact.id);
        } catch (e) {}
      }},
    ]);
  };

  const renderContact = (contact: typeof contacts[0]) => (
    <TouchableOpacity style={styles.contactRow} onPress={() => handleSelectContact(contact)} onLongPress={() => handleDeleteContact(contact)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{contact.name.split(' ').map(n => n[0]).join('')}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactAlias}>{contact.alias}</Text>
      </View>
      <View style={styles.contactRight}>
        {contact.favorite && <Icon name="star" size={16} color="#F59E0B" />}
        <Icon name="chevron-forward" size={20} color={colors.gray400} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contactos</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn}>
          <Icon name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray400} />
        <TextInput style={styles.searchInput} placeholder="Buscar contacto..." placeholderTextColor={colors.gray400}
          value={searchQuery} onChangeText={setSearchQuery} />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Favorites */}
        {favoriteContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favoritos</Text>
            <View style={styles.contactsCard}>
              {favoriteContacts.map((c, i) => (
                <View key={c.id}>
                  {renderContact(c)}
                  {i < favoriteContacts.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* All Contacts */}
        {otherContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todos los contactos</Text>
            <View style={styles.contactsCard}>
              {otherContacts.map((c, i) => (
                <View key={c.id}>
                  {renderContact(c)}
                  {i < otherContacts.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {filteredContacts.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="people" size={48} color={colors.gray300} />
            <Text style={styles.emptyTitle}>No hay contactos</Text>
            <Text style={styles.emptyText}>Agregá contactos para transferir más rápido</Text>
          </View>
        )}

        {/* Tip */}
        <View style={styles.tipCard}>
          <Icon name="information-circle" size={20} color={colors.info} />
          <Text style={styles.tipText}>Mantené presionado un contacto para eliminarlo</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Contact Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar contacto</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput style={styles.input} placeholder="Juan Pérez" placeholderTextColor={colors.gray400}
                value={newContact.name} onChangeText={(v) => setNewContact({ ...newContact, name: v })} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CVU o Alias</Text>
              <TextInput style={styles.input} placeholder="alias.ejemplo.mp" placeholderTextColor={colors.gray400}
                value={newContact.alias} onChangeText={(v) => setNewContact({ ...newContact, alias: v })} autoCapitalize="none" />
            </View>
            <TouchableOpacity style={styles.modalBtn} onPress={handleAddContact}>
              <Text style={styles.modalBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: borderRadius.lg, paddingHorizontal: 16, marginBottom: 16, ...shadows.sm },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: 12, fontSize: 15, color: colors.textPrimary },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  contactsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  divider: { height: 1, backgroundColor: colors.gray100, marginLeft: 70 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  contactAlias: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  contactRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginTop: 16 },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: `${colors.info}10`, marginHorizontal: 16, padding: 16, borderRadius: borderRadius.md },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.gray50, borderRadius: borderRadius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.textPrimary },
  modalBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: 8 },
  modalBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default ContactsScreen;
