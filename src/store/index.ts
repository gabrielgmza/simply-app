/**
 * ============================================================================
 * REDUX STORE - Simply App
 * ============================================================================
 * 
 * Configuración central del store con Redux Toolkit
 * 
 * @version 1.0.0
 */

import { configureStore, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, dashboardService, walletService, investmentService, financingService } from '../services/api';

// ============================================================================
// TIPOS
// ============================================================================

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  level: 'PLATA' | 'ORO' | 'BLACK' | 'DIAMANTE';
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  balance: number;
  cvu?: string;
  alias?: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface WalletState {
  balance: number;
  cvu: string | null;
  alias: string | null;
  transactions: any[];
  isLoading: boolean;
  error: string | null;
}

interface InvestmentState {
  active: any[];
  totalInvested: number;
  totalReturns: number;
  availableFinancing: number;
  isLoading: boolean;
  error: string | null;
}

interface FinancingState {
  active: any[];
  totalDebt: number;
  nextInstallment: any | null;
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  isFirstLaunch: boolean;
  biometricsEnabled: boolean;
  darkMode: boolean;
  notifications: any[];
  unreadCount: number;
}

// ============================================================================
// AUTH SLICE
// ============================================================================

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response.data.data;
      
      await AsyncStorage.setItem('@simply:token', token);
      await AsyncStorage.setItem('@simply:refreshToken', refreshToken);
      await AsyncStorage.setItem('@simply:user', JSON.stringify(user));
      
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error de autenticación');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignorar error de logout
    } finally {
      await AsyncStorage.multiRemove(['@simply:token', '@simply:refreshToken', '@simply:user']);
    }
    return null;
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('@simply:token');
      const userStr = await AsyncStorage.getItem('@simply:user');
      
      if (!token || !userStr) {
        return null;
      }
      
      // Verificar token válido
      const response = await authService.me();
      return { user: response.data.data, token };
    } catch (error) {
      await AsyncStorage.multiRemove(['@simply:token', '@simply:refreshToken', '@simply:user']);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

// ============================================================================
// WALLET SLICE
// ============================================================================

const initialWalletState: WalletState = {
  balance: 0,
  cvu: null,
  alias: null,
  transactions: [],
  isLoading: false,
  error: null,
};

export const fetchWallet = createAsyncThunk(
  'wallet/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [balanceRes, accountRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getAccountInfo(),
      ]);
      return {
        balance: balanceRes.data.data.balance,
        cvu: accountRes.data.data.cvu,
        alias: accountRes.data.data.alias,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error cargando wallet');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/transactions',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await walletService.getTransactions(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error cargando transacciones');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialWalletState,
  reducers: {
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.cvu = action.payload.cvu;
        state.alias = action.payload.alias;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
      });
  },
});

// ============================================================================
// INVESTMENT SLICE
// ============================================================================

const initialInvestmentState: InvestmentState = {
  active: [],
  totalInvested: 0,
  totalReturns: 0,
  availableFinancing: 0,
  isLoading: false,
  error: null,
};

export const fetchInvestments = createAsyncThunk(
  'investments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await investmentService.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error cargando inversiones');
    }
  }
);

const investmentSlice = createSlice({
  name: 'investments',
  initialState: initialInvestmentState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.active = action.payload.investments || [];
        state.totalInvested = action.payload.totalInvested || 0;
        state.totalReturns = action.payload.totalReturns || 0;
        state.availableFinancing = action.payload.availableFinancing || 0;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// FINANCING SLICE
// ============================================================================

const initialFinancingState: FinancingState = {
  active: [],
  totalDebt: 0,
  nextInstallment: null,
  isLoading: false,
  error: null,
};

export const fetchFinancing = createAsyncThunk(
  'financing/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financingService.getActive();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Error cargando financiaciones');
    }
  }
);

const financingSlice = createSlice({
  name: 'financing',
  initialState: initialFinancingState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancing.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFinancing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.active = action.payload.financings || [];
        state.totalDebt = action.payload.totalDebt || 0;
        state.nextInstallment = action.payload.nextInstallment || null;
      })
      .addCase(fetchFinancing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// APP SLICE
// ============================================================================

const initialAppState: AppState = {
  isFirstLaunch: true,
  biometricsEnabled: false,
  darkMode: false,
  notifications: [],
  unreadCount: 0,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    setBiometricsEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricsEnabled = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
});

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    wallet: walletSlice.reducer,
    investments: investmentSlice.reducer,
    financing: financingSlice.reducer,
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ============================================================================
// EXPORTS
// ============================================================================

export const { setUser, clearError } = authSlice.actions;
export const { updateBalance } = walletSlice.actions;
export const { setFirstLaunch, setBiometricsEnabled, setDarkMode, setNotifications, setUnreadCount } = appSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
