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

  //estas variables almacenan los datos no validades en formato numerico para pruebas
  cedulaNoValidada:number=0;
  telefonoNoValidado:number=0;

  constructor(private empleadoService:EmpleadoService,private router:Router){};

  /*
  *se encarga de hacer una solicitud para el registro de un nuevo empleado
  */
 agregarEmpleado(){

  //validacion de datos
  if(this.validarDatosEmpleado()==true){

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

 }



 /*
 *validar los datos telefono y cedula 
  *@return true - el objeto cumple las validaciones 
  *@return false - el objeto no cumple con las validaciones
 */
  validarDatosEmpleado(): boolean {
    
    let respuesta:boolean =true;

    //validar que sean enteros
    if(!(Number.isInteger(this.cedulaNoValidada) && Number.isInteger(this.telefonoNoValidado))){
      respuesta=false;
      alert('los datos de precio y cantidad deben ser valores numericos enteros');
    }

    //validar que sean mayores que cero
    if(!(this.cedulaNoValidada>=0 && this.telefonoNoValidado>=0)){
      respuesta=false;
      alert('los datos de precio y cantidad deben ser valores coherentes de cero en adelante');
    }

    //validar que tengan un minimo de digitos
    if(!(this.cedulaNoValidada.toLocaleString.length>10 && this.telefonoNoValidado.toLocaleString.length>10)){{
      respuesta=false;
      alert('la cedula  y/o el telefono debe de tener un minimo de 10 digitos');
    }}

    return respuesta;
  }



 /*
 *se encarga de volver a la pagina anterior
 */
  volverTabla() {
    this.router.navigate(['empleados']);
  }

}
