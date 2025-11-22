# 📘 Documentación de Rama: Feature Gestión de Viajes (CRUD)

> ⚠️ **AVISO INFORMATIVO:**
> Este archivo es documentación exclusiva para la revisión de la rama `feature/creacion-viajes`.
> Su objetivo es facilitar la corrección y el testing por parte del equipo.
> **Por favor, revisar y eliminar este archivo antes (o durante) la fusión con la rama `develop`.**

---

## 📦 1. Resumen Técnico y Arquitectura

Esta feature implementa el sistema completo de gestión de viajes. Se ha seguido una arquitectura modular basada en **Angular 18+ (Standalone)**.

### 📂 Estructura de Nuevos Archivos
```text
src/app/
├── models/
│   └── trip.interface.ts       # Definición de tipos (Interfaz Trip)
├── services/
│   └── trip.service.ts         # Gestión de estado reactivo con Signals
├── components/
│   └── trip-card/              # Componente reutilizable (UI Tarjeta)
└── pages/
    ├── trip-detail/            # Lógica de visualización y borrado
    └── trip-form/              # Formulario inteligente (Crear y Editar)

🔄 Nuevas Rutas Protegidas (Lazy Loading)
En app.routes.ts se han inyectado:

GET /viaje/:id - Detalle del viaje.

GET /crear-viaje - (Protegida con authGuard)

GET /editar-viaje/:id - (Protegida con authGuard)

💡 Decisiones Técnicas Clave
Signals: Uso de signal<Trip[]> en lugar de Arrays/Observables para optimizar el rendimiento.

Control Flow: Sintaxis moderna @for y @if en HTML.

Reactive Forms: Validaciones estrictas en la creación/edición.

UX: Redirecciones automáticas y feedback visual inmediato.

🧪 2. Guía de Pruebas (Testing Manual)
Sigue estos pasos para validar que la funcionalidad es correcta:

Paso A: Crear un Viaje 🆕
Inicia sesión (o asegúrate de tener token para el Guard).

Navega a /crear-viaje o pulsa el botón "Empieza tu aventura" en la Home.

Rellena el formulario.

Nota: El campo imagen tiene un generador aleatorio por defecto, pero puedes pegar una URL real.

Pulsa "Publicar Viaje".

Resultado esperado: El sistema te redirige automáticamente a la ficha del viaje creado.

Paso B: Ver y Editar ✏️
Desde la ficha del viaje, verifica que se muestran los iconos de transporte, fechas y coste.

Pulsa el botón "Editar".

Modifica algún dato (ej: cambia el título o el precio).

Pulsa "Guardar Cambios".

Resultado esperado: Vuelves al detalle y los datos se han actualizado al instante.

Paso C: Borrar 🗑️
En el detalle del viaje, pulsa el botón rojo "Borrar".

Acepta la confirmación del navegador.

Resultado esperado: Redirección a la Home. El viaje eliminado ya no aparece en la lista.

📝 Notas Finales
Persistencia: Al trabajar sin Backend real, los datos se almacenan en memoria volátil. Si recargas la página (F5), los viajes creados manualmente desaparecerán.


