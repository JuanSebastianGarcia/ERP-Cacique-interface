import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { FacturaService } from '../../../core/service/factura.service';
import { ProductoPendienteDto } from '../../../core/models/producto-pendiente-dto';
@Component({
  selector: 'app-productos-pendientes',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './productos-pendientes.component.html',
  styleUrl: './productos-pendientes.component.css'
})
export class ProductosPendientesComponent implements OnInit {

  /** Columns to be displayed in the Material table */
  public displayedColumns: string[] = [
    'prenda',
    'institucion',
    'talla',
    'horario',
    'genero',
    'descripcion',
    'fecha',
    'idFactura'
  ];

  /** Table data source for pending products */
  public dataSource = new MatTableDataSource<any>([]);

  private productosPendientesOriginal: any[] = [];

  /** Filter object bound to the UI dropdowns */
  public filtros = {
    prenda: '',
    talla: '',
    institucion: '',
    genero: '',
    horario: ''
  };

  /** Dropdown options for filters */
  public prendas: string[] = [];
  public tallas: string[] = [];
  public instituciones: string[] = [];
  public generos: string[] = [];
  public horarios: string[] = [];

  /**
   * Constructor that injects required services.
   */
  constructor(
    private configureTypesService: ConfigurationTypesService,
    private facturaSerice: FacturaService
  ) {}

  /**
   * Lifecycle hook to load data after component initialization.
   */
  ngOnInit(): void {
    this.cargarInstituciones();
    this.cargarHorarios();
    this.cargarGeneros();
    this.cargarTallas();
    this.cargarPrendas();
    this.cargarProductosPendientes();
  }

  /**
   * Executes a search operation using current filters.
   */
  public buscar(): void {

    console.log('Filtros: ', this.filtros);

    const filtrado = this.productosPendientesOriginal.filter(producto =>
      (this.filtros.prenda !== '' ? producto.prenda === this.filtros.prenda : true) &&
      (this.filtros.talla !== '' ? producto.talla === this.filtros.talla : true) &&
      (this.filtros.institucion !== '' ? producto.institucion === this.filtros.institucion : true) &&
      (this.filtros.genero !== '' ? producto.genero === this.filtros.genero : true) &&
      (this.filtros.horario !== '' ? producto.horario === this.filtros.horario : true)
    );
    this.dataSource.data = filtrado;


  }

  /**
   * Clears all filters and reloads the data.
   */
  public limpiar(): void {
    this.filtros = {
      prenda: '',
      talla: '',
      institucion: '',
      genero: '',
      horario: ''
    };
    this.cargarProductosPendientes();
  }

  /**
   * Retrieves the list of pending products from the service.
   */
  private cargarProductosPendientes(): void {
    this.facturaSerice.buscarProductosPendientes().subscribe({
      next: data => {
        if (data.respuesta.length > 0) {
          this.renderizarProductosPendientes(data.respuesta);
        }
      },
      error: error => {
        alert(error.respuesta);
      }
    });
  }

  /**
   * Populates the table with the formatted product list.
   */
  private renderizarProductosPendientes(productosPendientes: ProductoPendienteDto[]): void {
    productosPendientes = productosPendientes.map((producto: ProductoPendienteDto) => ({
      prenda: producto.prenda,
      institucion: producto.institucion,
      talla: producto.talla,
      horario: producto.horario,
      genero: producto.genero,
      descripcion: producto.descripcion,
      fecha: producto.fecha,
      idFactura: producto.idFactura
    }));
    
    
    this.productosPendientesOriginal = productosPendientes;
    this.dataSource.data = productosPendientes;
  }

  /** Loads list of institutions from service */
  private cargarInstituciones(): void {
    this.configureTypesService.buscarInstituciones().subscribe({
      next: data => {
        this.instituciones = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        alert('Error loading institutions: ' + error.error.mensaje);
      }
    });
  }

  /** Loads list of schedules from service */
  private cargarHorarios(): void {
    this.configureTypesService.buscarHorarios().subscribe({
      next: data => {
        this.horarios = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        alert('Error loading schedules: ' + error.error.mensaje);
      }
    });
  }

  /** Loads list of genders from service */
  private cargarGeneros(): void {
    this.configureTypesService.buscarGeneros().subscribe({
      next: data => {
        this.generos = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        alert('Error loading genders: ' + error.error.mensaje);
      }
    });
  }

  /** Loads list of sizes from service */
  private cargarTallas(): void {
    this.configureTypesService.buscarTallas().subscribe({
      next: data => {
        this.tallas = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        alert('Error loading sizes: ' + error.error.mensaje);
      }
    });
  }

  /** Loads list of garments from service */
  private cargarPrendas(): void {
    this.configureTypesService.buscarPrendas().subscribe({
      next: data => {
        this.prendas = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        alert('Error loading garments: ' + error.error.mensaje);
      }
    });
  }

  /**
   * Calculates the number of days since the oldest pending product
   */
  public calcularDiasAntiguedad(): number {
    if (this.dataSource.data.length === 0) {
      return 0;
    }

    const fechas = this.dataSource.data.map(producto => new Date(producto.fecha));
    const fechaMasAntigua = new Date(Math.min(...fechas.map(fecha => fecha.getTime())));
    const fechaActual = new Date();
    
    const diferenciaTiempo = fechaActual.getTime() - fechaMasAntigua.getTime();
    const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 3600 * 24));
    
    return diferenciaDias;
  }

  /**
   * Calculates the number of institutions that have pending products
   */
  public calcularInstitucionesConProductosPendientes(): number {
    if (this.dataSource.data.length === 0) {
      return 0;
    }

    const institucionesUnicas = new Set(
      this.dataSource.data.map(producto => producto.institucion)
    );
    
    return institucionesUnicas.size;
  }
}
