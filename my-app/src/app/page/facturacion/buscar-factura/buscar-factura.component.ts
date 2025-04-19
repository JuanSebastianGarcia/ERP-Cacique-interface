import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FacturaService } from '../../../core/service/factura.service';
import { FacturaDto } from '../../../core/models/factura-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './buscar-factura.component.html',
  styleUrls: ['./buscar-factura.component.css']
})
export class BuscarFacturaComponent {

  // Columnas visibles en la tabla
  displayedColumns: string[] = ['id', 'fecha', 'cliente', 'estado', 'acciones'];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<any>([]);

  // Lista de facturas recibidas desde el servicio
  facturas: FacturaDto[] = [];

  // Texto ingresado por el usuario en el campo de búsqueda
  campoBusqueda: string = '';


  constructor(
    private facturaService: FacturaService,
    private router: Router
  ) {}


  // Ejecuta la búsqueda de facturas según el tipo seleccionado y el valor ingresado
  buscarFactura(): void {
    const tipoBusqueda = (document.querySelector('input[name="tipoBusqueda"]:checked') as HTMLInputElement)?.value;

    this.facturaService.consultarFactura(Number(this.campoBusqueda), tipoBusqueda).subscribe({
      next: data => {
        if (data && data.respuesta && Array.isArray(data.respuesta)) {
          this.facturas = data.respuesta;
          this.cargarTabla();
        }
      },
      error: error => {
        alert("Error al buscar la factura: " + error.error.mensaje);
      }
    });
  }


  // Carga los datos recibidos en el formato necesario para la tabla
  private cargarTabla(): void {
    const tabla = this.facturas.map(factura => ({
      id: factura.idFactura,
      fecha: 'null', // Reemplazar con la fecha real si está disponible
      cliente: factura.cedulaCliente,
      estado: factura.estadoFactura
    }));

    this.dataSource = new MatTableDataSource(tabla);

  }


  editarFactura(id: number): void {

    this.facturaService.setIdFacturaActualizando(id);

    this.router.navigate(["facturacion/actualizar-factura"]);
  }


}
