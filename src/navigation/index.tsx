/**
 * ============================================================================
 * NAVEGACIÓN - Simply App
 * ============================================================================
 * 
 * Configuración de navegación con React Navigation:
 * - Stack Navigator para flujos de auth
 * - Bottom Tab Navigator para la app principal
 * 
 * @version 1.0.0
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Store
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Theme
import { colors } from '../theme';

// Auth Screens
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import KYCScreen from '../screens/Auth/KYCScreen';

// Main Screens
import HomeScreen from '../screens/Home/HomeScreen';
import TransactionsScreen from '../screens/Home/TransactionsScreen';
import TransactionDetailScreen from '../screens/Home/TransactionDetailScreen';
import QRScreen from '../screens/Home/QRScreen';

import InvestScreen from '../screens/Invest/InvestScreen';
import InvestDetailScreen from '../screens/Invest/InvestDetailScreen';
import NewInvestmentScreen from '../screens/Invest/NewInvestmentScreen';
import FinancingScreen from '../screens/Invest/FinancingScreen';
import NewFinancingScreen from '../screens/Invest/NewFinancingScreen';

import PayScreen from '../screens/Pay/PayScreen';
import TransferScreen from '../screens/Pay/TransferScreen';
import ServicesScreen from '../screens/Pay/ServicesScreen';
import RechargeScreen from '../screens/Pay/RechargeScreen';
import ContactsScreen from '../screens/Pay/ContactsScreen';

import CardScreen from '../screens/Card/CardScreen';
import CardDetailScreen from '../screens/Card/CardDetailScreen';
import RequestCardScreen from '../screens/Card/RequestCardScreen';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import SecurityScreen from '../screens/Profile/SecurityScreen';
import LevelScreen from '../screens/Profile/LevelScreen';
import RewardsScreen from '../screens/Profile/RewardsScreen';
import HelpScreen from '../screens/Profile/HelpScreen';

// ============================================================================
// TYPES
// ============================================================================

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  KYC: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  InvestTab: undefined;
  PayTab: undefined;
  CardTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Transactions: undefined;
  TransactionDetail: { id: string };
  QR: undefined;
};

export type InvestStackParamList = {
  Invest: undefined;
  InvestDetail: { id: string };
  NewInvestment: undefined;
  Financing: undefined;
  FinancingDetail: { id: string };
  NewFinancing: undefined;
};

export type PayStackParamList = {
  Pay: undefined;
  Transfer: { contact?: any };
  Services: undefined;
  Recharge: undefined;
  Contacts: undefined;
};

export type CardStackParamList = {
  Card: undefined;
  CardDetail: { id: string };
  RequestCard: { type: 'virtual' | 'physical' };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Security: undefined;
  Level: undefined;
  Rewards: undefined;
  Help: undefined;
};

// ============================================================================
// NAVIGATORS
// ============================================================================

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const InvestStack = createNativeStackNavigator<InvestStackParamList>();
const PayStack = createNativeStackNavigator<PayStackParamList>();
const CardStack = createNativeStackNavigator<CardStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// ============================================================================
// STACK NAVIGATORS
// ============================================================================

const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Transactions" component={TransactionsScreen} />
    <HomeStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    <HomeStack.Screen name="QR" component={QRScreen} />
  </HomeStack.Navigator>
);

const InvestNavigator = () => (
  <InvestStack.Navigator screenOptions={{ headerShown: false }}>
    <InvestStack.Screen name="Invest" component={InvestScreen} />
    <InvestStack.Screen name="InvestDetail" component={InvestDetailScreen} />
    <InvestStack.Screen name="NewInvestment" component={NewInvestmentScreen} />
    <InvestStack.Screen name="Financing" component={FinancingScreen} />
    <InvestStack.Screen name="NewFinancing" component={NewFinancingScreen} />
  </InvestStack.Navigator>
);

const PayNavigator = () => (
  <PayStack.Navigator screenOptions={{ headerShown: false }}>
    <PayStack.Screen name="Pay" component={PayScreen} />
    <PayStack.Screen name="Transfer" component={TransferScreen} />
    <PayStack.Screen name="Services" component={ServicesScreen} />
    <PayStack.Screen name="Recharge" component={RechargeScreen} />
    <PayStack.Screen name="Contacts" component={ContactsScreen} />
  </PayStack.Navigator>
);

const CardNavigator = () => (
  <CardStack.Navigator screenOptions={{ headerShown: false }}>
    <CardStack.Screen name="Card" component={CardScreen} />
    <CardStack.Screen name="CardDetail" component={CardDetailScreen} />
    <CardStack.Screen name="RequestCard" component={RequestCardScreen} />
  </CardStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Security" component={SecurityScreen} />
    <ProfileStack.Screen name="Level" component={LevelScreen} />
    <ProfileStack.Screen name="Rewards" component={RewardsScreen} />
    <ProfileStack.Screen name="Help" component={HelpScreen} />
  </ProfileStack.Navigator>
);

// ============================================================================
// TAB NAVIGATOR
// ============================================================================

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'InvestTab':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'PayTab':
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case 'CardTab':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeNavigator} 
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="InvestTab" 
        component={InvestNavigator} 
        options={{ tabBarLabel: 'Invertir' }}
      />
      <Tab.Screen 
        name="PayTab" 
        component={PayNavigator} 
        options={{ tabBarLabel: 'Pagar' }}
      />
      <Tab.Screen 
        name="CardTab" 
        component={CardNavigator} 
        options={{ tabBarLabel: 'Tarjeta' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileNavigator} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// ============================================================================
// ROOT NAVIGATOR
// ============================================================================

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const { isFirstLaunch } = useSelector((state: RootState) => state.app);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Flow
          <>
            {isFirstLaunch && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="KYC" component={KYCScreen} />
          </>
        ) : (
          // Main App
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
