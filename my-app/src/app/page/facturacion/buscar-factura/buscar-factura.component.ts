import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FacturaService } from '../../../core/service/factura.service';
import { FacturaDto } from '../../../core/models/factura-dto';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './buscar-factura.component.html',
  styleUrl: './buscar-factura.component.css'
})
export class BuscarFacturaComponent {

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'fecha', 'cliente', 'estado', 'acciones'];

  // Fuente de datos para la tabla
  dataSource: any[] = [];

  // Lista de facturas obtenidas desde el servicio
  facturas: FacturaDto[] = [];

  // Valor ingresado por el usuario para la búsqueda
  campoBusqueda: string = '';



  
  constructor(
    private facturaService: FacturaService
  ) {}



  // Método principal que ejecuta la búsqueda de la factura
  buscarFactura(): void {
    const tipoBusqueda = (document.querySelector('input[name="tipoBusqueda"]:checked') as HTMLInputElement)?.value;

    this.facturaService.consultarFactura(Number(this.campoBusqueda), tipoBusqueda).subscribe({
      next: data => {
        this.facturas = [data.respuesta]; // Se asigna la respuesta a la lista
        this.cargarTabla(); // Se actualiza la tabla con los datos
      },
      error: error => {
        alert("Error al buscar la factura: " + error.error.mensaje);
      }
    });
  }


  // Carga la información de las facturas en el formato necesario para la tabla
  private cargarTabla(): void {
    for (const factura of this.facturas) {
      const json = {
        id: factura.idFactura,
        fecha: 'null', // Aquí se debe asignar una fecha real si está disponible
        cliente: factura.cedulaCliente,
        estado: factura.estadoFactura
      };

      this.dataSource.push(json);
    }
  }
}
