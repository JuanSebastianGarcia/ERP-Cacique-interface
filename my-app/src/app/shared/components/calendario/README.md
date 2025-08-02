# Componente Calendario

Este es un componente de calendario personalizado con un diseño moderno que permite seleccionar fechas.

## Características

- ✨ Diseño moderno con animaciones suaves
- 📅 Navegación por meses
- 🎯 Selección de fechas intuitiva  
- 📱 Responsive design
- 🌟 Efectos visuales atractivos
- ⌨️ Fácil integración con formularios

## Uso Básico

### 1. Importar el componente

```typescript
import { CalendarioComponent } from './shared/components/calendario/calendario.component';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CalendarioComponent],
  templateUrl: './mi-componente.component.html'
})
export class MiComponente {
  mostrarCalendario = false;
  fechaSeleccionada: Date | null = null;

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  onFechaSeleccionada(fecha: Date) {
    this.fechaSeleccionada = fecha;
    console.log('Fecha seleccionada:', fecha);
  }

  onCalendarioCerrado() {
    this.mostrarCalendario = false;
  }
}
```

### 2. Usar en el template

```html
<!-- Botón para abrir el calendario -->
<button (click)="abrirCalendario()">
  📅 Seleccionar Fecha
</button>

<!-- Mostrar fecha seleccionada -->
<div *ngIf="fechaSeleccionada">
  Fecha seleccionada: {{ fechaSeleccionada | date:'dd/MM/yyyy' }}
</div>

<!-- Componente calendario -->
<app-calendario
  [isVisible]="mostrarCalendario"
  [selectedDate]="fechaSeleccionada"
  (dateSelected)="onFechaSeleccionada($event)"
  (calendarClosed)="onCalendarioCerrado()">
</app-calendario>
```

## Propiedades (Inputs)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isVisible` | `boolean` | Controla si el calendario está visible |
| `selectedDate` | `Date \| null` | Fecha actualmente seleccionada |

## Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `dateSelected` | `EventEmitter<Date>` | Se emite cuando se selecciona una fecha |
| `calendarClosed` | `EventEmitter<void>` | Se emite cuando se cierra el calendario |

## Ejemplo Completo para Formularios

```typescript
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarioComponent } from './shared/components/calendario/calendario.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarioComponent],
  template: `
    <form [formGroup]="miFormulario">
      <div class="campo-fecha">
        <label>Fecha:</label>
        <input 
          type="text" 
          formControlName="fecha"
          readonly
          placeholder="Seleccionar fecha"
          (click)="abrirCalendario()">
        <button type="button" (click)="abrirCalendario()">
          📅
        </button>
      </div>
    </form>

    <app-calendario
      [isVisible]="mostrarCalendario"
      [selectedDate]="fechaSeleccionada"
      (dateSelected)="onFechaSeleccionada($event)"
      (calendarClosed)="onCalendarioCerrado()">
    </app-calendario>
  `
})
export class FormularioComponent {
  miFormulario: FormGroup;
  mostrarCalendario = false;
  fechaSeleccionada: Date | null = null;

  constructor(private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
      fecha: ['']
    });
  }

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  onFechaSeleccionada(fecha: Date) {
    this.fechaSeleccionada = fecha;
    // Formatear fecha para el formulario
    const fechaFormateada = fecha.toLocaleDateString('es-ES');
    this.miFormulario.patchValue({ fecha: fechaFormateada });
  }

  onCalendarioCerrado() {
    this.mostrarCalendario = false;
  }
}
```

## Personalización de Estilos

El calendario utiliza CSS moderno con variables que puedes personalizar:

```css
/* En tu componente padre, puedes sobrescribir estilos */
::ng-deep .calendar-widget {
  --calendar-primary-color: #your-color;
  --calendar-background: #your-background;
}
```

## Notas Importantes

- El calendario es un modal que aparece centrado en la pantalla
- Incluye un backdrop para cerrar el calendario al hacer clic fuera
- Es completamente responsive y funciona bien en dispositivos móviles
- Las fechas se manejan con objetos `Date` nativos de JavaScript
- El componente es standalone y no requiere importar módulos adicionales