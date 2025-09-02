import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GastoService } from '../../../core/service/gasto.service';
import { GastoDto } from '../../../core/models/gasto-dto';
import { TipoGastoDto } from '../../../core/models/tipo-gasto-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { DatePipe } from '@angular/common';
import { EstadisticasDto } from '../../../core/models/estadisticas-gastos-dto';
import { MensajeConfirmacionComponent } from '../../../shared/components/mensaje-confirmacion/mensaje-confirmacion.component';
import { ActualizarGastoComponent } from '../actualizar-gasto/actualizar-gasto.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarioComponent } from '../../../shared/components/calendario/calendario.component';

@Component({
  selector: 'app-registro-gasto',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    CalendarioComponent
  ],
  providers: [DatePipe],
  templateUrl: './registro-gasto.component.html',
  styleUrl: './registro-gasto.component.css'
})
export class RegistroGastoComponent implements OnInit {

  // Form data properties
  public gastoFormData = {
    valor: 0,
    tipo: 0,
    fecha: this.obtenerFechaActual(),
    descripcion: ''
  };

  // Filter properties for the expense table
  public filtrosTabla: {
    tipoGasto: number | null;
    fechaFiltro: string; // o Date si usas objetos fecha
  } = {
    tipoGasto:null,
    fechaFiltro: this.obtenerFechaActual()
  };
  

  // Statistics data
  public estadisticas = {
    totalGastosHoy: 0,
    totalGastosMes: 0,
    gastosRegistrados: 0
  };

  // Dropdown options
  public tiposGasto: { value: number; label: string }[] = [];



  // Sample expense data for the table
  public gastosDelDia: {id:number,fecha:string | null,tipoGasto:number,descripcion:string,valor:number}[] = [];

  // UI state properties
  public isLoading = false;
  public showMensajeExito = false;

  // Toast notification variables
  public showToast: boolean = false;
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';

  // Calendar control properties
  public mostrarCalendarioFormulario: boolean = false;
  public mostrarCalendarioFiltro: boolean = false;
  public fechaSeleccionadaFormulario: Date | null = null;
  public fechaSeleccionadaFiltro: Date | null = null;

  constructor(
    private gastoService:GastoService,
    private datePipe:DatePipe,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.inicializarComponente();
    this.buscarGastos();
    this.obtenerEstadisticas();
  }

  // Initialization methods
  
  /**
   * Inicializa el componente cargando los tipos de gasto disponibles
   */
  public inicializarComponente(): void {
    
    this.gastoService.obtenerTiposGasto().subscribe({
      next: (respuesta:RespuestaDto<TipoGastoDto[]>)=>{
        let tipoGastos:TipoGastoDto[] = respuesta.respuesta;
        this.tiposGasto = tipoGastos.map(tipo=>({
          value:tipo.idTipoGasto,
          label:tipo.nombreTipoGasto
        }));
      },
      error: (error:any)=>{
        console.log(error);
      }
    });
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   * @returns String con la fecha actual
   */
  private obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }); // 'YYYY-MM-DD'
  }



  // Form handling methods
  
  /**
   * Registra un nuevo gasto utilizando los datos del formulario
   */
  public registrarGasto(): void {
    if (!this.validarFormulario()) {
      this.showToastNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.isLoading = true;
    let gastoDto:GastoDto = this.getGastoDto()

    this.gastoService.crearGasto(gastoDto).subscribe({
      next: (respuesta:RespuestaDto<string>)=>{
        this.showToastNotification(respuesta.respuesta, 'success');
        this.limpiarFormulario();
        this.buscarGastos(); // Actualizar la tabla
        this.isLoading = false;
        this.obtenerEstadisticas();
      },
      error: (error:any)=>{
          this.showToastNotification('Ocurrió un error al registrar el gasto', 'error');
          this.isLoading = false;
      }
    });
  }

  /**
   * Convierte los datos del formulario a un objeto GastoDto
   * @returns Objeto GastoDto con los datos del formulario
   */
  private getGastoDto(): GastoDto{
    return {
      id: 0,
      valor: this.gastoFormData.valor,
      descripcion: this.gastoFormData.descripcion,
      fecha: this.gastoFormData.fecha,
      tipoGastoId: this.gastoFormData.tipo
    }  
  }



  /**
   * Limpia todos los campos del formulario de registro
   */
  public limpiarFormulario(): void {
    this.gastoFormData = {
      valor: 0,
      tipo: 0,
      fecha: this.obtenerFechaActual(),
      descripcion: ''
    };
  }



  /**
   * Valida que todos los campos requeridos del formulario estén completos
   * @returns true si el formulario es válido, false en caso contrario
   */
  public validarFormulario(): boolean {
    return this.gastoFormData.valor > 0 && 
           this.gastoFormData.tipo > 0 && 
           this.gastoFormData.fecha.length > 0 && 
           this.gastoFormData.descripcion.trim().length > 0;
  }

  // Table and filter methods
  
  /**
   * Busca gastos aplicando los filtros de fecha y tipo de gasto seleccionados
   */
  public buscarGastos(): void {
    

    // Si no se ha seleccionado un tipo de gasto, se buscan todos los gastos
    if (this.filtrosTabla.tipoGasto == null){  
    
        this.gastoService.obtenerGastos(this.filtrosTabla.fechaFiltro).subscribe({
          next: (respuesta:RespuestaDto<GastoDto[]>)=>{
            this.mapearGastos(respuesta.respuesta);
          },
          error: (error:any)=>{
            console.log(error);
          }
        });
      }


      // Si se ha seleccionado un tipo de gasto, se buscan los gastos de ese tipo
      else{
        this.gastoService.obtenerGastosByTipo(this.filtrosTabla.fechaFiltro,this.filtrosTabla.tipoGasto).subscribe({
          next: (respuesta:RespuestaDto<GastoDto[]>)=>{
            this.mapearGastos(respuesta.respuesta);
          },
          error: (error:any)=>{
            console.log(error);
          }
        });
      }
  }


  
  /**
   * Mapea los gastos recibidos del servicio al formato utilizado en la tabla
   * @param gastos Array de gastos en formato GastoDto
   */
  private mapearGastos(gastos:GastoDto[]):void{
    this.gastosDelDia = gastos.map(gasto=>({
      id: gasto.id,
      fecha: this.formatearFecha(gasto.fecha),
      tipoGasto:gasto.tipoGastoId,
      descripcion:gasto.descripcion,
      valor:gasto.valor
    }));
  }



  private formatearFecha(fechaISO: string): string {
    if (!fechaISO) return 'Sin fecha';
    
    try {
      const fecha = new Date(fechaISO);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return fechaISO; // Devolver la fecha original si no es válida
      }

      // Formatear la fecha en español
      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      };

      return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return fechaISO; // Devolver la fecha original en caso de error
    }
  }


  public aplicarFiltros(): void {
    // Logic to apply filters
  }


  private obtenerEstadisticas(): void {
    this.gastoService.obtenerEstadisticas().subscribe({
      next: (respuesta:RespuestaDto<EstadisticasDto>)=>{
        this.mapearEstadisticas(respuesta.respuesta);
      }
    });
  }


  private mapearEstadisticas(estadisticas:EstadisticasDto):void{
    this.estadisticas.gastosRegistrados = estadisticas.totalNumeroGastos;
    this.estadisticas.totalGastosHoy = estadisticas.totalGastosHoy;
    this.estadisticas.totalGastosMes = estadisticas.TotalGastosMes;
  }

  public eliminarGasto(id: number): void {
    // Buscar el gasto para obtener información adicional para el mensaje
    const gasto = this.gastosDelDia.find(g => g.id === id);
    const tipoGastoNombre = this.tiposGasto.find(t => t.value === gasto?.tipoGasto)?.label || 'este gasto';
    
    const dialogRef = this.dialog.open(MensajeConfirmacionComponent, {
      data: `¿Está seguro de eliminar el gasto "${tipoGastoNombre}" por valor de ${this.formatearMoneda(gasto?.valor || 0)}?`,
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
        this.gastoService.eliminarGasto(id).subscribe({
          next: (respuesta:RespuestaDto<string>)=>{
            this.showToastNotification(respuesta.respuesta, 'success');
            this.buscarGastos();
            this.obtenerEstadisticas();
          },
          error: (error:any)=>{
            this.showToastNotification('Ocurrió un error al eliminar el gasto', 'error');
          }
        });
      }
    });
  }

  /**
   * Obtiene el nombre del tipo de gasto a partir de su ID
   * @param tipoGastoId ID del tipo de gasto
   * @returns Nombre del tipo de gasto o 'Sin tipo' si no se encuentra
   */
  public obtenerNombreTipoGasto(tipoGastoId: number): string {
    const tipo = this.tiposGasto.find(t => t.value === tipoGastoId);
    return tipo ? tipo.label : 'Sin tipo';
  }

  /**
   * Formatea un valor numérico a formato de moneda colombiana
   * @param valor Valor numérico a formatear
   * @returns String con el valor formateado como moneda
   */
  public formatearMoneda(valor: number): string {
    return `$${valor.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }


  // Toast methods removed - now handled by centralized ToastService

  /**
   * Abre el modal para editar un gasto específico
   * @param gastoId - ID del gasto a editar
   */
  public editarGasto(gastoId: number): void {
    // Buscar el gasto en la lista
    const gastoAEditar = this.gastosDelDia.find(gasto => gasto.id === gastoId);
    
    if (!gastoAEditar) {
      this.showToastNotification('Gasto no encontrado', 'error');
      return;
    }

    // Abrir el modal de edición
    const dialogRef = this.dialog.open(ActualizarGastoComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        gasto: gastoAEditar
      }
    });

    // Manejar el resultado del modal
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.updated) {
          // Gasto actualizado - recargar la lista
          this.buscarGastos();
          this.obtenerEstadisticas();
          console.log('Gasto actualizado exitosamente');
        } else if (result.deleted) {
          // Gasto eliminado - recargar la lista
          this.buscarGastos();
          this.obtenerEstadisticas();
          console.log('Gasto eliminado exitosamente');
        }
      }
    });
  }

  /**
   * Muestra una notificación toast con mensaje y tipo especificado
   * @param message - Mensaje a mostrar en el toast
   * @param type - Tipo de notificación ('success' o 'error')
   */
  private showToastNotification(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto hide toast after 4 seconds
    setTimeout(() => {
      this.hideToast();
    }, 4000);
  }

  /**
   * Oculta el toast con animación suave
   */
  public hideToast(): void {
    const toastElement = document.querySelector('.toast-container');
    if (toastElement) {
      toastElement.classList.add('toast-hiding');
      setTimeout(() => {
        this.showToast = false;
      }, 300);
    } else {
      this.showToast = false;
    }
  }

  // ========================= MÉTODOS PARA CALENDARIO =========================

  /**
   * Abre el calendario para el formulario de registro
   */
  public abrirCalendarioFormulario(): void {
    // Si ya hay una fecha en el formulario, usarla como fecha inicial
    if (this.gastoFormData.fecha) {
      this.fechaSeleccionadaFormulario = new Date(this.gastoFormData.fecha);
    } else {
      this.fechaSeleccionadaFormulario = new Date();
    }
    this.mostrarCalendarioFormulario = true;
  }

  /**
   * Abre el calendario para el filtro de la tabla
   */
  public abrirCalendarioFiltro(): void {
    // Si ya hay una fecha en el filtro, usarla como fecha inicial
    if (this.filtrosTabla.fechaFiltro) {
      this.fechaSeleccionadaFiltro = new Date(this.filtrosTabla.fechaFiltro);
    } else {
      this.fechaSeleccionadaFiltro = new Date();
    }
    this.mostrarCalendarioFiltro = true;
  }

  /**
   * Maneja la selección de fecha del calendario del formulario
   */
  public onFechaSeleccionadaFormulario(fecha: Date): void {
    this.fechaSeleccionadaFormulario = fecha;
    // Convertir a formato string para el modelo del formulario (YYYY-MM-DD)
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    this.gastoFormData.fecha = `${year}-${month}-${day}`;
    
    console.log('Fecha seleccionada para formulario:', this.gastoFormData.fecha);
    this.showToastNotification(`Fecha seleccionada: ${day}/${month}/${year}`, 'success');
  }

  /**
   * Maneja la selección de fecha del calendario del filtro
   */
  public onFechaSeleccionadaFiltro(fecha: Date): void {
    this.fechaSeleccionadaFiltro = fecha;
    // Convertir a formato string para el filtro (YYYY-MM-DD)
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    this.filtrosTabla.fechaFiltro = `${year}-${month}-${day}`;
    
    console.log('Fecha seleccionada para filtro:', this.filtrosTabla.fechaFiltro);
    this.showToastNotification(`Filtro de fecha: ${day}/${month}/${year}`, 'success');
    
    // Aplicar filtros automáticamente cuando se selecciona una fecha
    this.aplicarFiltros();
  }

  /**
   * Cierra el calendario del formulario
   */
  public onCalendarioFormularioCerrado(): void {
    this.mostrarCalendarioFormulario = false;
  }

  /**
   * Cierra el calendario del filtro
   */
  public onCalendarioFiltroCerrado(): void {
    this.mostrarCalendarioFiltro = false;
  }

  /**
   * Obtiene la fecha formateada para mostrar en la UI
   */
  public obtenerFechaFormateada(fechaString: string): string {
    if (!fechaString) return 'Seleccionar fecha';
  
    const [year, month, day] = fechaString.split('-').map(Number);
    // mes -1 porque Date usa 0=enero, 11=diciembre
    const fecha = new Date(year, month - 1, day);
  
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const yyyy = fecha.getFullYear();
  
    return `${dd}/${mm}/${yyyy}`;
  }

}
