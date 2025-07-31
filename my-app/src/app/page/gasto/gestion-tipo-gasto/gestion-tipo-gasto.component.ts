import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GastoService } from '../../../core/service/gasto.service';
import { TipoGastoDto } from '../../../core/models/tipo-gasto-dto';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeConfirmacionComponent } from '../../../shared/components/mensaje-confirmacion/mensaje-confirmacion.component';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-gestion-tipo-gasto',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastNotificationComponent],
  templateUrl: './gestion-tipo-gasto.component.html',
  styleUrl: './gestion-tipo-gasto.component.css'
})
export class GestionTipoGastoComponent implements OnInit {

  // Lista de tipos de gasto
  tiposGasto: TipoGastoDto[] = [];
  tiposGastoFiltrados: TipoGastoDto[] = [];
  
  // Modal
  mostrarModal: boolean = false;
  editandoTipo: TipoGastoDto | null = null;
  tituloModal: string = 'Agregar Tipo';
  
  // Formularios
  nuevoTipoNombre: string = '';
  modalNombre: string = '';
  searchTerm: string = '';
  

  // Toast notification variables - REMOVED (now handled by ToastService)

  // Estado de carga
  cargando: boolean = false;

  constructor(
    private gastoService: GastoService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarTiposGasto();
  }

  /**
   * Cargar todos los tipos de gasto desde el servidor
   */
  private cargarTiposGasto(): void {
    this.cargando = true;
    this.gastoService.obtenerTiposGasto().subscribe({
      next: (response) => {
        if (!response.error) {
          this.tiposGasto = response.respuesta || [];
          this.tiposGastoFiltrados = [...this.tiposGasto];
        } else {
          this.toastService.showError('Error al cargar los tipos de gasto');
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de gasto:', error);
        this.toastService.showError('Error al cargar los tipos de gasto');
        this.cargando = false;
      }
    });
  }

  /**
   * Agregar un nuevo tipo de gasto desde el formulario principal
   */
  public agregarTipo(): void {
    const nombre = this.nuevoTipoNombre.trim();
    
    if (!nombre) {
      this.toastService.showError('Por favor ingrese el nombre del tipo');
      return;
    }

    // Verificar si ya existe
    if (this.tipoExiste(nombre)) {
      this.toastService.showError('Este tipo ya existe');
      return;
    }

    const nuevoTipo: TipoGastoDto = {
      idTipoGasto: 0, // El backend asignará el ID
      nombreTipoGasto: nombre
    };

    this.cargando = true;
    this.gastoService.crearTipoGasto(nuevoTipo).subscribe({
      next: (response) => {
        if (!response.error) {
          this.nuevoTipoNombre = '';
          this.cargarTiposGasto();
          this.toastService.showSuccess('Tipo agregado exitosamente');
        } else {
          this.toastService.showError('Error al agregar el tipo');
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al agregar tipo:', error);
        this.toastService.showError('Error al agregar el tipo');
        this.cargando = false;
      }
    });
  }


  /**
   * Abrir modal para editar tipo
   */
  editarTipo(tipo: TipoGastoDto): void {
    this.editandoTipo = { ...tipo };
    this.tituloModal = 'Editar Tipo';
    this.modalNombre = tipo.nombreTipoGasto;
    this.abrirModal();
  }

  /**
   * Eliminar un tipo de gasto
   */
  public eliminarTipo(tipo: TipoGastoDto): void {
    const dialogRef = this.dialog.open(MensajeConfirmacionComponent, {
      data: `¿Está seguro de eliminar "${tipo.nombreTipoGasto}"?`,
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'custom-dialog-panel',
      autoFocus: true,
      restoreFocus: true,
      maxWidth: '500px',
      width: '90%',
      position: {
        top: '50%',
        left: '50%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargando = true;
        this.gastoService.eliminarTipoGasto(tipo.idTipoGasto).subscribe({
          next: (response) => {
            if (!response.error) {
              this.cargarTiposGasto();
              this.toastService.showSuccess('Tipo eliminado exitosamente');
            } else {
              this.toastService.showError('Error al eliminar el tipo');
            }
            this.cargando = false;
          },
          error: (error) => {
            console.error('Error al eliminar tipo:', error);
            this.toastService.showError('Error al eliminar el tipo');
            this.cargando = false;
          }
        });
      }
    });
  }

  /**
   * Abrir modal para agregar nuevo tipo
   */
  abrirModalAgregar(): void {
    this.editandoTipo = null;
    this.tituloModal = 'Agregar Tipo';
    this.modalNombre = '';
    this.abrirModal();
  }

  /**
   * Abrir modal
   */
  abrirModal(): void {
    this.mostrarModal = true;
  }

  /**
   * Cerrar modal
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.editandoTipo = null;
    this.modalNombre = '';
  }

  /**
   * Guardar tipo desde el modal
   */
  public guardarTipo(): void {
    const nombre = this.modalNombre.trim();
    
    if (!nombre) {
      this.toastService.showError('Por favor ingrese el nombre del tipo');
      return;
    }

    if (this.editandoTipo) {
      // Editando
      if (this.tipoExiste(nombre) && nombre !== this.editandoTipo.nombreTipoGasto) {
        this.toastService.showError('Este tipo ya existe');
        return;
      }

      const tipoActualizado: TipoGastoDto = {
        idTipoGasto: this.editandoTipo.idTipoGasto,
        nombreTipoGasto: nombre
      };

      this.cargando = true;
      this.gastoService.actualizarTipoGasto(tipoActualizado).subscribe({
        next: (response) => {
          if (!response.error) {
            this.cargarTiposGasto();
            this.cerrarModal();
            this.toastService.showSuccess('Tipo actualizado exitosamente');
          } else {
            this.toastService.showError('Error al actualizar el tipo');
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al actualizar tipo:', error);
          this.toastService.showError('Error al actualizar el tipo');
          this.cargando = false;
        }
      });
    } else {
      // Agregando nuevo
      if (this.tipoExiste(nombre)) {
        this.toastService.showError('Este tipo ya existe');
        return;
      }

      const nuevoTipo: TipoGastoDto = {
        idTipoGasto: 0,
        nombreTipoGasto: nombre
      };

      this.cargando = true;
      this.gastoService.crearTipoGasto(nuevoTipo).subscribe({
        next: (response) => {
          if (!response.error) {
            this.cargarTiposGasto();
            this.cerrarModal();
            this.toastService.showSuccess('Tipo agregado exitosamente');
          } else {
            this.toastService.showError('Error al agregar el tipo');
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al agregar tipo:', error);
          this.toastService.showError('Error al agregar el tipo');
          this.cargando = false;
        }
      });
    }
  }

  /**
   * Filtrar tipos de gasto en tiempo real
   */
  filtrarTipos(): void {
    const termino = this.searchTerm.toLowerCase().trim();
    if (!termino) {
      this.tiposGastoFiltrados = [...this.tiposGasto];
    } else {
      this.tiposGastoFiltrados = this.tiposGasto.filter(tipo =>
        tipo.nombreTipoGasto.toLowerCase().includes(termino)
      );
    }
  }

  /**
   * Verificar si un tipo ya existe
   */
  private tipoExiste(nombre: string): boolean {
    return this.tiposGasto.some(tipo => 
      tipo.nombreTipoGasto.toLowerCase() === nombre.toLowerCase()
    );
  }

  /**
   * Mostrar alerta con mensaje
   */
  private mostrarAlerta(mensaje: string): void {
    this.dialog.open(MensajeAlertaComponent, {
      data: mensaje
    });
  }

  /**
   * Manejar Enter en inputs
   */
  onEnterNuevoTipo(): void {
    this.agregarTipo();
  }

  onEnterModal(): void {
    this.guardarTipo();
  }

  /**
   * Manejar Escape para cerrar modal
   */
  onEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cerrarModal();
    }
  }



  
  // Toast methods removed - now handled by centralized ToastService

}
