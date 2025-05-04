import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../core/service/cliente.service';
import { ClienteDto } from '../../../core/models/cliente-dto';


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
    CommonModule
  ],
  templateUrl: './crear-factura.component.html',
  styleUrl: './crear-factura.component.css'
})
export class CrearFacturaComponent {

  /** Data source for the Angular Material products table */
  public listaProductos = new MatTableDataSource<any>([]);
  
  
  displayedColumns: string[] = ['id', 'Descripcion', 'Estado', 'Precio', 'acciones'];

  public cedulaCliente?: number;

  /** Available status options for products */
  public estadosDisponibles: string[] = ['ENTREGADO','PENDIENTE','EMPACADO'];

  public valorTotalFactura = 235000;
  public metodoPago = 'NA';
  public valorPago: number = 0;
  public opcionesPago: string[] = ['NA', 'Efectivo', 'Transferencia'];

  public cliente = {
    nombre: '',
    telefono: '',
    correo: ''
  };

  
  constructor(
    private clienteService: ClienteService,

  ) {}


  private renderizarCliente(cliente: ClienteDto): void {
    this.cliente.telefono =  cliente.telefono
    this.cliente.correo = cliente.emailgit add 
    this.cliente.nombre = cliente.nombre
  }

  public registrarCliente(){

  }

  public agregarProducto(){

  }
  
  public buscarCliente(){

    if (!this.cedulaCliente) {
      console.error('Cédula del cliente no proporcionada');
      return;
    }

    this.clienteService.buscarCliente(this.cedulaCliente).subscribe({
      next: Data => {

        if (Data.error === false) {
          this.renderizarCliente(Data.respuesta);
        } else {
          console.error('Cliente no encontrado');
        }
        
      },
      error: error => {
        console.error('Error al buscar el cliente:', error);
        alert('Error al buscar el cliente:');
      }
    })
  }

  public cambiarEstado(estado:string, id:number): void {


  }


  public eliminarProducto(id:number): void {

  
  }

  public generarFactura(): void {
  
  }



}
