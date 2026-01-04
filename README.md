# Simply App - Aplicación Móvil

Aplicación móvil híbrida para iOS y Android desarrollada con React Native.

## 📱 Stack Tecnológico

- **Framework:** React Native 0.73
- **Lenguaje:** TypeScript 5.3
- **Estado:** Redux Toolkit
- **Navegación:** React Navigation v6
- **Estilos:** StyleSheet nativo + Linear Gradient
- **Almacenamiento:** AsyncStorage + MMKV
- **Biometría:** react-native-biometrics
- **Push:** Firebase Cloud Messaging

## 📁 Estructura del Proyecto

```
simply-app/
├── App.tsx                    # Punto de entrada
├── package.json
├── tsconfig.json
├── src/
│   ├── navigation/            # Configuración de navegación
│   │   └── index.tsx          # Root Navigator
│   ├── screens/               # Pantallas
│   │   ├── Auth/              # Autenticación
│   │   ├── Home/              # Dashboard
│   │   ├── Invest/            # Inversiones
│   │   ├── Pay/               # Pagos/Transferencias
│   │   ├── Card/              # Tarjetas
│   │   └── Profile/           # Perfil
│   ├── components/            # Componentes reutilizables
│   │   ├── common/
│   │   ├── cards/
│   │   ├── forms/
│   │   └── modals/
│   ├── services/              # Servicios API
│   │   └── api.ts
│   ├── store/                 # Redux Store
│   │   └── index.ts
│   ├── hooks/                 # Custom Hooks
│   ├── utils/                 # Utilidades
│   ├── theme/                 # Tema y estilos
│   │   └── index.ts
│   ├── types/                 # TypeScript types
│   └── assets/                # Recursos estáticos
```

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18
- React Native CLI
- Xcode (para iOS)
- Android Studio (para Android)

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/paysur/simply-app.git
cd simply-app

# Instalar dependencias
npm install

# iOS: Instalar pods
cd ios && pod install && cd ..

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android
```

## 📱 Pantallas Principales

### Auth Flow
- **SplashScreen:** Pantalla de carga inicial
- **OnboardingScreen:** Introducción para nuevos usuarios
- **LoginScreen:** Inicio de sesión (email + biometría)
- **RegisterScreen:** Registro de usuario
- **KYCScreen:** Verificación de identidad

### Main App (Bottom Tabs)
- **Home:** Dashboard con balance, acciones rápidas, movimientos
- **Invest:** Inversiones FCI, rendimientos, financiación
- **Pay:** Transferencias, pago de servicios, recargas
- **Card:** Tarjetas VISA virtual/física
- **Profile:** Configuración, nivel, rewards

## 🎨 Sistema de Diseño

### Colores Principales
```typescript
primary: '#6366F1'     // Indigo
secondary: '#8B5CF6'   // Violeta
success: '#10B981'     // Verde
warning: '#F59E0B'     // Amarillo
error: '#EF4444'       // Rojo
```

### Colores por Nivel
```typescript
PLATA: '#C0C0C0'       // Plata
ORO: '#FFD700'         // Oro
BLACK: '#1F2937'       // Negro/Gris oscuro
DIAMANTE: '#60A5FA'    // Azul diamante
```

## 🔐 Seguridad

- **Autenticación:** JWT + Refresh Token
- **Biometría:** Face ID / Touch ID / Fingerprint
- **Almacenamiento seguro:** Keychain/Keystore
- **SSL Pinning:** Certificados anclados
- **Detección de root/jailbreak**

## 🔔 Notificaciones Push

Configurado con Firebase Cloud Messaging (FCM):

```typescript
// Tipos de notificaciones
- Transacciones (envío/recepción)
- Rendimientos FCI
- Cuotas próximas a vencer
- Alertas de seguridad
- Promociones
```

## 📦 Build para Producción

### iOS
```bash
cd ios
xcodebuild -workspace SimplyApp.xcworkspace -scheme SimplyApp -configuration Release archive
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## 🌐 Variables de Entorno

Crear archivo `.env`:

```
API_URL=https://api.paysur.com
FIREBASE_PROJECT_ID=simply-app
```

## 📄 Licencia

Propiedad de PaySur S.A. - Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025
