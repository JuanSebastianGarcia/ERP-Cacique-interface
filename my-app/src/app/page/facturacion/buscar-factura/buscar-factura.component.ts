import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [MatIconModule,
    MatTableModule
  ],
  templateUrl: './buscar-factura.component.html',
  styleUrl: './buscar-factura.component.css'
})
export class BuscarFacturaComponent {
  displayedColumns: string[] = ['id', 'fecha', 'cliente', 'estado', 'acciones'];
  dataSource = [
    { id: 12345, fecha: '22/05/2024', cliente: 'Carlos Alberto', estado: 'Pendiente' },
    { id: 12346, fecha: '22/05/2024', cliente: 'Catalina', estado: 'Pendiente' },
    { id: 12347, fecha: '22/05/2024', cliente: 'Diana', estado: 'Finalizada' }
  ];//arreglo en donde se almacena la informacion de la tabla


  buscarFactura() {
    const tipoBusqueda = (document.querySelector('input[name="tipoBusqueda"]:checked') as HTMLInputElement)?.value;

    console.log('Tipo de búsqueda seleccionado:', tipoBusqueda);
  }
  

  
}
