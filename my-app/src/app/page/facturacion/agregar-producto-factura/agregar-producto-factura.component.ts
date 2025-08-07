// Angular core and common modules
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services and DTOs
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { ProductoService } from '../../../core/service/producto.service';
import { FiltroListaProductoDto } from '../../../core/models/filtro-lista-producto-dto';

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

  /** Object to store selected product options */
  producto = {
    prenda: '',
    talla: '',
    institucion: '',
    genero: '',
    horario: ''
  };

  /** Dropdown option arrays */
  public prendas: string[] = [];
  public tallas: string[] = [];
  public instituciones: string[] = [];
  public generos: string[] = [];
  public horarios: string[] = [];

  /** Nueva sección de productos */
  public productosDisponibles: ProductoDisponible[] = [];
  public productosSeleccionados = new Map<number, number>();
  public currentView: 'grid' | 'table' = 'grid';

  constructor(
    private dialogRef: MatDialogRef<AgregarProductoFacturaComponent>,
    private configureTypesService: ConfigurationTypesService,
    private productoService: ProductoService
  ) {}

  /**
   * Lifecycle hook: loads dropdown options on component initialization
   */
  ngOnInit(): void {
    this.cargarInstituciones();
    this.cargarHorarios();
    this.cargarGeneros();
    this.cargarTallas();
    this.cargarPrendas();
    this.cargarProductosDisponibles();
  }

  /**
   * Handles form submission.
   * Validates input and sends product search request.
   */
  public agregar(): void {
    if (this.validateForm()) {
      const filtroDto = this.construirFiltroDto();
      this.consultarProducto(filtroDto);
    }
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
    // Simply send the product ID
    this.dialogRef.close(productId);
  }

  /**
   * Handles filter changes in dropdown lists.
   * Executes product search whenever any filter is changed.
   */
  public onFiltroChange(): void {
    // Check if at least one filter has a value
    if (this.producto.prenda || this.producto.talla || this.producto.institucion || 
        this.producto.genero || this.producto.horario) {
      const filtroDto = this.construirFiltroDto();
      this.consultarProducto(filtroDto);
    }
  }

  /**
   * Calls service to search for product based on filters.
   * Closes the dialog and returns the product if one result is found.
   * @param filtroDto - filter parameters
   */
  private consultarProducto(filtroDto: FiltroListaProductoDto): void {
    this.productoService.buscarProductos(filtroDto).subscribe({
      next: data => {
        if (data.respuesta.length > 0) {
          this.dialogRef.close(data.respuesta[0]);
        } else {
          this.dialogRef.close(null);
        }
      },
      error: () => {
        alert('Error searching for product.');
      }
    });
  }

  /**
   * Builds the product filter DTO from form inputs.
   * @returns filter DTO for product query
   */
  private construirFiltroDto(): FiltroListaProductoDto {
    return {
      prenda: this.producto.prenda,
      talla: this.producto.talla,
      institucion: this.producto.institucion,
      genero: this.producto.genero,
      horario: this.producto.horario
    };
  }

  /**
   * Validates that all form fields have values.
   * @returns true if all fields are filled, false otherwise
   */
  private validateForm(): boolean {
    const campos = Object.values(this.producto);
    const hayCamposVacios = campos.some(valor => valor === '');
    if (hayCamposVacios) {
      alert('Please fill in all fields.');
      return false;
    }
    return true;
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

  /** Carga productos quemados para visualización */
  private cargarProductosDisponibles(): void {
    this.productosDisponibles = [
      { id: 1, prenda: "Camisa Polo", institucion: "Colegio San José", talla: "S", horario: "Mañana", genero: "Masculino", precio: 25000, cantidad: 15 },
      { id: 2, prenda: "Camisa Polo", institucion: "Colegio San José", talla: "M", horario: "Mañana", genero: "Masculino", precio: 25000, cantidad: 12 },
      { id: 3, prenda: "Camisa Polo", institucion: "Colegio San José", talla: "L", horario: "Mañana", genero: "Masculino", precio: 25000, cantidad: 8 },
      { id: 4, prenda: "Camisa Polo", institucion: "Liceo Nacional", talla: "S", horario: "Tarde", genero: "Femenino", precio: 28000, cantidad: 20 },
      { id: 5, prenda: "Pantalón Escolar", institucion: "Colegio San José", talla: "M", horario: "Mañana", genero: "Masculino", precio: 35000, cantidad: 6 },
      { id: 6, prenda: "Pantalón Escolar", institucion: "Liceo Nacional", talla: "L", horario: "Tarde", genero: "Femenino", precio: 38000, cantidad: 4 },
      { id: 7, prenda: "Zapatos Colegiales", institucion: "Universidad Central", talla: "38", horario: "Completo", genero: "Unisex", precio: 45000, cantidad: 3 },
      { id: 8, prenda: "Zapatos Colegiales", institucion: "Universidad Central", talla: "40", horario: "Completo", genero: "Unisex", precio: 45000, cantidad: 7 },
      { id: 9, prenda: "Chaqueta Deportiva", institucion: "Instituto Técnico", talla: "M", horario: "Mañana", genero: "Masculino", precio: 55000, cantidad: 2 },
      { id: 10, prenda: "Falda Escolar", institucion: "Liceo Femenino", talla: "S", horario: "Tarde", genero: "Femenino", precio: 28000, cantidad: 14 }
    ];
  }

  /** Cambia entre vista grid y tabla */
  public toggleView(view: 'grid' | 'table'): void {
    this.currentView = view;
  }

  /** Alterna la selección de un producto */
  public toggleProducto(productId: number): void {
    if (this.productosSeleccionados.has(productId)) {
      this.productosSeleccionados.delete(productId);
    } else {
      this.productosSeleccionados.set(productId, 1);
      this.agregarProductoAFactura(productId);
    }
  }

  /** Cambia la cantidad de un producto seleccionado */
  public cambiarCantidad(productId: number, delta: number): void {
    const producto = this.productosDisponibles.find(p => p.id === productId);
    if (!producto) return;

    const cantidadActual = this.productosSeleccionados.get(productId) || 1;
    const nuevaCantidad = Math.max(1, Math.min(producto.cantidad, cantidadActual + delta));
    
    this.productosSeleccionados.set(productId, nuevaCantidad);
    this.agregarProductoAFactura(productId);
  }

  /** Actualiza la cantidad desde el input */
  public actualizarCantidad(productId: number, event: any): void {
    const producto = this.productosDisponibles.find(p => p.id === productId);
    if (!producto) return;

    const cantidad = Math.max(1, Math.min(producto.cantidad, parseInt(event.target.value) || 1));
    this.productosSeleccionados.set(productId, cantidad);
    this.agregarProductoAFactura(productId);
  }

  /** Obtiene la clase CSS para el indicador de stock */
  public getStockClass(cantidad: number): string {
    if (cantidad <= 5) return 'stock-low';
    if (cantidad <= 10) return 'stock-medium';
    return 'stock-good';
  }

  /** Calcula el total de unidades seleccionadas */
  public getTotalUnidades(): number {
    return Array.from(this.productosSeleccionados.values()).reduce((sum, qty) => sum + qty, 0);
  }

  /** Función placeholder para agregar producto a factura */
  private agregarProductoAFactura(productId: number): void {
    const producto = this.productosDisponibles.find(p => p.id === productId);
    const cantidad = this.productosSeleccionados.get(productId);
    
    if (producto && cantidad) {
      console.log(`Producto agregado a factura: ${producto.prenda} - Cantidad: ${cantidad}`);
      // Aquí iría la lógica real para agregar a la factura
    }
  }
}