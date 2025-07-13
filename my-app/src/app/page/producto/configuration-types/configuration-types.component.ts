import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { Observable } from 'rxjs';
import { ConfigTypesDto } from '../../../core/models/config-types-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { MatDialog } from '@angular/material/dialog';
import { CreateDataConfigComponent } from '../create-data-config/create-data-config.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';
import { MensajeConfirmacionComponent } from '../../../shared/components/mensaje-confirmacion/mensaje-confirmacion.component';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { CommonModule } from '@angular/common';

export interface Elements {
  name: string;
  position: number;

}

@Component({
  selector: 'app-configuration-types',
  standalone: true,
  imports: [MatGridListModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './configuration-types.component.html',
  styleUrl: './configuration-types.component.css'
})
export class ConfigurationTypesComponent implements OnInit {

  /*
  *Recursos para la tabla
  */
  displayedColumns: string[] = ['idTipo', 'nombreTipo', 'boton'];
  dataSource = new MatTableDataSource<ConfigTypesDto>([]);


  public tipoActual: string = '';//variable que almacena la opcion buscada 


  constructor(private configurationTypesSerice: ConfigurationTypesService,
    public dialog: MatDialog) { }



  /*
  *se cargan las instituciones al incio
  */
  ngOnInit(): void {
    this.tipoActual = 'institucion';

    this.buscarTipoSeleccionado();
  }


  /*
  *Mostrar mensaje de confirmacion para la eliminacion de un producto, si la confirmacion es (true) 
  *la eliminacion esta confirmada por el usuario
  *
  *@param dato - nombre del dato que se eliminara
  */
  public eliminarDatoConfirmacion(dato: string) {

    const dialogRef = this.dialog.open(MensajeConfirmacionComponent, { data: "¿Esta seguro de eliminar el dato?" });

    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta == true) {
        this.eliminarDatoSolicitud(dato);
      }

    });

  }





  /*
  *buscar por tipo de configuracion. almacena el tipo de cambio actual
  */
  public buscar(tipo: string) {

    this.tipoActual = tipo;

    this.buscarTipoSeleccionado();

  }



  /*
  *continuando con la busqueda, se llama al servicio para buscar el tipo de dato elegido por el usuario
  */
  private buscarTipoSeleccionado() {
    switch (this.tipoActual) {

      case 'institucion':
        this.cargarDatos(this.configurationTypesSerice.buscarInstituciones());
        break;
      case 'horario':
        this.cargarDatos(this.configurationTypesSerice.buscarHorarios());
        break;

      case 'talla':
        this.cargarDatos(this.configurationTypesSerice.buscarTallas());
        break;

      case 'prenda':
        this.cargarDatos(this.configurationTypesSerice.buscarPrendas());
        break;

      case 'genero':
        this.cargarDatos(this.configurationTypesSerice.buscarGeneros());
        break;
    }
  }



  /*
  *carga los datos devueltos por el servidor y los inserta en la tabla
  */
  private cargarDatos(listaDatos: Observable<RespuestaDto<ConfigTypesDto[]>>) {

    listaDatos.subscribe(
      {
        next: data => {
          this.dataSource = new MatTableDataSource(data.respuesta);
        },
        error: error => {
          alert('error al cargar los datos');
        }
      }
    );
  }


  /*
  *se encarga de imprimir el mensaje que indica la respuesta del back
  */
  private imprimirMensaje(respuesta: Observable<RespuestaDto<string>>) {
    respuesta.subscribe({
      next: data => {
        const dialogRef = this.dialog.open(MensajeInformacionComponent, { data: data.respuesta });
        this.buscarTipoSeleccionado();//refrescar la tabla  
      },
      error: error => {
        const dialogRef = this.dialog.open(MensajeInformacionComponent, { data: 'Ocurrio un error' });
      }
    });
  }


  /*
  * se encarga de abrir el modal que solitica el nombre del nuevo dato y luego pasarselo al proceso de crear
  */
  public agregarDato() {

    const dialogRef = this.dialog.open(CreateDataConfigComponent, { 
      data: {
        mensaje: 'Que ' + this.tipoActual + ' desea agregar',
        tipoDato: this.tipoActual
      }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      this.buscarTipoSeleccionado(); // Actualiza la tabla al cerrarse el modal
    });
  }
    
  /*
  *Enviar una solicitud al servicio del servidor para eliminar un datos de configuracion
  *
  * @param dato - identificador unico del dato
  */
  private eliminarDatoSolicitud(dato: string) {
    let respuesta: string = '';

    switch (this.tipoActual) {
      case 'institucion':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarInstituciones(dato));
        break;
      case 'horario':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarHorarios(dato));
        break;

      case 'talla':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarTallas(dato));
        break;

      case 'prenda':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarPrendas(dato));
        break;

      case 'genero':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarGeneros(dato));
        break;
    }
  }




}



