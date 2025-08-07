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

/**
 * Componente para buscar y gestionar facturas
 * Permite buscar facturas por ID o cédula de cliente y visualizar los resultados en una tabla
 */

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

  /** Columnas que se muestran en la tabla de facturas */
  displayedColumns: string[] = ['id', 'fecha', 'cliente', 'estado', 'acciones'];

  /** Fuente de datos de Angular Material para la tabla */
  dataSource = new MatTableDataSource<any>([]);

  /** Lista de facturas obtenidas del servicio */
  facturas: FacturaDto[] = [];

  /** Valor del campo de búsqueda ingresado por el usuario */
  campoBusqueda: string = '';

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private clienteService: ClienteService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarBusqueda();
  }

  /**
   * Carga el último valor de búsqueda desde localStorage si existe
   */
  private cargarBusqueda(): void {
    const codigoFactura = localStorage.getItem('codigoFactura');
    this.campoBusqueda = codigoFactura || '';
  }

  /**
   * Ejecuta la búsqueda de facturas según el tipo seleccionado y valor ingresado
   * Valida el campo de búsqueda y guarda el valor en localStorage
   */
  public buscarFactura(): void {
    // Validar que el campo no esté vacío
    if (this.campoBusqueda.trim() == "") {
      this.toastService.showError('Por favor ingrese un valor para buscar');
      return;
    }

    // Obtener el tipo de búsqueda seleccionado del radio button
    const tipoBusqueda = (document.querySelector('input[name="tipoBusqueda"]:checked') as HTMLInputElement)?.value;
    
    // Guardar el código de búsqueda en localStorage para persistencia
    localStorage.setItem('codigoFactura', this.campoBusqueda);
    
    // Realizar consulta al servicio
    this.facturaService.consultarFactura(Number(this.campoBusqueda), tipoBusqueda).subscribe({
      next: data => {
        if (data && data.respuesta && Array.isArray(data.respuesta)) {
          this.facturas = data.respuesta;
          
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




  /**
   * Transforma las facturas en el formato requerido para la tabla
   * Ordena las facturas priorizando las de estado PENDIENTE
   */
  private cargarTabla(): void {
    const tabla = this.facturas.map(factura => ({
      id: factura.idFactura,
      fecha: this.formatearFecha(factura.fechaFactura),
      cliente: factura.nombreCliente,
      estado: factura.estadoFactura
    }))
    .sort((a, b) => {
      // Priorizar facturas pendientes en la tabla
      if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') {
        return -1;
      }
      if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') {
        return 1;
      }
      return 0;
    });
  
    this.dataSource = new MatTableDataSource(tabla);
  }

  /**
   * Convierte una fecha ISO a formato legible en español
   * @param fechaISO - Fecha en formato ISO string
   * @returns Fecha formateada o la fecha original en caso de error
   */
  private formatearFecha(fechaISO: string): string {
    if (!fechaISO) return 'Sin fecha';
    
    try {
      const fecha = new Date(fechaISO);
      
      if (isNaN(fecha.getTime())) {
        return fechaISO;
      }

      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      };

      return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return fechaISO;
    }
  }


  /**
   * Navega a la página de edición de factura
   * @param id - ID de la factura a editar
   */
  public editarFactura(id: number): void {
    this.facturaService.setIdFacturaActualizando(id);
    this.router.navigate(["facturacion/actualizar-factura"]);
  }


}
