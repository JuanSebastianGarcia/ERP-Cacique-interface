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
import { MatDialog } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeConfirmacionComponent } from '../../../shared/components/mensaje-confirmacion/mensaje-confirmacion.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-visualizar-productos',
  standalone: true,
  imports: [MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    ToastNotificationComponent
  ],
  templateUrl: './visualizar-productos.component.html',
  styleUrl: './visualizar-productos.component.css'
})

/*
*Este componente esta hecho para mostrar la tabla de pructos ademas de poder realziar busquedas en la tabla
*usando los datos de condifiguracion de las listas
*/
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
  public prendas = [{ value: '', viewValue: '' }];
  public tallas = [{ value: '', viewValue: '' }];
  public horarios = [{ value: '', viewValue: '' }];
  public generos = [{ value: '', viewValue: '' }];

  //formulario que almacena el filtro para buscar
  private filtros: FiltroListaProductoDto = {
    prenda: '',
    talla: '',
    horario: '',
    genero: '',
    institucion: ''
  }

  // Modal variables
  public isModalOpen: boolean = false;
  public showSuccessMessage: boolean = false;

  constructor(private productoService: ProductoService,
    private router: Router,
    private configureTypesService: ConfigurationTypesService,
    private dialog: MatDialog,
    private toastService: ToastService) { };

  ngOnInit(): void {
    this.cargarListas();//cargar los datos para las listas desplegables
    this.buscarProductos();//cargar todos los productos por primera vez
  }

  /*
  *buscar lista de productos conectandose al servicio
  */
  public buscarProductos() {
    this.construirFiltro();//construccion del filtro
    
    this.productoService.buscarProductos(this.filtros).subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data.respuesta);
      },
      error: error => {
        const dialogRef = this.dialog.open(MensajeAlertaComponent, { data: 'Ocurrio un error' });
      }
    })
  }

  /*
  *limpiar el filtro de busqueda y restablecer la tabla
  */
  public limpiarBusqueda() {
    this.limpiarListas();//limpiar vista
    this.buscarProductos();//restablecer tabla
  }

  /*
  *solicitar una confirmacion para la eliminacion del producto usando un modal
  *de confirmacion
  *
  * @param id - id del producto que se desea eliminar
  *
  */
  public eliminarProductoConfirmar(id: number) {
    const dialogRef = this.dialog.open(MensajeConfirmacionComponent, { data: "¿Esta seguro de eliminar el producto?" })

    dialogRef.afterClosed().subscribe(respuesta => {
      if(respuesta===true){
        this.eliminarProductoSolicitud(id);
      }
     }
    )
  }

  /*
  *Se encarga de hacer la solicitud al servicio para eliminar el producto
  *
  *@param id - id del producto que se desea eliminar
  */
  private eliminarProductoSolicitud(id:number){
    this.productoService.eliminarProducto(id).subscribe(
      {
        next: data => {
          const dialogRef = this.dialog.open(MensajeInformacionComponent,{data:"producto eliminado"});//informar del producto eliminado
          this.buscarProductos();//recargar la tabla
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeConfirmacionComponent,{data:"ocurrio un error"})
        }
      }
    );
  }

  /*
  *invocar el modal para crear un producto
  */
  public agregarProducto() {
    const dialogRef = this.dialog.open(CrearProductoComponent);

    dialogRef.afterClosed().subscribe(respuesta => {
      if (!respuesta) {
        // Usuario cerró sin hacer nada
        return;
      }
  
      if (respuesta.error) {
        this.toastService.showError('Error al crear el producto');
      } else {
        this.toastService.showSuccess('Producto creado exitosamente');
        this.buscarProductos(); // Recargar la tabla
      }
    });
  }

  /*
  *registra la informacion del producto seleccionado para editar y la almacena para posteriormente enviarla 
  *con la informacion actualizada al back
  */
  actualizarProducto(producto: any) {
    this.productoService.agregarProductoActualizando(producto);
    this.router.navigate(["productos/editar-producto"]);
  }


  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  /*
  *método llamado cuando se crea un producto exitosamente desde el componente hijo
  */
  onProductoCreado() {
    this.showSuccessMessage = true;
    
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
    
    this.closeModal();
    this.buscarProductos(); // Recargar la tabla
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
  private cargarHorarios() {
    this.configureTypesService.buscarHorarios().subscribe(
      {
        next: data => {
          this.horarios = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no se cargaron las instituciones'});
        }
      }
    )
  }

  /*
  *cargar las prendas en la lista desplegable para la busqueda
  */
  private cargarPrendas() {
    this.configureTypesService.buscarPrendas().subscribe(
      {
        next: data => {
          this.prendas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          const dialogRef=this.dialog.open(MensajeAlertaComponent,{data:'no se cargaron las instituciones'});
        }
      }
    )
  }

  /*
  *cargar las generos en la lista desplegable para la busqueda
  */
  private cargarGeneros() {
    this.configureTypesService.buscarGeneros().subscribe(
      {
        next: data => {
          this.generos = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          const dialogRef=this.dialog.open(MensajeAlertaComponent,{data:'no se cargaron las instituciones'});
        }
      }
    )
  }

  /*
  *cargar las tallas en la lista desplegable para la busqueda
  */
  private cargarTallas() {
    this.configureTypesService.buscarTallas().subscribe(
      {
        next: data => {
          this.tallas = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no se cargaron las instituciones'});
        }
      }
    )
  }

  /*
  *cargar las instituciones en la lista desplegable para la busqueda
  */
  private cargarInstituciones() {
    this.configureTypesService.buscarInstituciones().subscribe(
      {
        next: data => {
          this.instituciones = data.respuesta.map(configType => ({
            value: configType.nombreTipo,
            viewValue: configType.nombreTipo
          }));
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no se cargaron las instituciones'});
        }
      }
    )
  }
}


