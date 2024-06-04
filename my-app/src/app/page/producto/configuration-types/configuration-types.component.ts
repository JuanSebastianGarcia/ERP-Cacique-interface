import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { Observable } from 'rxjs';
import { ConfigTypesDto } from '../../../core/models/config-types-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';


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
export class ConfigurationTypesComponent {


  displayedColumns: string[] = ['idTipo', 'nombreTipo', 'boton'];
  dataSource = new MatTableDataSource<ConfigTypesDto>([]);

  private tipoActual: string = '';//variable que almacena la opcion buscada 


  constructor(private configurationTypesSerice: ConfigurationTypesService) { }


  /*
  *eliminar un dato de configuracion
  */
  eliminarProducto(dato: string) {
   
    let respuesta: string = '';

    switch (this.tipoActual) {
      case 'institucion':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarInstituciones(dato));
        this.elegirOpcion();//refrescar la tabla
        break;
      case 'horario':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarHorarios(dato));
        this.elegirOpcion();//refrescar la tabla
        break;

      case 'talla':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarTallas(dato));
        this.elegirOpcion();//refrescar la tabla
        break;

      case 'prenda':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarPrendas(dato));
        this.elegirOpcion();//refrescar la tabla
        break;

      case 'genero':
        this.imprimirMensaje(this.configurationTypesSerice.eliminarGeneros(dato));
        this.elegirOpcion();//refrescar la tabla
        break;
    }
  }



  /*
  *buscar por tipo de configuracion. almacena el tipo de cambio actual
  */
  buscar(tipo: string) {

    this.tipoActual = tipo;

    this.elegirOpcion();

  }


  /*
  *continuando con la busqueda, se especifica cual tipo de dato es el que se requiere
  */
  private elegirOpcion() {
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
        alert(data.respuesta);
      },
      error:error => {
        alert(error.respuesta);
      }
    });
  }







}



