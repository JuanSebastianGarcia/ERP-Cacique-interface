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


export interface Elements {
  name: string;
  position: number;

}

@Component({
  selector: 'app-configuration-types',
  standalone: true,
  imports: [MatGridListModule,
    MatTableModule
  ],
  templateUrl: './configuration-types.component.html',
  styleUrl: './configuration-types.component.css'
})
export class ConfigurationTypesComponent implements OnInit{


  displayedColumns: string[] = ['idTipo', 'nombreTipo', 'boton'];
  dataSource = new MatTableDataSource<ConfigTypesDto>([]);

  private tipoActual: string = '';//variable que almacena la opcion buscada 


  constructor(private configurationTypesSerice: ConfigurationTypesService,
     public dialog: MatDialog) { }



  /*
  *se cargan las instituciones al incio
  */
  ngOnInit(): void {
    this.tipoActual = 'institucion';

    this.elegirOpcionBusqueda();
  }


  /*
  *eliminar un dato de configuracion.se usa la variable tipoActual para saber de que tabla se desea hacer 
  *el delete  
  *param dato - nombre del dato que se eliminara
  */
  eliminarDato(dato: string) {
   
    let respuesta: string = '';

    switch (this.tipoActual) {
      case 'institucion':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarInstituciones(dato));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;
      case 'horario':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarHorarios(dato));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'talla':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarTallas(dato));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'prenda':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarPrendas(dato));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'genero':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarGeneros(dato));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;
    }
  }



  /*
  *buscar por tipo de configuracion. almacena el tipo de cambio actual
  */
  buscar(tipo: string) {

    this.tipoActual = tipo;

    this.elegirOpcionBusqueda();

  }


  /*
  * se encarga de abrir el modal que solitica el nombre del nuevo dato y luego pasarselo al proceso de crear
  */
  agregarDato(){


    const dialogRef = this.dialog.open(CreateDataConfigComponent,{data:'Que '+this.tipoActual+' desea agregar'});

    dialogRef.afterClosed().subscribe(respuesta => 
      {
        if(respuesta==undefined){
        }else{
          if(respuesta==''){
            alert("tiene que agregar un dato o cancelar");
            this.agregarDato();
          }
          else{
            this.agregarDatoSolicitud(respuesta);
          }
        }
      }
    );
  }


  /*
  *hace la solicitud al servicio para crear un dato usando la respuesta del modal de agregar dato.
  *se usa la variable de tipo actual para saber en cual tabla se va a hacer el insert
  *@ param respuesta - nombre del dato a agregarse
  */
  private agregarDatoSolicitud(respuesta: string) {
    switch (this.tipoActual) {

      case 'institucion':
        this.imprimirMensaje(this.configurationTypesSerice.agregarInstitucion(respuesta));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;
      case 'horario':
        this.imprimirMensaje(this.configurationTypesSerice.agregarhorario(respuesta));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'talla':
        this.imprimirMensaje(this.configurationTypesSerice.agregartalla(respuesta));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'prenda':
        this.imprimirMensaje(this.configurationTypesSerice.agregarprenda(respuesta));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;

      case 'genero':
        this.imprimirMensaje(this.configurationTypesSerice.agregarGenero(respuesta));
        this.elegirOpcionBusqueda();//refrescar la tabla
        break;
    }
  }
  



  /*
  *continuando con la busqueda, se especifica cual tipo de dato es el que se requiere
  */
  private elegirOpcionBusqueda() {
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
      next:data =>{
        const dialogRef = this.dialog.open(MensajeInformacionComponent,{data:data.respuesta});
      },
      error:error => {
        const dialogRef = this.dialog.open(MensajeInformacionComponent,{data:'Ocurrio un error'});
      }
    });
  }







}



