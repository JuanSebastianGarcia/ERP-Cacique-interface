import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../../core/service/gasto.service';
import { GastoDto } from '../../../core/models/gasto-dto';
import { TipoGastoDto } from '../../../core/models/tipo-gasto-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registro-gasto',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    tipoGasto: null,
    fechaFiltro: this.obtenerFechaActual()
  };
  

  // Statistics data
  public estadisticas = {
    totalGastosHoy: 2450.00,
    totalGastosMes: 15280.00,
    gastosRegistrados: 12
  };

  // Dropdown options
  public tiposGasto: { value: number; label: string }[] = [];



  // Sample expense data for the table
  public gastosDelDia: {fecha:string | null,tipoGasto:number,descripcion:string,valor:number}[] = [];

  // UI state properties
  public isLoading = false;
  public showMensajeExito = false;


    // Toast notification variables
    public showToast: boolean = false;
    public toastMessage: string = '';
    public toastType: 'success' | 'error' = 'success';

  constructor(
    private gastoService:GastoService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.inicializarComponente();
    this.buscarGastos();
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
    

    this.gastoService.obtenerGastos(this.filtrosTabla.fechaFiltro,this.filtrosTabla.tipoGasto).subscribe({
      next: (respuesta:RespuestaDto<GastoDto[]>)=>{
        this.mapearGastos(respuesta.respuesta);
      },
      error: (error:any)=>{
        console.log(error);
      }
    });
  }

  /**
   * Mapea los gastos recibidos del servicio al formato utilizado en la tabla
   * @param gastos Array de gastos en formato GastoDto
   */
  private mapearGastos(gastos:GastoDto[]):void{
    this.gastosDelDia = gastos.map(gasto=>({
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

  public exportarGastos(): void {
    // Logic to export expenses
  }

  // CRUD operations for expense table
  public editarGasto(gasto: any): void {
    // Logic to edit expense
  }

  public eliminarGasto(gasto: any): void {
    // Logic to delete expense
  }

  public confirmarEliminacion(gasto: any): void {
    // Logic to confirm deletion
  }

  // Quick actions
  public agregarGastoRapido(): void {
    // Logic for quick expense addition (FAB button)
  }

  // Navigation methods
  public navegarAGestion(): void {
    // Logic to navigate to expense management
  }

  public navegarATiposGasto(): void {
    // Logic to navigate to expense types
  }

  public cerrarSesion(): void {
    // Logic to logout
  }

  // Utility methods
  
  /**
   * Formatea un valor numérico a formato de moneda colombiana
   * @param valor Valor numérico a formatear
   * @returns String con el valor formateado como moneda
   */
  public formatearMoneda(valor: number): string {
    return `$${valor.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }

  public obtenerColorTipoGasto(tipo: string): string {
    // Return color based on expense type
    return '';
  }

  public calcularTotalGastos(): number {
    // Calculate total expenses
    return 0;
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

}
