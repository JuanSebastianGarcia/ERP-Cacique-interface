import { Component, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ProductoDto } from '../../../core/models/producto-dto';



/*
*datos de prueba para probar la tabla
*/
const DATA: ProductoDto[] = [
  {

    Id:1,
    Prenda:'string',
    Institucion:'string',
    Talla:'string',
    Horario:'string',
    Genero:'string',
    Precio:1,
    Cantidad:'string',
    Descripcion:'string'

}

];



@Component({
  selector: 'app-visualizar-productos',
  standalone: true,
  imports: [MatCardModule,
            MatTableModule,
            MatPaginatorModule],
  templateUrl: './visualizar-productos.component.html',
  styleUrl: './visualizar-productos.component.css'
})
export class VisualizarProductosComponent {


  displayedColumns: string[] = ['Id', 'Prenda', 'Institucion', 'Talla', 'Horario' , 'Genero', 'Cantidad','Precio'];
  dataSource = new MatTableDataSource<ProductoDto>(DATA);


  //esta es la funcionalidad del paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }



  constructor(){};

  ngOnInit(): void{}


  buscarProductos(){
    console.log("la busqueda funciona")
  }

}
