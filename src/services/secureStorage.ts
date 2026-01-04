/**
 * ============================================================================
 * SECURE STORAGE SERVICE - Simply App
 * ============================================================================
 * 
 * Almacenamiento seguro de tokens usando react-native-keychain.
 * Los tokens se guardan encriptados en el Keychain de iOS / Keystore de Android.
 * 
 * NUNCA usar AsyncStorage para tokens sensibles.
 * 
 * @version 1.0.0
 */

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes
const SERVICE_NAME = 'com.paysur.simply';
const TOKEN_USERNAME = 'auth_token';
const REFRESH_USERNAME = 'refresh_token';

// Keys para datos no sensibles (AsyncStorage está bien para estos)
const NON_SENSITIVE_KEYS = {
  ONBOARDED: '@simply:onboarded',
  USER_PREFERENCES: '@simply:preferences',
  LAST_LOGIN: '@simply:last_login',
  BIOMETRIC_ENABLED: '@simply:biometric',
};

/**
 * Almacenamiento seguro para tokens (Keychain/Keystore)
 */
export const SecureStorage = {
  /**
   * Guardar token de acceso
   */
  async setToken(token: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(TOKEN_USERNAME, token, {
        service: `${SERVICE_NAME}.token`,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  },

  /**
   * Obtener token de acceso
   */
  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${SERVICE_NAME}.token`,
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Guardar refresh token
   */
  async setRefreshToken(token: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(REFRESH_USERNAME, token, {
        service: `${SERVICE_NAME}.refresh`,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.error('Error saving refresh token:', error);
      return false;
    }
  },

  /**
   * Obtener refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${SERVICE_NAME}.refresh`,
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  /**
   * Eliminar todos los tokens (logout)
   */
  async clearTokens(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: `${SERVICE_NAME}.token` });
      await Keychain.resetGenericPassword({ service: `${SERVICE_NAME}.refresh` });
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  },

  /**
   * Guardar credenciales completas (login)
   */
  async saveCredentials(token: string, refreshToken?: string): Promise<boolean> {
    const tokenSaved = await this.setToken(token);
    if (refreshToken) {
      await this.setRefreshToken(refreshToken);
    }
    return tokenSaved;
  },

  /**
   * Verificar si hay biometría disponible
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return biometryType !== null;
    } catch (error) {
      return false;
    }
  },

  /**
   * Guardar con protección biométrica
   */
  async setWithBiometric(key: string, value: string): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(key, value, {
        service: `${SERVICE_NAME}.${key}`,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      console.error('Error saving with biometric:', error);
      return false;
    }
  },

  /**
   * Obtener con autenticación biométrica
   */
  async getWithBiometric(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${SERVICE_NAME}.${key}`,
        authenticationPrompt: {
          title: 'Autenticación requerida',
          subtitle: 'Usa tu huella o Face ID para continuar',
          cancel: 'Cancelar',
        },
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting with biometric:', error);
      return null;
    }
  },
};

/**
 * Almacenamiento regular para datos no sensibles (AsyncStorage)
 */
export const AppStorage = {
  async setOnboarded(value: boolean): Promise<void> {
    await AsyncStorage.setItem(NON_SENSITIVE_KEYS.ONBOARDED, JSON.stringify(value));
  },

  async isOnboarded(): Promise<boolean> {
    const value = await AsyncStorage.getItem(NON_SENSITIVE_KEYS.ONBOARDED);
    return value === 'true';
  },

  async setPreferences(prefs: Record<string, any>): Promise<void> {
    await AsyncStorage.setItem(NON_SENSITIVE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
  },

  async getPreferences(): Promise<Record<string, any> | null> {
    const value = await AsyncStorage.getItem(NON_SENSITIVE_KEYS.USER_PREFERENCES);
    return value ? JSON.parse(value) : null;
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(NON_SENSITIVE_KEYS.BIOMETRIC_ENABLED, JSON.stringify(enabled));
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem(NON_SENSITIVE_KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  },

  async setLastLogin(email: string): Promise<void> {
    await AsyncStorage.setItem(NON_SENSITIVE_KEYS.LAST_LOGIN, email);
  },

  async getLastLogin(): Promise<string | null> {
    return AsyncStorage.getItem(NON_SENSITIVE_KEYS.LAST_LOGIN);
  },

  async clearAll(): Promise<void> {
    await SecureStorage.clearTokens();
    const keys = Object.values(NON_SENSITIVE_KEYS);
    await AsyncStorage.multiRemove(keys);
  },
};

export default SecureStorage;
