# Toast Notification Component

Este componente proporciona un sistema de notificaciones toast reutilizable para toda la aplicación.

## Características

- ✅ Componente completamente reutilizable
- 🎨 Diseño moderno con animaciones suaves
- 📱 Responsive design
- ⚡ Fácil de usar con un servicio global
- 🔄 Manejo automático de tiempos
- 🎯 Tipos de notificación: success y error
- 👁️ Mayor visibilidad con tamaño optimizado
- 🎯 Texto más legible con tipografía mejorada

## Cómo usar

### 1. Importar el componente en tu módulo/componente

```typescript
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [
    // otros imports...
    ToastNotificationComponent
  ],
  // ...
})
export class MiComponente {
  constructor(private toastService: ToastService) {}
}
```

### 2. Agregar el componente al template

```html
<!-- Al final de tu template -->
<app-toast-notification></app-toast-notification>
```

### 3. Usar el servicio para mostrar notificaciones

```typescript
// Mostrar notificación de éxito
this.toastService.showSuccess('¡Operación exitosa!');

// Mostrar notificación de error
this.toastService.showError('Ocurrió un error');

// Mostrar notificación personalizada con duración
this.toastService.showToast('Mensaje personalizado', 'success', 5000); // 5 segundos
```

## Métodos disponibles en ToastService

### `showSuccess(message: string, duration?: number)`
Muestra una notificación de éxito.
- **message**: Mensaje a mostrar
- **duration**: Duración en ms (opcional, por defecto 4000ms)

### `showError(message: string, duration?: number)`
Muestra una notificación de error.
- **message**: Mensaje a mostrar
- **duration**: Duración en ms (opcional, por defecto 4000ms)

### `showToast(message: string, type: 'success' | 'error', duration?: number)`
Método genérico para mostrar cualquier tipo de notificación.

### `hideToast()`
Oculta la notificación inmediatamente.

## Ejemplo completo

```typescript
import { Component } from '@angular/core';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [ToastNotificationComponent],
  template: `
    <button (click)="mostrarExito()">Mostrar Éxito</button>
    <button (click)="mostrarError()">Mostrar Error</button>
    
    <!-- Toast Component -->
    <app-toast-notification></app-toast-notification>
  `
})
export class EjemploComponent {
  
  constructor(private toastService: ToastService) {}
  
  mostrarExito() {
    this.toastService.showSuccess('¡Operación completada con éxito!');
  }
  
  mostrarError() {
    this.toastService.showError('Error al procesar la solicitud');
  }
}
```

## Ventajas de esta implementación

1. **Sin repetición de código**: Un solo componente para toda la app
2. **Fácil mantenimiento**: Cambios en un solo lugar
3. **Consistencia**: Mismo diseño en toda la aplicación
4. **Flexibilidad**: Configuración de duración y tipos
5. **Performance**: Un solo componente observando el servicio global
6. **Visibilidad mejorada**: Tamaño optimizado para mejor experiencia de usuario
7. **Accesibilidad**: Texto más legible y contenido más prominente

## Especificaciones de diseño

### Tamaños
- **Ancho mínimo**: 380px (desktop) / Auto (móvil)
- **Ancho máximo**: 600px (desktop) / Auto (móvil) 
- **Padding interno**: 20px 24px (desktop) / 18px 20px (móvil)

### Tipografía
- **Mensaje**: 16px font-weight 600 (desktop) / 15px (móvil)
- **Icono**: 24px (desktop) / 22px (móvil)
- **Espaciado**: 16px entre icono y mensaje

### Efectos visuales
- **Sombra**: 0 12px 40px rgba(0, 0, 0, 0.25)
- **Border radius**: 16px
- **Backdrop filter**: blur(20px)

### Posicionamiento
- **Posición vertical**: 90px desde el top (desktop) / 80px (móvil)
- **Posición horizontal**: 20px desde la derecha (desktop) / 15px (móvil)
- **Z-index**: 10000 (aparece sobre otros elementos) 