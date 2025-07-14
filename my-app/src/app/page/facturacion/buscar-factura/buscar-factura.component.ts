import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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


  // Toast notification variables
  public showToast: boolean = false;
  public toastMessage: string = '';
  public toastType: 'success' | 'error' = 'success';

  constructor(
    private facturaService: FacturaService,
    private router: Router
  ) {}


  // Ejecuta la búsqueda de facturas según el tipo seleccionado y el valor ingresado
  public buscarFactura(): void {

    // Validar que el campo no esté vacío
    if (this.campoBusqueda.trim() == "") {
      this.showToastNotification('Por favor ingrese un valor para buscar', 'error');
      return;
    }

    const tipoBusqueda = (document.querySelector('input[name="tipoBusqueda"]:checked') as HTMLInputElement)?.value;

    this.facturaService.consultarFactura(Number(this.campoBusqueda), tipoBusqueda).subscribe({
      next: data => {
        if (data && data.respuesta && Array.isArray(data.respuesta)) {
          this.facturas = data.respuesta;
          
          // Verificar si se encontraron resultados
          if (this.facturas.length > 0) {
            this.cargarTabla();
            this.showToastNotification(`Se encontraron ${this.facturas.length} factura(s)`, 'success');
          } 
        } 
      },
      error: error => {
        this.dataSource = new MatTableDataSource<any>([]);
        this.showToastNotification('No se encontro la factura', 'error');
      }
    });
  }



  /*
  *Mostrar notificación toast
  */
  private showToastNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }


  // Carga los datos recibidos en el formato necesario para la tabla
  private cargarTabla(): void {
    const tabla = this.facturas.map(factura => ({
      id: factura.idFactura,
      fecha: this.formatearFecha(factura.fechaFactura),
      cliente: factura.cedulaCliente,
      estado: factura.estadoFactura
    }))
    .sort((a, b) => {
      // Los "Pendiente" van primero
      if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') {
        return -1;
      }
      if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') {
        return 1;
      }
      return 0; // Si ambos tienen el mismo estado, se mantienen igual
    });
  
    this.dataSource = new MatTableDataSource(tabla);
  }

  // Formatea la fecha para una mejor legibilidad
  private formatearFecha(fechaISO: string): string {
    if (!fechaISO) return 'Sin fecha';
    
    try {
      const fecha = new Date(fechaISO);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return fechaISO; // Devolver la fecha original si no es válida
      }

      // Formatear la fecha en español
      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      };

      return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return fechaISO; // Devolver la fecha original en caso de error
    }
  }


  public editarFactura(id: number): void {

    this.facturaService.setIdFacturaActualizando(id);

    this.router.navigate(["facturacion/actualizar-factura"]);
  }


}
