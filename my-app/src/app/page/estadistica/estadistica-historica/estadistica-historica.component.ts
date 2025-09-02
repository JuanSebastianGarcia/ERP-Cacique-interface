import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticaService } from '../../../core/service/estadistica.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-estadistica-historica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadistica-historica.component.html',
  styleUrl: './estadistica-historica.component.css'
})
export class EstadisticaHistoricaComponent implements OnInit, AfterViewInit, OnDestroy {

  // Referencias a los elementos canvas de los gráficos
  @ViewChild('chart30Days', { static: false }) chart30DaysRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart12Months', { static: false }) chart12MonthsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartYearly', { static: false }) chartYearlyRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartPie', { static: false }) chartPieRef!: ElementRef<HTMLCanvasElement>;

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

  // Instancias de los gráficos
  private chart30Days: Chart | null = null;
  private chart12Months: Chart | null = null;
  private chartYearly: Chart | null = null;
  private chartPie: Chart | null = null;

  constructor(private estadisticaService: EstadisticaService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    // Los gráficos se inicializarán después de que se carguen los datos
  }

  ngOnDestroy(): void {
    // Limpiar los gráficos al destruir el componente
    if (this.chart30Days) {
      this.chart30Days.destroy();
    }
    if (this.chart12Months) {
      this.chart12Months.destroy();
    }
    if (this.chartYearly) {
      this.chartYearly.destroy();
    }
    if (this.chartPie) {
      this.chartPie.destroy();
    }
  }

  /**
   * Carga los datos iniciales del dashboard
   */
  private cargarDatos(): void {
    this.cargando = true;
    this.cargarKPIs();
    this.cargarDatosGraficos("INGRESOS");
    this.cargarDatosAgrupados();
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
   **/
  private mapearKPIs(data: any): void {
    this.ingresosTotales = data.respuesta.ingresosTotalesMesActual;
    this.gastosTotales = data.respuesta.gastosTotalesMesActual;
    this.ingresosNetos = data.respuesta.utilidadNetaMesActual;
    this.productosVendidos = data.respuesta.productosVendidosMesActual;
  }

  /**
   * Carga los datos para los gráficos históricos
   */
  private cargarDatosGraficos(tipo: string): void {
    
    this.estadisticaService.getDatosGraficos(tipo).subscribe({
      next: data => {
        this.mapearDatosGraficos(data);
      },
      error: error => {
        console.error('Error al cargar los datos de gráficos:', error);
      }
    })
  }


  /**
   * Mapea los datos de los gráficos
   * @param data - Datos de los gráficos
   */
  private mapearDatosGraficos(data: any): void {
    if (data && data.respuesta) {
      // Mapear datos de gráfico diario (últimos 30 días)
      if (data.respuesta.graficaDiaria) {
        this.datosGrafico30Dias = data.respuesta.graficaDiaria
          .map((item: any) => ({
            fecha: item.fecha,
            valor: item.valor
          }))
          .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        this.etiquetas30Dias = this.datosGrafico30Dias.map(item => this.formatearFecha(item.fecha));
      }

      // Mapear datos de gráfico mensual (últimos 12 meses)
      if (data.respuesta.graficaMensual) {
        this.datosGrafico12Meses = data.respuesta.graficaMensual
          .map((item: any) => ({
            mes: item.mes, // mantener como string
            valor: item.valor
          }))
          .sort((a: any, b: any) => this.obtenerNumeroMes(a.mes) - this.obtenerNumeroMes(b.mes)); 
        this.etiquetas12Meses = this.datosGrafico12Meses.map(item => this.traducirMes(item.mes));
      }

      // Mapear datos de gráfico anual
      if (data.respuesta.graficaAnual) {
        this.datosGraficoAnual = data.respuesta.graficaAnual.map((item: any) => ({
          anio: item.anio,
          valor: item.valor
        }));
        this.etiquetasAnual = this.datosGraficoAnual.map(item => item.anio);
      }

      // Cargar los gráficos después de mapear los datos
      setTimeout(() => {
        this.cargarGrafico30Dias();
        this.cargarGrafico12Meses();
        this.cargarGraficoAnual();
      }, 100);
    }
  }

  
  /**
   * Formatea una fecha para mostrar en el gráfico
   * @param fecha - Fecha en formato string
   * @returns Fecha formateada
   */
  private formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short' // <-- cambia aquí
    });
  }
  
  /**
   * Convierte el nombre del mes a número para ordenamiento
   * @param mes - Nombre del mes en inglés
   * @returns Número del mes (1-12)
   */
  private obtenerNumeroMes(mes: string): number {
    const meses: { [key: string]: number } = {
      'JANUARY': 1,
      'FEBRUARY': 2,
      'MARCH': 3,
      'APRIL': 4,
      'MAY': 5,
      'JUNE': 6,
      'JULY': 7,
      'AUGUST': 8,
      'SEPTEMBER': 9,
      'OCTOBER': 10,
      'NOVEMBER': 11,
      'DECEMBER': 12
    };
    return meses[mes] || 0;
  }

  /**
   * Traduce el número del mes al nombre en español
   * @param mes - Mes como número (1-12) o string
   * @returns Mes en español
   */
  private traducirMes(mes: number | string): string {
    // Si es string, intentar convertir a número
    const mesNumero = typeof mes === 'string' ? parseInt(mes) : mes;
    
    const meses: { [key: number]: string } = {
      1: 'Enero',
      2: 'Febrero',
      3: 'Marzo',
      4: 'Abril',
      5: 'Mayo',
      6: 'Junio',
      7: 'Julio',
      8: 'Agosto',
      9: 'Septiembre',
      10: 'Octubre',
      11: 'Noviembre',
      12: 'Diciembre'
    };
    
    // Si es un string que no se pudo convertir, mantener el mapeo original
    if (isNaN(mesNumero)) {
      const mesesString: { [key: string]: string } = {
        'JANUARY': 'Enero',
        'FEBRUARY': 'Febrero',
        'MARCH': 'Marzo',
        'APRIL': 'Abril',
        'MAY': 'Mayo',
        'JUNE': 'Junio',
        'JULY': 'Julio',
        'AUGUST': 'Agosto',
        'SEPTEMBER': 'Septiembre',
        'OCTOBER': 'Octubre',
        'NOVEMBER': 'Noviembre',
        'DECEMBER': 'Diciembre'
      };
      return mesesString[mes as string] || mes as string;
    }
    
    return meses[mesNumero] || mes.toString();
  }

  /**
   * Carga el gráfico de los últimos 30 días
   */
  private cargarGrafico30Dias(): void {
    if (!this.chart30DaysRef || !this.chart30DaysRef.nativeElement) {
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chart30Days) {
      this.chart30Days.destroy();
    }

    const ctx = this.chart30DaysRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.etiquetas30Dias,
        datasets: [{
          label: 'Ingresos',
          data: this.datosGrafico30Dias.map(item => item.valor),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Ingresos Últimos 30 Días',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            titleFont: {
              size: 20
            },
            bodyFont: {
              size: 18
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 16
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 16
              },
              callback: function(value) {
                return '$' + value.toLocaleString('es-CO');
              }
            }
          }
        }
      }
    };

    this.chart30Days = new Chart(ctx, config);
  }

  /**
   * Carga el gráfico de los últimos 12 meses
   */
  private cargarGrafico12Meses(): void {
    if (!this.chart12MonthsRef || !this.chart12MonthsRef.nativeElement) {
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chart12Months) {
      this.chart12Months.destroy();
    }

    const ctx = this.chart12MonthsRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.etiquetas12Meses,
        datasets: [{
          label: 'Ingresos Mensuales',
          data: this.datosGrafico12Meses.map(item => item.valor),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Ingresos Últimos 12 Meses',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            titleFont: {
              size: 20
            },
            bodyFont: {
              size: 18
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 16
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 16
              },
              callback: function(value) {
                return '$' + value.toLocaleString('es-CO');
              }
            }
          }
        }
      }
    };

    this.chart12Months = new Chart(ctx, config);
  }

  /**
   * Carga el gráfico anual
   */
  private cargarGraficoAnual(): void {
    if (!this.chartYearlyRef || !this.chartYearlyRef.nativeElement) {
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chartYearly) {
      this.chartYearly.destroy();
    }

    const ctx = this.chartYearlyRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.etiquetasAnual,
        datasets: [{
          label: 'Ingresos Anuales',
          data: this.datosGraficoAnual.map(item => item.valor),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Ingresos por Año',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              font: {
                size: 18
              }
            }
          },
          tooltip: {
            titleFont: {
              size: 20
            },
            bodyFont: {
              size: 18
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                return label + ': $' + value.toLocaleString('es-CO');
              }
            }
          }
        }
      }
    };

    this.chartYearly = new Chart(ctx, config);
  }

  /**
   * Carga el gráfico circular para el análisis de productos
   */
  private cargarGraficoCircular(): void {
    if (!this.chartPieRef || !this.chartPieRef.nativeElement) {
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chartPie) {
      this.chartPie.destroy();
    }

    const ctx = this.chartPieRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: this.etiquetasPie,
        datasets: [{
          label: 'Ingresos por ' + this.criterioSeleccionado,
          data: this.datosGraficoPie.map(item => item.valor),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(199, 199, 199)',
            'rgb(83, 102, 255)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Ingresos por ' + this.criterioSeleccionado.charAt(0).toUpperCase() + this.criterioSeleccionado.slice(1),
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              font: {
                size: 18
              }
            }
          },
          tooltip: {
            titleFont: {
              size: 20
            },
            bodyFont: {
              size: 18
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return label + ': $' + value.toLocaleString('es-CO') + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    };

    this.chartPie = new Chart(ctx, config);
  }


  /**
   * Carga los datos para el análisis de productos
   */
  private cargarDatosAgrupados(): void {
    this.estadisticaService.getIngresosAgrupados(this.criterioSeleccionado).subscribe({
      next: data => {
        console.log(data);
        this.mapearDatosAgrupados(data);
      },
      error: error => {
        console.error('Error al cargar los datos de agrupados:', error);
      }
    })
  }


  /**
   * Mapea los datos de los datos agrupados
   * @param data - Datos de los datos agrupados
   */
  private mapearDatosAgrupados(data: any): void {
    if (data && data.respuesta && data.respuesta.Detalles) {
      this.datosGraficoPie = data.respuesta.Detalles.map((item: any) => ({
        etiqueta: item.TipoDato,
        valor: item.Valor
      }));
      this.etiquetasPie = this.datosGraficoPie.map(item => item.etiqueta);
      
      // Cargar el gráfico circular después de mapear los datos
      setTimeout(() => {
        this.cargarGraficoCircular();
      }, 100);
    }
  }

  

  /**
   * Actualiza el tipo de datos del gráfico
   */
  public cambiarTipoGrafico(tipo: string): void {
    this.tipoDatosGrafico = tipo;
    this.cargarDatosGraficos(tipo);
  }

  /**
   * Cambia el criterio de análisis
   */
  public cambiarCriterioAnalisis(criterio: string): void {
    this.criterioSeleccionado = criterio;
    this.cargarDatosAgrupados();
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
