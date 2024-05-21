import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { EmpleadoDto } from '../../../core/models/empleado-dto';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/service/empleado.service';

@Component({
  selector: 'app-visualizar-empleados',
  standalone: true,
  imports: [MatCardModule,
            MatTableModule,
            CommonModule
  ],
  templateUrl: './visualizar-empleados.component.html',
  styleUrl: './visualizar-empleados.component.css'
})
export class VisualizarEmpleadosComponent {

  displayedColumns: string[] = ['id', 'nombre', 'cedula', 'telefono', 'email' , 'tipoEmpleado','boton'];
  dataSource = new MatTableDataSource<EmpleadoDto>([]);//arreglo en donde se almacena la informacion de la tabla




  constructor(private empleadoService:EmpleadoService){};



  /*
  *
  */
  eliminarEmpleado(id: number){
    
  }


  agregarEmpleado(){
    alert('agregar funciona');
  }


  /*
  *se encarga de hacer una solicitud para imprimir la lista de empleados
  */
  buscarEmpleados(){
    this.empleadoService.buscarEmpleados().subscribe({
      next: data =>{
        this.dataSource=new MatTableDataSource(data.respuesta);
      },
      error:error =>{
        alert(error.respuesta);
      }
    });

  }
}
