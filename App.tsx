/**
 * ============================================================================
 * SIMPLY APP - Punto de entrada principal
 * ============================================================================
 * 
 * Aplicación móvil híbrida para iOS y Android
 * 
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';

// Store
import store, { AppDispatch, checkAuth } from './src/store';

// Navigation
import RootNavigator from './src/navigation';

// Ignorar warnings específicos en desarrollo
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Componente interno que usa el dispatch
const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Verificar autenticación al iniciar
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <RootNavigator />
    </>
  );
};

// App principal
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
