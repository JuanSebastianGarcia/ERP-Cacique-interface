// Angular core and common modules
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services and DTOs
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { ProductoService } from '../../../core/service/producto.service';
import { FiltroListaProductoDto } from '../../../core/models/filtro-lista-producto-dto';

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

  /**
   * Carga la lista de instituciones
   */
  private cargarInstituciones(): void {
    this.configureTypesService.buscarInstituciones().subscribe({
      next: data => {
        this.instituciones = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        console.error('Error loading institutions:', error);
      }
    });
  }

  /**
   * Carga la lista de horarios
   */
  private cargarHorarios(): void {
    this.configureTypesService.buscarHorarios().subscribe({
      next: data => {
        this.horarios = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        console.error('Error loading schedules:', error);
      }
    });
  }

  /**
   * Carga la lista de géneros
   */
  private cargarGeneros(): void {
    this.configureTypesService.buscarGeneros().subscribe({
      next: data => {
        this.generos = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        console.error('Error loading genders:', error);
      }
    });
  }

  /**
   * Carga la lista de tallas
   */
  private cargarTallas(): void {
    this.configureTypesService.buscarTallas().subscribe({
      next: data => {
        this.tallas = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        console.error('Error loading sizes:', error);
      }
    });
  }

  /**
   * Carga la lista de prendas
   */
  private cargarPrendas(): void {
    this.configureTypesService.buscarPrendas().subscribe({
      next: data => {
        this.prendas = data.respuesta.map((item: any) => item.nombreTipo);
      },
      error: error => {
        console.error('Error loading garments:', error);
      }
    });
  }
}
