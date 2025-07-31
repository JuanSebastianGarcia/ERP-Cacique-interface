/**
 * Invoice Update Component
 * 
 * Responsible for displaying and managing an existing invoice's details.
 * Provides functionality to:
 * - View and edit invoice information
 * - Update product statuses
 * - Remove products from the invoice
 * - Process payments
 */
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FacturaService } from '../../../core/service/factura.service';
import { ClienteService } from '../../../core/service/cliente.service';
import { ClienteDto } from '../../../core/models/cliente-dto';
import { FacturaDto } from '../../../core/models/factura-dto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-actualizar-factura',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ToastNotificationComponent
  ],
  templateUrl: './actualizar-factura.component.html',
  styleUrl: './actualizar-factura.component.css'
})
export class ActualizarFacturaComponent implements OnInit {

  /** Column definitions for the products table */
  public displayedColumns: string[] = ['id','Descripcion', 'DescripcionExtra', 'Estado', 'Precio', 'acciones'];

  /** Data source for the Angular Material products table */
  public listaProductos = new MatTableDataSource<any>([]);

  /** Available payment methods for the invoice */
  public metodoPago = ["EFECTIVO","BANCOLOMBIA","DAVIVIENDA"];

  /** Available status options for products */
  public estadosDisponibles: string[] = ['ENTREGADO','PENDIENTE','EMPACADO'];

  /** Current payment amount being processed */
  public valorPago: number = 0;

  /** Currently selected payment method */
  public metodoSeleccionado = "EFECTIVO";

  /** Total value of all products in the invoice */
  public valorTotal = 0;

  /** Amount already paid by the client */
  public valorPagado = 0;

  /** Product list (maintained separately from the table data source) */
  public productos: any[] = [];

  /** Description modal state management */
  public showDescriptionModal: boolean = false;
  public selectedDescription: string = '';

  /** Client information linked to this invoice */
  public cliente: ClienteDto = {
    cedula: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  /** Current invoice being edited */
  private factura?: FacturaDto;

  /**
   * Component constructor
   * 
   * @param facturaService - Service for invoice operations (fetching, updating)
   * @param clienteService - Service for retrieving client information
   */
  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private toastService: ToastService
  ) {}

  /**
   * Lifecycle hook that runs when the component initializes
   * Loads the current invoice and initializes the UI
   */
  ngOnInit(): void {
    this.factura = this.facturaService.getFacturaActualizar();
    this.renderizarFactura();
  }

  /**
   * Initializes the view with invoice data
   * Sets up client information, payment values, and products table
   */
  private renderizarFactura(): void {
    this.buscarCliente(this.factura!.cedulaCliente);  // Load client details
    this.renderizarValores();                         // Calculate financial values
    this.renderizarProductos();                       // Setup products table
  }

  /**
   * Transforms raw product data into the format needed for the UI table
   * Updates the table's data source with formatted product information
   */
  private renderizarProductos(): void {
    const tablaProductos = this.factura!.listaProductos.map(producto => ({
      id: producto.idRelacion,
      Descripcion: producto.prenda + "-" + producto.talla + "-" + producto.horario + "-" + producto.genero + "-" + producto.institucion,
      DescripcionExtra: producto.descripcion || '',
      Estado: producto.estado,
      Precio: producto.precio
    }));



    this.listaProductos.data = tablaProductos;
  }

  /**
   * Calculates and updates the invoice's financial values
   * Sets the total value and amount already paid
   */
  private renderizarValores(): void {
    let total: number = 0;

    this.factura!.listaProductos.forEach(producto => {
      total += producto.precio;
    });

    this.valorTotal = total;
    this.valorPagado = this.factura!.valorPagado;
  }

  /**
   * Fetches client information based on the client ID
   * 
   * @param cedula - The client's identification number
   */
  private buscarCliente(cedula: string): void {
    this.clienteService.buscarCliente(Number(cedula)).subscribe({
      next: ({ respuesta }) => {
        const cliente: ClienteDto = respuesta;
        this.renderizarCliente(cliente);
      },
      error: ({ respuesta }) => console.log(respuesta.mensaje)
    });
  }

  /**
   * Updates the component's client information with data from the API
   * 
   * @param cliente - Client data object returned from the service
   */
  private renderizarCliente(cliente: ClienteDto): void {
    this.cliente.cedula = cliente.cedula;
    this.cliente.nombre = cliente.nombre;
    this.cliente.telefono = cliente.telefono;
    this.cliente.email = cliente.email;
    this.cliente.direccion = cliente.direccion;
  }

  /**
   * Opens the description modal to display the full product description
   * @param productId - ID of the product
   * @param description - Description text to display
   */
  public verDescripcion(productId: number, description: string): void {
    this.selectedDescription = description || '';
    this.showDescriptionModal = true;
  }

  /**
   * Closes the description modal and resets state
   */
  public cerrarModalDescripcion(): void {
    this.showDescriptionModal = false;
    this.selectedDescription = '';
  }

  /**
   * Removes a product from the invoice if it hasn't been delivered
   * Products with status 'ENTREGADO' (delivered) cannot be removed
   * 
   * @param idProducto - ID of the product to remove
   */
  public eliminarProducto(idProducto: number): void {
    const producto = this.factura!.listaProductos.find(producto => producto.idRelacion === idProducto);

    if (producto && producto.estado !== 'ENTREGADO') {
      console.log("Eliminando producto con id: " + idProducto);
      this.factura!.listaProductos = this.factura!.listaProductos.filter(producto => producto.idRelacion !== idProducto);
      this.renderizarProductos(); // Refresh the products table
    } else {
      this.toastService.showError("No se puede eliminar el producto porque ya fue entregado");
    }
  }

  /**
   * Updates the status of a product in the invoice
   * Products with status 'ENTREGADO' (delivered) cannot be modified
   * 
   * @param nuevoEstado - New status to apply to the product
   * @param idProducto - ID of the product to update
   */
  public cambiarEstado(nuevoEstado: string, idProducto: number) {
    // Find the product in the invoice's product list
    const producto = this.factura!.listaProductos.find(producto => producto.idRelacion === idProducto);

    console.log(producto);

    // Update product status if it hasn't been delivered yet
    if (!producto!.estadoCerrado) {
      producto!.estado = nuevoEstado;
      this.renderizarProductos(); // Refresh the products table
    } else {
      this.toastService.showError("No se puede cambiar el estado del producto");
      this.renderizarProductos(); // Refresh the products table
    }
  }

  /**
   * Saves all changes made to the invoice
   * Updates payment information and submits to the backend
   */
  public guardarCambios() {
    // Update payment information
    this.factura!.metodoPago = this.metodoSeleccionado;
    this.factura!.pago = this.valorPago;

    console.log(this.factura!);
    
    // Send updated invoice to the backend
    this.facturaService.actualizarFactura(this.factura!).subscribe({
      next: data => {
        this.toastService.showSuccess("Factura actualizada correctamente");
      },
      error: error => {
        this.toastService.showError("Error al actualizar factura");
      }
    });
  }
}