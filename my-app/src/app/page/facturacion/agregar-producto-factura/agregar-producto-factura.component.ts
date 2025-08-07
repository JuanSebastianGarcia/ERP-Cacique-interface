// Angular core and common modules
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services and DTOs
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { ProductoService } from '../../../core/service/producto.service';
import { FiltroListaProductoDto } from '../../../core/models/filtro-lista-producto-dto';
import { ProductoDto } from '../../../core/models/producto-dto';
import { MatTableDataSource } from '@angular/material/table';

interface ProductoDisponible {
  id: number;
  prenda: string;
  institucion: string;
  talla: string;
  horario: string;
  genero: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-agregar-producto-factura',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agregar-producto-factura.component.html',
  styleUrl: './agregar-producto-factura.component.css'
})
export class AgregarProductoFacturaComponent implements OnInit {


  /*
  *Variables que almacenan la opcion de las listas
  */
  public prenda: string = '';
  public institucion: string = '';
  public talla: string = '';
  public horario: string = '';
  public genero: string = '';
  

  /** Dropdown option arrays */
  public instituciones = [{ value: '', viewValue: '' }];
  public prendas = [{ value: '', viewValue: '' }];
  public tallas = [{ value: '', viewValue: '' }];
  public horarios = [{ value: '', viewValue: '' }];
  public generos = [{ value: '', viewValue: '' }];


  private filtros: FiltroListaProductoDto = {
    prenda: '',
    talla: '',
    horario: '',
    genero: '',
    institucion: ''
  }

  /** Nueva sección de productos */
  public productosDisponibles: ProductoDisponible[] = [];
  public productosSeleccionados: ProductoDto[] = [];


  
  constructor(
    private dialogRef: MatDialogRef<AgregarProductoFacturaComponent>,
    private configureTypesService: ConfigurationTypesService,
    private productoService: ProductoService
  ) {
    console.log('CONSTRUCTOR EJECUTADO');
  }

  /**
   * Lifecycle hook: loads dropdown options on component initialization
   */
  ngOnInit(): void {
    console.log('NGONINIT EJECUTADO');
    this.cargarInstituciones();
    this.cargarHorarios();
    this.cargarGeneros();
    this.cargarTallas();
    this.cargarPrendas();
    this.buscarProductos();
  }







  /**
   * Closes the dialog without returning data.
   */
  public cancelar(): void {
    this.dialogRef.close();
  }

  /**
   * Simple method to add a product by ID.
   * Called when the user clicks the "Agregar" button on a product card.
   * @param productId - The ID of the product to add
   */
  public agregarProducto(productId: number): void {

      this.productosDisponibles.forEach(producto => {
        if (producto.id === productId) {
          this.agregarProductoMapeado(producto);
        }
      });
  }


  /*
  *agrega el producto mapeado a la lista de productos seleccionados
  */
  private agregarProductoMapeado(producto: ProductoDisponible): void {
    
    const productoDto: ProductoDto = {
      id: producto.id,
      prenda: producto.prenda,
      institucion: producto.institucion,
      talla: producto.talla,
      horario: producto.horario,
      genero: producto.genero,
      precio: producto.precio,
      cantidad: producto.cantidad,
      descripcion:""
    }
    
    this.productosSeleccionados.push(productoDto);
  }

  /**
   * Handles filter changes in dropdown lists.
   * Executes product search whenever any filter is changed.
   */
  public onFiltroChange(): void {

    this.buscarProductos();
    
  }

  /**
   * Limpia todos los filtros y restablece la búsqueda
   */
  public limpiarBusqueda(): void {
    this.limpiarListas();
    this.buscarProductos();
  }

  /**
   * Restablece todas las variables de filtro a valores vacíos
   */
  private limpiarListas(): void {
    this.prenda = '';
    this.institucion = '';
    this.horario = '';
    this.talla = '';
    this.genero = '';
  }

  /*
  *buscar lista de productos conectandose al servicio
  */
  public buscarProductos() {
    this.construirFiltro();//construccion del filtro
    
    this.productoService.buscarProductos(this.filtros).subscribe({
      next: data => {
        this.mapearProductosDisponibles(data.respuesta);
      },
      error: error => {
        alert('Error searching for product.');
      }
    })
  }


  /*
  * procesar el friltro para añadir las opciones del usuario
  */
  private construirFiltro() {
    this.filtros.genero = this.genero;
    this.filtros.institucion = this.institucion;
    this.filtros.horario = this.horario;
    this.filtros.prenda = this.prenda;
    this.filtros.talla = this.talla;
  }





  /**
   * Mapea los productos disponibles a la interfaz ProductoDisponible.
   * @param productos - Array de productos a mapear
   */
  private mapearProductosDisponibles(productos: ProductoDto[]): void {
    this.productosDisponibles = productos.map(producto => ({
      id: producto.id,
      prenda: producto.prenda,
      institucion: producto.institucion,
      talla: producto.talla,
      horario: producto.horario,
      genero: producto.genero,
      precio: producto.precio,
      cantidad: producto.cantidad
    }));
  }

  /*
  *cargar las instituciones en la lista desplegable para la busqueda
  */
  private cargarInstituciones() {
    this.configureTypesService.buscarInstituciones().subscribe(
      {
        next: data => {
          this.instituciones = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('Error loading institutions: ' + error.error.mensaje);
        }
      }
    )
  }
  /*
  *cargar las horarios en la lista desplegable para la busqueda
  */
  private cargarHorarios() {
    this.configureTypesService.buscarHorarios().subscribe(
      {
        next: data => {
          this.horarios = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('Error loading tallas: ' + error.error.mensaje);
        }
      }
    )
  }

  /*
  *cargar las prendas en la lista desplegable para la busqueda
  */
  private cargarPrendas() {
    this.configureTypesService.buscarPrendas().subscribe(
      {
        next: data => {
          this.prendas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('Error loading tallas: ' + error.error.mensaje);
        }
      }
    )
  }

  /*
  *cargar las generos en la lista desplegable para la busqueda
  */
  private cargarGeneros() {
    this.configureTypesService.buscarGeneros().subscribe(
      {
        next: data => {
          this.generos = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('Error loading tallas: ' + error.error.mensaje);
        }
      }
    )
  }

  /*
  *cargar las tallas en la lista desplegable para la busqueda
  */
  private cargarTallas() {
    this.configureTypesService.buscarTallas().subscribe(
      {
        next: data => {
          this.tallas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('Error loading tallas: ' + error.error.mensaje);
        }
      }
    )
  }




  
  /** Obtiene la clase CSS para el indicador de stock */
  public getStockClass(cantidad: number): string {
    if (cantidad <= 5) return 'stock-low';
    if (cantidad <= 10) return 'stock-medium';
    return 'stock-good';
  }





  /** Calcula el total de unidades seleccionadas */
  public getTotalUnidades(): number {
    return Array.from(this.productosSeleccionados.values()).reduce((sum, producto) => {
      // Si producto es un objeto ProductoDto con una propiedad cantidadSeleccionada
      // ajusta aquí según la estructura real de ProductoDto
      return sum + (typeof producto === 'object' && producto !== null && 'cantidadSeleccionada' in producto
        ? Number(producto.cantidadSeleccionada) || 0
        : 0);
    }, 0);
  }


  /*
  *agrega los productos seleccionados a la factura
  */
  public agregar() {
    this.dialogRef.close(this.productosSeleccionados);
  }


}