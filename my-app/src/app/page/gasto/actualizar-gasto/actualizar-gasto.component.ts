import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../shared/services/toast.service';
import { GastoService } from '../../../core/service/gasto.service';
import { GastoDto } from '../../../core/models/gasto-dto';
import { TipoGastoDto } from '../../../core/models/tipo-gasto-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';

@Component({
  selector: 'app-actualizar-gasto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-gasto.component.html',
  styleUrl: './actualizar-gasto.component.css'
})
export class ActualizarGastoComponent implements OnInit {

  // Datos del formulario de edición
  public gastoEditData = {
    id: 0,
    valor: 0,
    tipo: 0,
    fecha: '',
    descripcion: ''
  };

  // Lista de tipos de gasto disponibles
  public tiposGasto: TipoGastoDto[] = [];

  // Estado de carga
  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ActualizarGastoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService,
    private gastoService: GastoService
  ) {
    // Inicializar con los datos recibidos
    if (data && data.gasto) {
      this.gastoEditData = {
        id: data.gasto.id || 0,
        valor: data.gasto.valor || 0,
        tipo: data.gasto.tipoGasto?.idTipoGasto || 0,
        fecha: data.gasto.fecha || '',
        descripcion: data.gasto.descripcion || ''
      };
    }
  }

  ngOnInit(): void {
    this.cargarTiposGasto();
  }

  /**
   * Carga los tipos de gasto disponibles
   */
  private cargarTiposGasto(): void {
    this.gastoService.obtenerTiposGasto().subscribe({
      next: (respuesta: RespuestaDto<TipoGastoDto[]>) => {
        if (respuesta.error === false) {
          this.tiposGasto = respuesta.respuesta;
        } else {
          this.toastService.showError('Error al cargar los tipos de gasto');
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de gasto:', error);
        this.toastService.showError('Error al cargar los tipos de gasto');
      }
    });
  }

  /**
   * Guarda los cambios del gasto editado
   */
  public guardarCambios(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;

    const gastoDto: GastoDto = {
      id: this.gastoEditData.id,
      valor: this.gastoEditData.valor,
      tipoGastoId: this.gastoEditData.tipo,
      fecha: this.gastoEditData.fecha,
      descripcion: this.gastoEditData.descripcion
    };

    this.gastoService.editarGasto(gastoDto).subscribe({
      next: (respuesta: RespuestaDto<string>) => {
        this.isLoading = false;
        if (respuesta.error === false) {
          this.toastService.showSuccess(respuesta.respuesta);
          this.dialogRef.close({ updated: true, gasto: gastoDto });
        } else {
          this.toastService.showError('Error al actualizar el gasto');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar gasto:', error);
        this.toastService.showError('Error al actualizar el gasto');
      }
    });
  }

  /**
   * Elimina el gasto actual
   */
  public eliminarGasto(): void {
    this.isLoading = true;

    this.gastoService.eliminarGasto(this.gastoEditData.id).subscribe({
      next: (respuesta: RespuestaDto<string>) => {
        this.isLoading = false;
        if (respuesta.error === false) {
          this.toastService.showSuccess(respuesta.respuesta);
          this.dialogRef.close({ deleted: true, gastoId: this.gastoEditData.id });
        } else {
          this.toastService.showError('Error al eliminar el gasto');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al eliminar gasto:', error);
        this.toastService.showError('Error al eliminar el gasto');
      }
    });
  }

  /**
   * Valida el formulario antes de enviar
   */
  private validarFormulario(): boolean {
    if (!this.gastoEditData.valor || this.gastoEditData.valor <= 0) {
      this.toastService.showError('El valor debe ser mayor a cero');
      return false;
    }

    if (!this.gastoEditData.tipo) {
      this.toastService.showError('Debe seleccionar un tipo de gasto');
      return false;
    }

    if (!this.gastoEditData.fecha) {
      this.toastService.showError('Debe seleccionar una fecha');
      return false;
    }

    if (!this.gastoEditData.descripcion.trim()) {
      this.toastService.showError('La descripción es obligatoria');
      return false;
    }

    return true;
  }

  /**
   * Cierra el modal sin guardar cambios
   */
  public cerrarModal(): void {
    this.dialogRef.close();
  }

  /**
   * Formatea el valor como moneda
   */
  public formatearValor(): void {
    if (this.gastoEditData.valor) {
      this.gastoEditData.valor = parseFloat(this.gastoEditData.valor.toString());
    }
  }
}
