import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticaService } from '../../../core/service/estadistica.service';

@Component({
  selector: 'app-estadistica-historica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadistica-historica.component.html',
  styleUrl: './estadistica-historica.component.css'
})
export class EstadisticaHistoricaComponent implements OnInit {

  // Variables para KPIs
  ingresosTotales: number = 0;
  gastosTotales: number = 0;
  ingresosNetos: number = 0;
  productosVendidos: number = 0;
  
  // Variables para cambios porcentuales
  cambioIngresos: number = 0;
  cambioGastos: number = 0;
  cambioNeto: number = 0;
  cambioProductos: number = 0;
  
  // Variables para criterios de análisis
  criterioSeleccionado: string = 'prenda';
  
  // Variables para datos de gráficos
  datosGrafico30Dias: any[] = [];
  datosGrafico12Meses: any[] = [];
  datosGraficoAnual: any[] = [];
  datosGraficoPie: any[] = [];
  
  // Variables para etiquetas de gráficos
  etiquetas30Dias: string[] = [];
  etiquetas12Meses: string[] = [];
  etiquetasAnual: string[] = [];
  etiquetasPie: string[] = [];
  
  // Variables para tipo de datos del gráfico
  tipoDatosGrafico: string = 'ingresos';
  
  // Variables de estado
  cargando: boolean = false;
  error: string = '';

  constructor(private estadisticaService: EstadisticaService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga los datos iniciales del dashboard
   */
  private cargarDatos(): void {
    this.cargando = true;
    this.cargarKPIs();
    this.cargarDatosGraficos();
    this.cargarDatosAnalisis();
    this.cargando = false;
  }

  /**
   * Carga los indicadores principales (KPIs)
   */
  private cargarKPIs(): void {
    this.estadisticaService.getKPIsMensuales().subscribe({
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
    this.ingresosTotales = data.respuesta.ingresosTotalesMesActual;
    this.gastosTotales = data.respuesta.gastosTotalesMesActual;
    this.ingresosNetos = data.respuesta.utilidadNetaMesActual;
    this.productosVendidos = data.respuesta.productosVendidosMesActual;
  }

  /**
   * Carga los datos para los gráficos históricos
   */
  private cargarDatosGraficos(): void {
    // TODO: Implementar lógica para cargar datos de gráficos
  }

  /**
   * Carga los datos para el análisis de productos
   */
  private cargarDatosAnalisis(): void {
    // TODO: Implementar lógica para cargar datos de análisis
  }

  /**
   * Actualiza el tipo de datos del gráfico
   */
  public cambiarTipoGrafico(tipo: string): void {
    this.tipoDatosGrafico = tipo;
    // TODO: Implementar lógica para actualizar gráficos
  }

  /**
   * Cambia el criterio de análisis
   */
  public cambiarCriterioAnalisis(criterio: string): void {
    this.criterioSeleccionado = criterio;
    // TODO: Implementar lógica para actualizar análisis
  }

  /**
   * Genera las etiquetas para el gráfico de 30 días
   */
  private generarEtiquetas30Dias(): void {
    // TODO: Implementar lógica para generar etiquetas
  }

  /**
   * Genera las etiquetas para el gráfico de 12 meses
   */
  private generarEtiquetas12Meses(): void {
    // TODO: Implementar lógica para generar etiquetas
  }

  /**
   * Genera las etiquetas para el gráfico anual
   */
  private generarEtiquetasAnual(): void {
    // TODO: Implementar lógica para generar etiquetas
  }
}
