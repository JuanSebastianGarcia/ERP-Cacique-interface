import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { EmpleadoDto } from '../../../core/models/empleado-dto';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/service/empleado.service';
import { Router } from '@angular/router';

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
export class VisualizarEmpleadosComponent implements OnInit{

  displayedColumns: string[] = ['id', 'nombre', 'cedula', 'telefono', 'email' , 'tipoEmpleado','boton'];
  dataSource = new MatTableDataSource<EmpleadoDto>([]);//arreglo en donde se almacena la informacion de la tabla




  constructor(private empleadoService:EmpleadoService,private router:Router){};

  ngOnInit(): void {
    this.buscarEmpleados();
  }


  /*
  *se encarga de hacer una solicitud para eliminar un empleado usando la cedula
  */
  eliminarEmpleado(cedula: number){
    this.empleadoService.eliminarEmpleado(cedula).subscribe({
      next:data =>{
        alert(data.respuesta);
        this.buscarEmpleados();
      },
      error:error=>{
        alert(error.respuesta);
      }
    });

  }


  agregarEmpleado(){
    this.router.navigate(['empleados/crear-empleado']);
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
