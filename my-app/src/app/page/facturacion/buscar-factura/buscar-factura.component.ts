import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FacturaService } from '../../../core/service/factura.service';
import { FacturaDto } from '../../../core/models/factura-dto';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/service/cliente.service';
import { ClienteDto } from '../../../core/models/cliente-dto';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    ToastNotificationComponent
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


  // Toast notification variables - REMOVED (now handled by ToastService)

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private clienteService: ClienteService,
    private toastService: ToastService
  ) {}


  // Ejecuta la búsqueda de facturas según el tipo seleccionado y el valor ingresado
  public buscarFactura(): void {

    // Validar que el campo no esté vacío
    if (this.campoBusqueda.trim() == "") {
      this.toastService.showError('Por favor ingrese un valor para buscar');
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
            this.toastService.showSuccess(`Se encontraron ${this.facturas.length} factura(s)`);
          } 
        } 
      },
      error: error => {
        this.dataSource = new MatTableDataSource<any>([]);
        this.toastService.showError('No se encontro la factura');
      }
    });
  }




  // Toast methods removed - now handled by centralized ToastService


  // Carga los datos recibidos en el formato necesario para la tabla
  private cargarTabla(): void {
    const tabla = this.facturas.map(factura => ({
      id: factura.idFactura,
      fecha: this.formatearFecha(factura.fechaFactura),
      cliente:factura.cedulaCliente,
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
