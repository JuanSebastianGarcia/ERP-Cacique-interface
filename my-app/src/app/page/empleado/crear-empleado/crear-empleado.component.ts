import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EmpleadoDto } from '../../../core/models/empleado-dto';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { EmpleadoService } from '../../../core/service/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [MatCardModule,
            CommonModule,
            FormsModule,
            MatSelectModule

  ],
  templateUrl: './crear-empleado.component.html',
  styleUrl: './crear-empleado.component.css'
})
export class CrearEmpleadoComponent {


  

  tipoEmpleados=[
    {value: 'JEFE', viewValue: 'JEFE'},
    {value: 'EMPLEADO', viewValue: 'EMPLEADO'},
  ]



  /*
  *representacion de los datos que almacenan al nuevo usuario
  */
  empleadoData: EmpleadoDto={
    id:0,
    nombre:'',
    cedula:'',
    telefono:'',
    email:'',
    password:'',
    tipoEmpleado:''
  };

  

  constructor(private empleadoService:EmpleadoService,private router:Router){};

  /*
  *se encarga de hacer una solicitud para el registro de un nuevo empleado
  */
 agregarEmpleado(){

    this.empleadoService.agregarEmpleado(this.empleadoData).subscribe({
      next:data=>{
        alert(data.respuesta);
        this.router.navigate(['empleados']);
      },
      error:error=>{
        alert(error.respuesta);
      }

    });
 }



 /*
 *se encarga de volver a la pagina anterior
 */
  volverTabla() {
    this.router.navigate(['empleados']);
  }

}
