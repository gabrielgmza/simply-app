/**
 * ============================================================================
 * SERVICIO API - Simply App
 * ============================================================================
 * 
 * Cliente Axios configurado para comunicación con el backend
 * Usa SecureStorage (Keychain) para tokens sensibles
 * 
 * @version 1.1.0
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SecureStorage, AppStorage } from './secureStorage';

// Configuración base
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api/app'  // Desarrollo
  : 'https://api.paysur.com/api/app'; // Producción

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agregar token desde Keychain
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si es 401 y no es retry, intentar refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStorage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          // Guardar tokens de forma segura en Keychain
          await SecureStorage.saveCredentials(token, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, logout completo
        await AppStorage.clearAll();
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================================================

export const authService = {
  // Registro
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
  }) => api.post('/auth/register', data),

  // Login
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),

  // Login con biometría
  loginWithBiometrics: (data: { userId: string; biometricToken: string }) =>
    api.post('/auth/biometric-login', data),

  // Verificar email
  verifyEmail: (token: string) => 
    api.post('/auth/verify-email', { token }),

  // Olvidé contraseña
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  // Reset password
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Refresh token
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  // Obtener usuario actual
  me: () => api.get('/auth/me'),
};

// ============================================================================
// SERVICIOS DE ONBOARDING/KYC
// ============================================================================

export const onboardingService = {
  // Estado del onboarding
  getStatus: () => api.get('/onboarding/status'),

  // Actualizar datos personales
  updatePersonalData: (data: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender?: string;
    nationality?: string;
  }) => api.post('/onboarding/personal-data', data),

  // Actualizar dirección
  updateAddress: (data: {
    street: string;
    number: string;
    floor?: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
  }) => api.post('/onboarding/address', data),

  // Iniciar KYC con didit
  startKYC: () => api.post('/onboarding/kyc/start'),

  // Verificar estado KYC
  checkKYCStatus: () => api.get('/onboarding/kyc/status'),

  // Completar onboarding
  complete: () => api.post('/onboarding/complete'),
};

// ============================================================================
// SERVICIOS DE DASHBOARD
// ============================================================================

export const dashboardService = {
  // Obtener datos del dashboard
  getData: () => api.get('/dashboard'),

  // Obtener balance
  getBalance: () => api.get('/dashboard/balance'),

  // Obtener resumen de inversiones
  getInvestmentSummary: () => api.get('/dashboard/investments'),

  // Obtener resumen de financiación
  getFinancingSummary: () => api.get('/dashboard/financing'),

  // Obtener movimientos recientes
  getRecentTransactions: (limit?: number) => 
    api.get('/dashboard/transactions', { params: { limit } }),
};

// ============================================================================
// SERVICIOS DE WALLET
// ============================================================================

export const walletService = {
  // Obtener balance
  getBalance: () => api.get('/wallet/balance'),

  // Obtener CVU/Alias
  getAccountInfo: () => api.get('/wallet/account'),

  // Actualizar alias
  updateAlias: (alias: string) => 
    api.patch('/wallet/alias', { alias }),

  // Obtener movimientos
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/wallet/transactions', { params }),

  // Obtener detalle de transacción
  getTransaction: (id: string) => api.get(`/wallet/transactions/${id}`),
};

// ============================================================================
// SERVICIOS DE TRANSFERENCIAS
// ============================================================================

export const transferService = {
  // Enviar transferencia
  send: (data: {
    destinationCvu: string;
    amount: number;
    description?: string;
  }) => api.post('/transfers/send', data),

  // Validar CVU/Alias
  validateDestination: (cvuOrAlias: string) =>
    api.get('/transfers/validate', { params: { destination: cvuOrAlias } }),

  // Obtener contactos frecuentes
  getContacts: () => api.get('/transfers/contacts'),

  // Agregar contacto
  addContact: (data: {
    name: string;
    cvu: string;
    alias?: string;
  }) => api.post('/transfers/contacts', data),

  // Eliminar contacto
  deleteContact: (id: string) => api.delete(`/transfers/contacts/${id}`),

  // Obtener límites
  getLimits: () => api.get('/transfers/limits'),
};

// ============================================================================
// SERVICIOS DE INVERSIONES
// ============================================================================

export const investmentService = {
  // Obtener inversiones activas
  getActive: () => api.get('/investments/active'),

  // Obtener historial de inversiones
  getHistory: (params?: { page?: number; limit?: number }) =>
    api.get('/investments/history', { params }),

  // Crear inversión
  create: (amount: number) => 
    api.post('/investments/create', { amount }),

  // Obtener detalle de inversión
  getDetail: (id: string) => api.get(`/investments/${id}`),

  // Obtener rendimientos
  getReturns: (id: string) => api.get(`/investments/${id}/returns`),

  // Rescatar inversión
  redeem: (id: string, amount?: number) =>
    api.post(`/investments/${id}/redeem`, { amount }),

  // Simular inversión
  simulate: (amount: number) =>
    api.post('/investments/simulate', { amount }),
};

// ============================================================================
// SERVICIOS DE FINANCIACIÓN
// ============================================================================

export const financingService = {
  // Obtener financiaciones activas
  getActive: () => api.get('/financing/active'),

  // Obtener historial
  getHistory: (params?: { page?: number; limit?: number }) =>
    api.get('/financing/history', { params }),

  // Verificar elegibilidad
  checkEligibility: () => api.get('/financing/eligibility'),

  // Simular financiación
  simulate: (data: { amount: number; installments: number }) =>
    api.post('/financing/simulate', data),

  // Solicitar financiación
  request: (data: { amount: number; installments: number }) =>
    api.post('/financing/request', data),

  // Obtener detalle
  getDetail: (id: string) => api.get(`/financing/${id}`),

  // Obtener cuotas
  getInstallments: (id: string) => api.get(`/financing/${id}/installments`),

  // Pagar cuota
  payInstallment: (financingId: string, installmentId: string) =>
    api.post(`/financing/${financingId}/installments/${installmentId}/pay`),

  // Pagar todas las cuotas restantes
  payAll: (id: string) => api.post(`/financing/${id}/pay-all`),
};

// ============================================================================
// SERVICIOS DE TARJETAS
// ============================================================================

export const cardService = {
  // Obtener tarjetas
  getCards: () => api.get('/cards'),

  // Solicitar tarjeta virtual
  requestVirtual: () => api.post('/cards/request-virtual'),

  // Solicitar tarjeta física
  requestPhysical: (data: {
    deliveryAddress: {
      street: string;
      number: string;
      city: string;
      province: string;
      postalCode: string;
    };
  }) => api.post('/cards/request-physical', data),

  // Activar tarjeta
  activate: (cardId: string, lastFourDigits: string) =>
    api.post(`/cards/${cardId}/activate`, { lastFourDigits }),

  // Bloquear tarjeta
  block: (cardId: string, reason?: string) =>
    api.post(`/cards/${cardId}/block`, { reason }),

  // Desbloquear tarjeta
  unblock: (cardId: string) => api.post(`/cards/${cardId}/unblock`),

  // Obtener PIN
  getPin: (cardId: string) => api.get(`/cards/${cardId}/pin`),

  // Cambiar PIN
  changePin: (cardId: string, newPin: string) =>
    api.post(`/cards/${cardId}/change-pin`, { newPin }),

  // Obtener límites
  getLimits: (cardId: string) => api.get(`/cards/${cardId}/limits`),

  // Actualizar límites
  updateLimits: (cardId: string, limits: { daily?: number; monthly?: number }) =>
    api.patch(`/cards/${cardId}/limits`, limits),
};

// ============================================================================
// SERVICIOS DE PERFIL
// ============================================================================

export const profileService = {
  // Obtener perfil
  get: () => api.get('/profile'),

  // Actualizar perfil
  update: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: object;
  }) => api.patch('/profile', data),

  // Cambiar contraseña
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/profile/change-password', data),

  // Configurar biometría
  setupBiometrics: (biometricToken: string) =>
    api.post('/profile/biometrics', { biometricToken }),

  // Desactivar biometría
  disableBiometrics: () => api.delete('/profile/biometrics'),

  // Obtener nivel y beneficios
  getLevel: () => api.get('/profile/level'),

  // Obtener rewards
  getRewards: () => api.get('/profile/rewards'),

  // Canjear puntos
  redeemPoints: (points: number) =>
    api.post('/profile/rewards/redeem', { points }),
};

// ============================================================================
// SERVICIOS DE NOTIFICACIONES
// ============================================================================

export const notificationService = {
  // Obtener notificaciones
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/notifications', { params }),

  // Marcar como leída
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  // Marcar todas como leídas
  markAllAsRead: () => api.post('/notifications/read-all'),

  // Registrar token FCM
  registerDevice: (token: string, platform: 'ios' | 'android') =>
    api.post('/notifications/register-device', { token, platform }),

  // Obtener preferencias
  getPreferences: () => api.get('/notifications/preferences'),

  // Actualizar preferencias
  updatePreferences: (preferences: object) =>
    api.patch('/notifications/preferences', preferences),
};

// ============================================================================
// SERVICIOS DE BANNERS (Marketing)
// ============================================================================

export const bannerService = {
  // Obtener banners activos
  getActive: (position: string) =>
    api.get(`/marketing/banners/active/${position}`),

  // Registrar click
  recordClick: (bannerId: string) =>
    api.post(`/marketing/banners/${bannerId}/click`),
};

export default api;
