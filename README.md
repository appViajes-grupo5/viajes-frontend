# 🌍 TravelConnect - Plataforma de Gestión de Viajes Compartidos

> **Conecta, Comparte y Viaja.** La solución integral para coordinar viajes grupales, gestionar gastos y crear comunidad.

## 🚀 Elevator Pitch
TravelConnect revoluciona la forma en que los grupos coordinan sus aventuras. Olvídate de los hilos de mensajes interminables y los Excel desordenados. Nuestra plataforma centraliza la planificación, la gestión de participantes y la experiencia de compartir gastos en una interfaz moderna y fluida. Diseñada para nómadas digitales y amigos que quieren viajar sin estrés.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura **Monorepo** separada en cliente y servidor, asegurando escalabilidad y mantenibilidad.

### C) Mapa del Proyecto

```text
/ (Raíz del Proyecto)
├── README.md                 # Documentación General
├── viajes-backend/           # Servidor API REST
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/           # Configuración de BD y constantes
│       ├── controllers/      # Lógica de negocio (Auth, Trips...)
│       ├── middlewares/      # Guards de Backend (AuthMiddleware)
│       ├── models/           # Modelos de BBDD (MySQL)
│       ├── routes/           # Definición de Endpoints
│       └── services/         # Servicios externos (Email)
│
└── viajes-frontend/          # Cliente Angular SPA
    ├── package.json
    └── src/
        ├── app/
        │   ├── components/   # Componentes UI reutilizables
        │   ├── pages/        # Vistas principales (Home, Login, Perfil)
        │   ├── services/     # Comunicación HTTP con Backend
        │   └── models/       # Interfaces TypeScript
        └── environments/     # Configuración de URLs (Dev/Prod)
```

---

## 💻 Frontend Cliente (SPA)

Aplicación Single Page Application (SPA) desarrollada en Angular para la gestión de viajes compartidos.

### 🛠️ Stack Tecnológico

*   **Framework**: Angular (Arquitectura orientada a componentes).
*   **Gestión de Estado**: RxJS (Observables y Subjects).
*   **Diseño UI**: Bootstrap 5 + Bootstrap Icons.
*   **Http Client**: Comunicación asíncrona con la API REST.

### 📋 Prerrequisitos e Instalación

1.  Asegúrate de tener Node.js instalado.
2.  Entra en el directorio del frontend:
    ```bash
    cd viajes-frontend
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    # Si encuentras conflictos de versiones, usa:
    npm install --legacy-peer-deps
    ```

### ⚙️ Configuración de Entorno

El frontend necesita saber dónde está alojado el backend.

Revisa el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api' // Asegúrate que coincida con tu backend
};
```

Si despliegas a producción, Angular usará `src/environments/environment.prod.ts`.

### 🚀 Ejecución

Para levantar el servidor de desarrollo local:

```bash
npm start
# O alternativamente:
ng serve
```

La aplicación se abrirá automáticamente (o accede manualmente) en:
**http://localhost:4200**

### 🧠 Características Técnicas Destacadas

Implementaciones clave para la defensa técnica:

*   **Autenticación JWT**: Manejo de tokens y almacenamiento seguro en LocalStorage.
*   **HTTP Interceptors**: `AuthInterceptor` inyecta automáticamente el token *Bearer* en cada petición saliente.
*   **Route Guards**: `AuthGuard` protege rutas privadas (ej: `/perfil`, `/crear-viaje`), redirigiendo al login si no hay sesión válida.
*   **Servicios Singleton**: Lógica de negocio encapsulada y reutilizable (`TripService`, `AuthService`, `ForumService`).
*   **Diseño Reactivo**: Uso de `Observables` para manejar respuestas asíncronas de la API y eventos de usuario.

---

## ✅ Estado del Proyecto

### Funcionalidades Operativas
*   🔐 **Autenticación Completa**: Registro, Login y seguridad JWT.
*   🗺️ **Gestión de Viajes**: Crear, leer, editar y eliminar viajes (CRUD).
*   👥 **Participantes**: Unirse a viajes y gestión de estado (Aceptado/Rechazado).
*   ⭐ **Sistema de Valoraciones**: Calificar usuarios y experiencias.
*   🔔 **Notificaciones**: Sistema de alertas para interacciones clave.

### 🚧 Roadmap / Próximos Pasos
*   💬 **Módulo de Comunidad (Foro)**: Espacio de discusión para viajeros (Actualmente en fase de desarrollo e integración de API).
*   📱 **Versión Mobile**: Adaptación a PWA completa.

---

## 👥 Autores

Este proyecto ha sido desarrollado como Trabajo de Fin de Máster (TFM) por:

*   **Maria Victoria Alvaro Franch**
*   **Josep Gerau Garcia Contreras**
*   **Javier Martinez Valiente**
*   **Manuel Enrique Ortiz Ros**
*   **Aurelio Romero Sanchez**
*   **Andrea Stefany Proano Muñoz**


## URL de Produccion
**https://viajes-frontend.vercel.app/**