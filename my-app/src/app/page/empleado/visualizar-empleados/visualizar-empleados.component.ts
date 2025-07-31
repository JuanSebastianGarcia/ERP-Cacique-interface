import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { EmpleadoDto } from '../../../core/models/empleado-dto';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/service/empleado.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeConfirmacionComponent } from '../../../shared/components/mensaje-confirmacion/mensaje-confirmacion.component';
import { CrearEmpleadoComponent } from '../crear-empleado/crear-empleado.component';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-visualizar-empleados',
  standalone: true,
  imports: [MatCardModule,
            MatTableModule,
            CommonModule,
            MatDialogModule,
            ToastNotificationComponent
  ],
  templateUrl: './visualizar-empleados.component.html',
  styleUrl: './visualizar-empleados.component.css'
})
export class VisualizarEmpleadosComponent implements OnInit{

  displayedColumns: string[] = ['id', 'nombre', 'cedula', 'telefono', 'email' , 'tipoEmpleado','boton'];
  dataSource = new MatTableDataSource<EmpleadoDto>([]);//arreglo en donde se almacena la informacion de la tabla

  constructor(private empleadoService:EmpleadoService,
              private router:Router,
              private dialog:MatDialog,
              private toastService: ToastService){};

  ngOnInit(): void {
    this.buscarEmpleados();
  }


  /*
  *se encarga de cargar el modal para validar la opcion de eliminar el empleado
  *
  * @param cedula - cedula del empleado que se quiere eliminar
  */
  eliminarEmpleado(cedula: number){

    const dialogRef = this.dialog.open(MensajeConfirmacionComponent,{data:'¿Esta seguro de eliminar el empleado?'});

    dialogRef.afterClosed().subscribe(respuesta => {
      if(respuesta===true){
        this.eliminarEmpleadoSolicitud(cedula);
      }


    })



  }



  private eliminarEmpleadoSolicitud(cedula:number){

    this.empleadoService.eliminarEmpleado(cedula).subscribe({
      next:data =>{
        this.toastService.showSuccess(data.respuesta);
        this.buscarEmpleados();
      },
      error:error=>{
        this.toastService.showError("Ocurrió un error al eliminar el empleado");
      }
    });
  }



  

  /*
  *se encarga de hacer una solicitud para imprimir la lista de empleados
  */
  public buscarEmpleados(){
    this.empleadoService.buscarEmpleados().subscribe({
      next: data =>{
        this.dataSource=new MatTableDataSource(data.respuesta);
      },
      error:error =>{
        this.toastService.showError('Ocurrió un error al cargar los empleados');
      }
    });

  }


  
  public agregarEmpleado(){
    const dialogRef = this.dialog.open(CrearEmpleadoComponent,{data:'Agregar empleado'}); 

    dialogRef.afterClosed().subscribe(respuesta => {
      if (!respuesta) {
        // Usuario cerró sin hacer nada
        return;
      }

      if (respuesta.error) {
        this.toastService.showError(respuesta.mensaje || 'Error al agregar el empleado');
      } else {
        this.toastService.showSuccess(respuesta.mensaje || 'Empleado agregado exitosamente');
        this.buscarEmpleados();
      }

    });
  }


  
}
