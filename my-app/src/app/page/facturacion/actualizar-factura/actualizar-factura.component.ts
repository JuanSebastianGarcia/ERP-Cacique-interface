/**
 * Componente responsable de visualizar y actualizar una factura seleccionada.
 * Incluye utilidades para renderizar la información y gestionar productos.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { FacturaService } from '../../../core/service/factura.service';
import { ClienteService } from '../../../core/service/cliente.service';
import { ClienteDto } from '../../../core/models/cliente-dto';
import { FacturaDto } from '../../../core/models/factura-dto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-factura',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './actualizar-factura.component.html',
  styleUrl: './actualizar-factura.component.css'
})
export class ActualizarFacturaComponent implements OnInit {

  displayedColumns: string[] = ['Descripcion', 'Estado', 'Precio', 'acciones'];
  listaProductos = new MatTableDataSource<any>([]);


  /** Valor total de la factura */
  public valorTotal = 0;

  /** Valor ya pagado por el cliente */
  public valorPagado = 0;

  /** Lista de productos asociados a la factura */
  public productos: any[] = [];



  /** Datos del cliente relacionados a la factura */
  public cliente: ClienteDto = {
    cedula: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  };



  /**
   * Constructor: inyección de dependencias
   * @param facturaService Servicio para operaciones con facturas
   * @param clienteService Servicio para operaciones con clientes
   */
  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService
  ) {}





  /**
   * Hook de inicialización del componente.
   * Se ejecuta automáticamente al cargar el componente.
   */
  ngOnInit(): void {
    const factura = this.facturaService.getFacturaActualizar();
    this.renderizarFactura(factura);
  }




  /**
   * Carga y visualiza los datos principales de la factura.
   * @param factura Objeto que contiene los datos de la factura a visualizar
   */
  private renderizarFactura(factura: any): void {
    this.buscarCliente(factura.cedulaCliente);        // Carga datos del cliente
    this.renderizarValores(factura);                  // Calcula totales
    this.renderizarProductos(factura);                // Carga productos
  }


  private renderizarProductos(factura: FacturaDto): void {

    
    const tablaProductos = factura.listaProductos.map(producto => ({
      Descripcion: producto.prenda + "-" + producto.talla + "-" + producto.horario + "-" + producto.genero + "-" + producto.institucion,
      Estado: producto.estado,
      Precio: producto.precio,
    })) 


    this.listaProductos = new MatTableDataSource(tablaProductos); // Asigna la lista de productos a la tabla
  }


  /**
   * Calcula los valores totales de la factura y asigna al componente.
   * @param factura Factura con la lista de productos y valor pagado
   */
  private renderizarValores(factura: FacturaDto): void {
    let total: number = 0;

    factura.listaProductos.forEach(producto => {
      total += producto.precio;
    });

    this.valorTotal = total;
    this.valorPagado = factura.valorPagado;
  }





  /**
   * Consulta los datos del cliente por cédula desde el servicio.
   * @param cedula Cédula del cliente asociada a la factura
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
   * Asigna los datos del cliente consultado a la propiedad del componente.
   * @param cliente Datos del cliente consultado
   */
  private renderizarCliente(cliente: ClienteDto): void {
    this.cliente.cedula = cliente.cedula;
    this.cliente.nombre = cliente.nombre;
    this.cliente.telefono = cliente.telefono;
    this.cliente.email = cliente.email;
    this.cliente.direccion = cliente.direccion;
  }






  /**
   * Elimina un producto de la factura (lógica pendiente de implementación).
   * @param producto Producto que se desea eliminar
   */
  public eliminarProducto(producto: any): void {
    // TODO: implementar lógica de eliminación y actualización de totales
  }




  /**
   * Agrega un nuevo producto a la factura (lógica pendiente de implementación).
   */
  public agregarProducto(): void {
    // TODO: implementar lógica de agregado y actualización de totales
  }
}
