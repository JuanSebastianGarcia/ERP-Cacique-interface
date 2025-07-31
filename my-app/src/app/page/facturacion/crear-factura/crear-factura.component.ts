// Angular core and Material modules
import { Component } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services and Dialogs
import { ClienteService } from '../../../core/service/cliente.service';
import { ClienteDto } from '../../../core/models/cliente-dto';
import { CrearClienteComponent } from '../../cliente/crear-cliente/crear-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { AgregarProductoFacturaComponent } from '../agregar-producto-factura/agregar-producto-factura.component';
import { ProductoDto } from '../../../core/models/producto-dto';
import { ProductoFacturaDto } from '../../../core/models/producto-factura-dto';
import { FacturaService } from '../../../core/service/factura.service';
import { FacturaDto } from '../../../core/models/factura-dto';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-crear-factura',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    ToastNotificationComponent
  ],
  templateUrl: './crear-factura.component.html',
  styleUrl: './crear-factura.component.css'
})
export class CrearFacturaComponent {


  /** Table datasource for displaying product list */
  public listaProductos = new MatTableDataSource<any>([]);

  /** Columns to be displayed in the product table */
  displayedColumns: string[] = ['id', 'Descripcion', 'Estado', 'Precio', 'acciones'];

  /** ID number of the client (used to search or assign) */
  public cedulaCliente?: number;

  /** Available status options for product delivery */
  public estadosDisponibles: string[] = ['ENTREGADO', 'PENDIENTE', 'EMPACADO'];

  /** List of selected products for invoice */
  public carrito: ProductoFacturaDto[] = [];

  /** Total value of the invoice */
  public valorTotalFactura = 0;

  /** Internal counter to assign product identifiers */
  public idProducto: number = 0;

  /** Selected payment method */
  public metodoPago = 'NA';

  /** Amount paid by client */
  public valorPago: number = 0;

  /** Available payment method options */
  public opcionesPago: string[] = ["EFECTIVO","BANCOLOMBIA","DAVIVIENDA"];

  /** Description modal state management */
  public showDescriptionDialog: boolean = false;
  public selectedProductId: number | null = null;
  public selectedProductDescription: string = '';
  public tempDescription: string = '';

  /** Client detail object */
  public cliente = {
    nombre: '',
    telefono: '',
    correo: ''
  };

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private facturaService: FacturaService,
    private toastService: ToastService
  ) {}

  /**
   * Assigns retrieved client data to local state
   * @param cliente - client DTO from backend
   */
  private renderizarCliente(cliente: ClienteDto): void {
    this.cliente.telefono = cliente.telefono;
    this.cliente.correo = cliente.email || '';
    this.cliente.nombre = cliente.nombre;
  }

  /**
   * Opens modal to register a new client
   */
  public registrarCliente(): void {
    const dialogRef = this.dialog.open(CrearClienteComponent);

    dialogRef.afterClosed().subscribe(respuesta => {
      if (!respuesta) {
        // Usuario cerró sin hacer nada
        return;
      }

      if (respuesta.error === false) {
        this.cedulaCliente = respuesta.respuesta.cedula;
        this.cliente.nombre = respuesta.respuesta.nombre;
        this.cliente.telefono = respuesta.respuesta.telefono;
        this.cliente.correo = respuesta.respuesta.email;
        this.toastService.showSuccess('Cliente creado');
      } else {
        this.toastService.showError('Error al crear cliente');
      }
    });
  }

  /**
   * Opens modal to add a new product to the invoice
   */
  public agregarProducto(): void {
    const dialogRef = this.dialog.open(AgregarProductoFacturaComponent);

    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.renderizarProducto(respuesta);
      }else{
        this.toastService.showError('Producto no encontrado');
      }
    });
  }

  /**
   * Retrieves client information by ID and assigns it
   */
  public buscarCliente(): void {
    if (!this.cedulaCliente) {
      console.error('Client ID not provided');
      return;
    }

    this.clienteService.buscarCliente(this.cedulaCliente).subscribe({
      next: Data => {
        if (Data.error === false) {
          this.renderizarCliente(Data.respuesta);
          this.toastService.showSuccess('Cliente encontrado');
        } else {
          this.toastService.showError('Cliente no encontrado');
        }
      },
      error: error => {
        this.toastService.showError('Cliente no encontrado');
      }
    });
  }

  /**
   * Updates the delivery status of a product in the cart
   * @param estado - new status value
   * @param id - identifier of the product in the cart
   */
  public cambiarEstado(estado: string, id: number): void {
    this.carrito.forEach((producto) => {
      if (producto.idRelacion === id) {
        producto.estado = estado;
      }
    });
  }

  /**
   * Opens the description modal for adding or editing a product description
   * @param productId - ID of the product to add/edit description
   */
  public agregarDescripcion(productId: number): void {
    // Find the product in the displayed list
    const product = this.listaProductos.data.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found');
      return;
    }

    // Set modal state
    this.selectedProductId = productId;
    this.selectedProductDescription = product.descripcionExtra || '';
    this.tempDescription = product.descripcionExtra || '';
    this.showDescriptionDialog = true;
  }

  /**
   * Saves the description for the selected product
   */
  public handleSaveDescription(): void {
    if (this.selectedProductId === null) {
      return;
    }

    // Update the product in the displayed list
    const productIndex = this.listaProductos.data.findIndex(p => p.id === this.selectedProductId);
    if (productIndex !== -1) {
      this.listaProductos.data[productIndex].descripcionExtra = this.tempDescription;
      this.listaProductos._updateChangeSubscription();
    }

    // Update the product in the cart
    const carritoProduct = this.carrito.find(p => p.idRelacion === this.selectedProductId);
    if (carritoProduct) {
      carritoProduct.descripcion = this.tempDescription;
    }

    // Close modal and reset state
    this.handleCancelDescription();
  }

  /**
   * Cancels the description editing and closes the modal
   */
  public handleCancelDescription(): void {
    this.showDescriptionDialog = false;
    this.selectedProductId = null;
    this.selectedProductDescription = '';
    this.tempDescription = '';
  }

  /**
   * Removes product from the invoice and cart by ID
   * @param id - identifier of the product to remove
   */
  public eliminarProducto(id: number): void {
    this.valorTotalFactura -= this.listaProductos.data.find(producto => producto.id === id)?.Precio || 0;

    this.listaProductos.data = this.listaProductos.data.filter(producto => producto.id !== id);
    this.carrito = this.carrito.filter(producto => producto.idRelacion !== id);
  }

    /**
   * Sends invoice data to the backend to generate a new invoice.
   * Validates the form before proceeding.
   */
    public generarFactura(): void {
      if (this.validatrFactura()) {
        const facturaDto = this.getFacturaDto();
  
        this.facturaService.generarFactura(facturaDto).subscribe({
          next: (respuesta) => {
            if (respuesta.error === false) {
              this.carrito = [];
              this.listaProductos.data = [];
              this.valorTotalFactura = 0;
              this.cedulaCliente = undefined;
              this.toastService.showSuccess('Factura creada');
            } else {
              this.toastService.showError('Error al crear factura');

            }
          },
          error: (error) => {
            this.toastService.showError('Error al crear factura');
          }
        });
      }
    }
  
    /**
     * Builds and returns the invoice DTO from current form state
     * @returns a complete FacturaDto object for submission
     */
    private getFacturaDto(): FacturaDto {
      return {
        idFactura: 0,
        estadoFactura: '',
        fechaFactura: '',
        cedulaCliente: this.cedulaCliente + '',
        listaProductos: this.carrito,
        metodoPago: this.metodoPago,
        pago: this.valorPago,
        valorPagado: 0
      };
    }
  
    /**
     * Validates invoice form fields before submission
     * @returns true if form is valid, false otherwise
     */
    private validatrFactura(): boolean {
      if (this.carrito.length === 0) {
        this.toastService.showError('Sin productos');
        return false;
      }
  
      if (!this.cedulaCliente) {
        this.toastService.showError('Cliente no encontrado');
        return false;
      }
  
      if (!this.metodoPago) {
        this.toastService.showError('Seleccione método de pago');
        return false;
      }
  
      if (this.valorPago <= 0 && this.validarProductosEntregados()) {
        this.toastService.showError('Valor de pago inválido');
        return false;
      }

  
      return true;
    }
  
    /**
     * Verifies if total value of 'ENTREGADO' products exceeds the paid amount
     * @returns true if delivered products exceed payment, false otherwise
     */
    private validarProductosEntregados(): boolean {
      let sum: number = 0;
  
      this.carrito.forEach((producto) => {
        if (producto.estado === 'ENTREGADO') {
          sum += producto.precio;
        }
      });
  
      return sum > this.valorPago;
    }
  
      /**
   * Adds product to UI table and cart
   * @param producto - product DTO selected by the user
   */
  private renderizarProducto(producto: ProductoDto): void {
    this.agregarProductoAlCarrito(producto);

    const nuevoProducto = {
      id: this.idProducto++,
      Descripcion: producto.prenda,
      Talla: producto.talla,
      Horario: producto.horario,
      Genero: producto.genero,
      Institucion: producto.institucion,
      Estado: 'ENTREGADO',
      Precio: producto.precio,
      descripcionExtra: ''
    };

    this.listaProductos.data.push(nuevoProducto);
    this.listaProductos._updateChangeSubscription();
    this.actualizarValorTotalFactura(producto.precio);
  }
  
    /**
     * Adds product data to the internal cart list
     * @param producto - product DTO to be added
     */
    private agregarProductoAlCarrito(producto: ProductoDto): void {
      const productoNuevo: ProductoFacturaDto = {
        idRelacion: this.idProducto,
        prenda: producto.prenda,
        institucion: producto.institucion,
        talla: producto.talla,
        horario: producto.horario,
        genero: producto.genero,
        precio: producto.precio,
        estado: 'ENTREGADO',
        descripcion: ''
      };
  
      this.carrito.push(productoNuevo);
    }
  
    /**
     * Increases the total invoice value by the given price
     * @param precio - price to add to the total
     */
    private actualizarValorTotalFactura(precio: number): void {
      this.valorTotalFactura += precio;
    }
  

}