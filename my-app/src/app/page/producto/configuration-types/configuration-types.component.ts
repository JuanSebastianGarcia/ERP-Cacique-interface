import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';


export interface PeriodicElement {
  name: string;
  position: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen'},
  {position: 2, name: 'Helium'},
  {position: 3, name: 'Lithium'},
  {position: 4, name: 'Beryllium'},
  {position: 5, name: 'Boron'},
  {position: 6, name: 'Carbon'},
  {position: 7, name: 'Nitrogen'},
  {position: 8, name: 'Oxygen'},
  {position: 9, name: 'Fluorine'},
  {position: 10, name: 'Neon'},
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

  displayedColumns: string[] = ['demo-position', 'demo-name','boton'];
  dataSource = ELEMENT_DATA;




  eliminarProducto(name:string){
    alert(name)
  }
}
