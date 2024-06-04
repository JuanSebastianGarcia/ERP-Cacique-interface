import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductoDto } from '../../../core/models/producto-dto';
import { ProductoService } from '../../../core/service/producto.service';
import { FiltroListaProductoDto } from '../../../core/models/filtro-lista-producto-dto';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';


@Component({
  selector: 'app-visualizar-productos',
  standalone: true,
  imports: [MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './visualizar-productos.component.html',
  styleUrl: './visualizar-productos.component.css'
})
export class VisualizarProductosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'prenda', 'institucion', 'talla', 'horario', 'genero', 'precio', 'cantidad', 'boton'];
  dataSource = new MatTableDataSource<ProductoDto>([]);//arreglo en donde se almacena la informacion de la tabla

  //esta es la funcionalidad del paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //cargar el paginador
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  /*
  *Variables que almacenan la opcion de las listas
  */
  public prenda: string = '';
  public institucion: string = '';
  public talla: string = '';
  public horario: string = '';
  public genero: string = '';




  /*
  *Arrays que almacenan los datos de las listas desplegables
  */
  public instituciones = [{ value: '', viewValue: '' }];
  public prendas = [
    { value: 'camibuso', viewValue: 'camibuso' },
    { value: 'pantalon', viewValue: 'pantalon' },
    { value: 'sudadera', viewValue: 'sudadera' },
    { value: 'camisa cuello sport', viewValue: 'camisa cuello sport' },
    { value: 'camisa cuello corbata', viewValue: 'camisa cuello corbata' },
    { value: 'camisa manga larga', viewValue: 'camisa manga larga' },
    { value: 'camisa manga corta', viewValue: 'camisa manga corta' },
    { value: 'pantaloneta', viewValue: 'pantaloneta' },
    { value: 'chaqueta', viewValue: 'chaqueta' },
    { value: 'falda', viewValue: 'falda' },
    { value: 'chaleco', viewValue: 'chaleco' },
    { value: 'medias', viewValue: 'medias' },
    { value: 'corbata', viewValue: 'corbata' },
  ];
  public tallas = [
    { value: '0', viewValue: '0' },
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
    { value: '6', viewValue: '6' },
    { value: '8', viewValue: '8' },
    { value: '10', viewValue: '10' },
    { value: '12', viewValue: '12' },
    { value: '14', viewValue: '14' },
    { value: '16', viewValue: '16' },
    { value: 'xs', viewValue: 'xs' },
    { value: 's', viewValue: 'S' },
    { value: 'm', viewValue: 'M' },
    { value: 'l', viewValue: 'L' },
    { value: 'xl', viewValue: 'XL' },
    { value: 'xxl', viewValue: 'XXL' },
    { value: 'xxxl', viewValue: 'XXXL' },
    { value: 'xxxxl', viewValue: 'XXXXL' },
  ];
  public horarios = [
    { value: 'diario', viewValue: 'diario' },
    { value: 'fisica', viewValue: 'fisica' },
  ];
  public generos = [
    { value: 'hombre', viewValue: 'hombre' },
    { value: 'mujer', viewValue: 'mujer' },
  ];


  //formulario que almacena el filtro para buscar
  private filtros: FiltroListaProductoDto = {
    prenda: '',
    talla: '',
    horario: '',
    genero: '',
    institucion: ''
  }



  constructor(private productoService: ProductoService,
    private router: Router,
    private configureTypesService: ConfigurationTypesService
  ) { };


  ngOnInit(): void {

    this.cargarListas();

    this.buscarProductos();
  }



  /*
  *buscar lista de productos conectandose al servicio
  */
  buscarProductos() {

    console.log(this.prenda);
    this.construirFiltro();//construccion del filtro

    this.productoService.buscarProductos(this.filtros).subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data.respuesta);
      },
      error: error => {
        console.log("ocurrido un error");
      }
    })
  }


  /*
  *limpiar el filtro de busqueda y restablecer la tabla
  */
  limpiarBusqueda() {

    this.limpiarListas();//limpiar vista
    this.buscarProductos();//restablecer tabla

  }


  /*
  *obtener el id de un producto de la tabla y luego eliminarlo
  *
  */
  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe(
      {
        next: data => {
          alert(data.respuesta);
          this.buscarProductos();//recargar la tabla
        },
        error: error => {
          alert(error.error);
        }
      }
    );
  }


  /*
  *invocar el componente que contiene el formulario para crear un producto
  */
  agregarProducto() {

    //invocar componente
    this.router.navigate(["productos/crear-producto"]);
  }



  /*
  *registra la informacion del producto seleccionado para editar y la almacena para posteriormente enviarla 
  *con la informacion actualizada al back
  */
  actualizarProducto(producto: any) {
    this.productoService.agregarProductoActualizando(producto);
    this.router.navigate(["productos/editar-producto"]);
  }


  /*
  *restablecer las listas a un valor vacio
  */
  private limpiarListas() {
    this.prenda = '';
    this.institucion = '';
    this.horario = '';
    this.talla = '';
    this.genero = '';
  }




  /*
  * procesar el friltro para añadir las opciones del usuario
  */
  private construirFiltro() {

    this.filtros.genero = this.genero;
    this.filtros.institucion = this.institucion;
    this.filtros.horario = this.horario;
    this.filtros.prenda = this.prenda;
    this.filtros.talla = this.talla;

  }


  /*
  * se encarga de cargar los datos de configuracion para las listas desplegbales en la busqueda, se hace un
  * mapeo del dto al array que se imprime
  */
  private cargarListas() {

    this.cargarInstituciones();
    this.cargarTallas();
    this.cargarGeneros();
    this.cargarPrendas();
    this.cargarHorarios();
  }

  
  /*
  *cargar las horarios en la lista desplegable para la busqueda
  */
  private cargarHorarios(){
    this.configureTypesService.buscarHorarios().subscribe(
      {
        next: data => {
          this.horarios = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('no se cargaron las instituciones');
        }
      }
    )
  }



  /*
  *cargar las prendas en la lista desplegable para la busqueda
  */
  private cargarPrendas(){
    this.configureTypesService.buscarPrendas().subscribe(
      {
        next: data => {
          this.prendas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('no se cargaron las instituciones');
        }
      }
    )
  }




  /*
  *cargar las generos en la lista desplegable para la busqueda
  */
  private cargarGeneros(){
    this.configureTypesService.buscarGeneros().subscribe(
      {
        next: data => {
          this.generos = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('no se cargaron las instituciones');
        }
      }
    )
  }


  /*
  *cargar las tallas en la lista desplegable para la busqueda
  */
  private cargarTallas(){
    this.configureTypesService.buscarTallas().subscribe(
      {
        next: data => {
          this.tallas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('no se cargaron las instituciones');
        }
      }
    )
  }


  /*
  *cargar las instituciones en la lista desplegable para la busqueda
  */
  private cargarInstituciones(){
    this.configureTypesService.buscarInstituciones().subscribe(
      {
        next: data => {
          this.instituciones = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          alert('no se cargaron las instituciones');
        }
      }
    )
  }


}


