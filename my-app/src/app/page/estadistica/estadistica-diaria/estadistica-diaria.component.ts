import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarioComponent } from '../../../shared/components/calendario/calendario.component';
import { EstadisticaService } from '../../../core/service/estadistica.service';

@Component({
  selector: 'app-estadistica-diaria',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarioComponent],
  templateUrl: './estadistica-diaria.component.html',
  styleUrl: './estadistica-diaria.component.css'
})
export class EstadisticaDiariaComponent implements OnInit {

  // Variables para KPIs
  ingresosTotales: number = 0;
  gastosTotales: number = 0;
  ingresosNetos: number = 0;
  facturasEmitidas: number = 0;
  
  // Variables para fecha
  fechaSeleccionada: string = '';
  
  // Variables para movimientos del libro contable
  movimientos: any[] = [];
  
  // Variables de estado
  cargando: boolean = false;
  error: string = '';
  
  // Variables para el calendario
  calendarioVisible: boolean = false;


  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    this.inicializarFecha();
    this.cargarDatos();
  }

  /**
   * Inicializa la fecha actual
   */
  private inicializarFecha(): void {
    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().split('T')[0];
  }

  /**
   * Carga los datos para la fecha seleccionada
   */
  private cargarDatos(): void {
    this.cargando = true;
    this.cargarKPIs();
    this.cargarMovimientos();
    this.cargando = false;
  }

  /**
   * Carga los indicadores principales (KPIs)
   */
  private cargarKPIs(): void {
    
    this.estadisticaService.getKpisDiarios(this.fechaSeleccionada).subscribe({
      next: data => {
        console.log(data);
        this.mapearKPIs(data);
      },
      error: error => {
        console.error('Error al cargar los KPIs:', error);
      }
    })
  }


  /**
   * Mapea los datos de los KPIs
   * @param data - Datos de los KPIs
   */
  private mapearKPIs(data: any): void {
    this.ingresosTotales = data.respuesta.ingresosTotalesCaja;
    this.gastosTotales = data.respuesta.gastosTotales;
    this.ingresosNetos = data.respuesta.ingresoNeto;
    this.facturasEmitidas = data.respuesta.numeroFacturasEmitidas;
  }

  /**
   * Carga los movimientos del libro contable
   */
  private cargarMovimientos(): void {
    
    this.estadisticaService.getMovimientosDiarios(this.fechaSeleccionada).subscribe({
      next: data => {
        console.log(data);
        this.mapearMovimientos(data);
      },
      error: error => {
        console.error('Error al cargar los movimientos:', error);
      }

    })
  }

  /**
   * Mapea los datos de los movimientos
   * @param data - Datos de los movimientos
   */
  private mapearMovimientos(data: any): void {
    if (data.respuesta && data.respuesta.registros) {
      this.movimientos = data.respuesta.registros.map((movimiento: any) => ({
        fecha: movimiento.fechaRegistro,
        tipo: this.mapearTipoMovimiento(movimiento.tipoMovimiento),
        valor: movimiento.valorMovimiento,
        descripcion: this.obtenerDescripcionMovimiento(movimiento.tipoMovimiento)
      }));
    } else {
      this.movimientos = [];
    }
  }

  /**
   * Mapea el tipo de movimiento del backend al formato esperado por la UI
   * @param tipoBackend - Tipo de movimiento del backend
   * @returns Tipo mapeado para la UI
   */
  private mapearTipoMovimiento(tipoBackend: string): string {
    switch (tipoBackend?.toUpperCase()) {
      case 'GASTO':
        return 'gasto';
      case 'INGRESO':
        return 'ingreso';
      default:
        return 'gasto'; // Por defecto asumimos que es un gasto
    }
  }

  /**
   * Obtiene la descripción del movimiento basada en el tipo
   * @param tipoMovimiento - Tipo de movimiento
   * @returns Descripción del movimiento
   */
  private obtenerDescripcionMovimiento(tipoMovimiento: string): string {
    switch (tipoMovimiento?.toUpperCase()) {
      case 'GASTO':
        return 'Gasto registrado';
      case 'INGRESO':
        return 'Ingreso registrado';
      default:
        return 'Movimiento registrado';
    }
  }



  /**
   * Maneja el cambio de fecha
   */
  public cambiarFecha(fecha: string): void {
    this.fechaSeleccionada = fecha;
    this.cargarDatos();
  }

  /**
   * Abre el componente de calendario
   */
  public abrirCalendario(): void {
    this.calendarioVisible = true;
  }

  /**
   * Cierra el componente de calendario
   */
  public cerrarCalendario(): void {
    this.calendarioVisible = false;
  }

  /**
   * Maneja la selección de fecha desde el calendario
   */
  public onFechaSeleccionada(fecha: Date): void {
    this.fechaSeleccionada = fecha.toISOString().split('T')[0];
    this.cargarDatos();
  }

  /**
   * Exporta los datos del libro contable
   */
  public exportarDatos(): void {
    // TODO: Implementar lógica para exportar datos
  }

  /**
   * Formatea una fecha para mostrar en español
   */
  public formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatea un valor monetario
   */
  public formatearMoneda(valor: number): string {
    return valor.toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }

  /**
   * Obtiene la clase CSS para el tipo de movimiento
   */
  public getClaseMovimiento(tipo: string): string {
    return tipo === 'ingreso' ? 'positive' : 'negative';
  }

  /**
   * Obtiene el símbolo para el tipo de movimiento
   */
  public getSimboloMovimiento(tipo: string): string {
    return tipo === 'ingreso' ? '+' : '-';
  }

  /**
   * Obtiene el icono para el tipo de movimiento
   */
  public getIconoMovimiento(tipo: string): string {
    return tipo === 'ingreso' ? '💰' : '💸';
  }

  /**
   * Obtiene el valor absoluto de un número
   * @param valor - Valor numérico
   * @returns Valor absoluto
   */
  public getValorAbsoluto(valor: number): number {
    return Math.abs(valor);
  }
}
