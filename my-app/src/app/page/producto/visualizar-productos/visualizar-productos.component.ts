import { Component, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {ProductoDto } from '../../../core/models/producto-dto';
import { ProductoService } from '../../../core/service/producto.service';
import { FiltroListaProductoDto } from '../../../core/models/filtro-lista-producto-dto';

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


  displayedColumns: string[] = ['id', 'prenda', 'institucion', 'talla', 'horario' , 'genero', 'cantidad','precio'];
  dataSource = new MatTableDataSource<ProductoDto>([]);//arreglo en donde se almacena la informacion de la tabla

  //esta es la funcionalidad del paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //cargar el paginador
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }





  //formulario que almacena el filtro para buscar
  filtros : FiltroListaProductoDto={
    prenda:'',
    talla:'',
    horario:'',
    genero:'',
    institucion:''

  }

  constructor(private productoService:ProductoService){};


  ngOnInit(): void{}

  /*
  *buscar lista de productos conectandose al servicio
  */
  buscarProductos(){
   
    this.productoService.buscarProductos(this.filtros).subscribe({ 
      next: data =>{
          this.dataSource=new MatTableDataSource(data.respuesta);
      },
      error: error => {
        console.log("ocurrido un error");
      }
    })
  }

}
