import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { Observable } from 'rxjs';
import { ConfigTypesDto } from '../../../core/models/config-types-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';


export interface PeriodicElement {
  name: string;
  position: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen' },
  { position: 2, name: 'Helium' },
  { position: 3, name: 'Lithium' },
  { position: 4, name: 'Beryllium' },
  { position: 5, name: 'Boron' },
  { position: 6, name: 'Carbon' },
  { position: 7, name: 'Nitrogen' },
  { position: 8, name: 'Oxygen' },
  { position: 9, name: 'Fluorine' },
  { position: 10, name: 'Neon' },
];








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


  displayedColumns: string[] = ['demo-position', 'demo-name', 'boton'];
  dataSource = ELEMENT_DATA;

  tipoActual: string = '';


  constructor(private configurationTypesSerice:ConfigurationTypesService){}






  eliminarProducto(name: string) {
    alert(name)
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
        cargarDatos(this.configurationTypesSerice.buscarInstituciones());
        break;

      case 'horario':

        break;

      case 'talla':

        break;

      case 'prenda':

        break;

      case 'genero':

        break;
    }
  }


}



/*
*carga los datos devueltos por el servidor y los inserta en la tabla
*/
function cargarDatos(listaDatos: Observable<RespuestaDto<ConfigTypesDto[]>>) {
  
  for(let i=1;i<listaDatos.x)
}

