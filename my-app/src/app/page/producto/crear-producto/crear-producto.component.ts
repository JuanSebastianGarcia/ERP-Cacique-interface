import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoDto } from '../../../core/models/producto-dto';
import { ProductoService } from '../../../core/service/producto.service';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { CommonModule } from '@angular/common';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';


@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [FormsModule,
    CommonModule
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent implements OnInit {


  @Input() isModalMode: boolean = false; // Indica si se usa como modal
  @Output() productoCreado = new EventEmitter<void>(); // Evento que emite cuando se crea un producto
  @Output() cancelar = new EventEmitter<void>(); // Evento para cancelar (usado en modo modal)


  /*
  *Variables que almacenan la opcion de las listas
  */
  prenda: string = '';
  institucion: string = '';
  talla: string = '';
  horario: string = '';
  genero: string = '';
  cantidad: number = 0;
  precio: number = 0.0;


  /*
  *
  */
  /*
  *LOS SIGUIENTES DATOS ESTAN PARA LAS LISTAS DESPLEGABLES
  */
  instituciones: { value: string, viewValue: string }[] = [];
  prendas: { value: string, viewValue: string }[] = [];
  tallas: { value: string, viewValue: string }[] = [];
  horarios: { value: string, viewValue: string }[] = [];
  generos: { value: string, viewValue: string }[] = [];


  //formulario dto que sera enviado al servidor para crear el producto
  public productoData: ProductoDto= {
    id: 0,
    prenda: '',
    institucion: '',
    talla: '',
    horario: '',
    genero: '',
    precio: 0,
    cantidad: 0,
    descripcion: ''
  }


  constructor(private router: Router, 
              private productoService: ProductoService,
              private configureTypesService: ConfigurationTypesService,
              private dialog:MatDialog,
              private dialogRef: MatDialogRef<CrearProductoComponent>,
            ) { }



  ngOnInit(): void {
    this.cargarListas();
  }




  /*
  *caputar los datos y hacer el registro de un nuevo producto
  */
  public agregarProducto() {

    if (this.validarDatosProducto() == true) {
      this.productoService.agregarProducto(this.productoData).subscribe({
        next: (data: RespuestaDto<string>) => {
  
          this.dialogRef.close({
            error: false,
            mensaje: data.respuesta
          });
        },
        error: error => {
  
          this.dialogRef.close({
            error: true,
            mensaje: error.error.respuesta
          });
        }
      });

    }

  }


  /*
  *método para cancelar la creación (usado en modo modal)
  */
  cancelarCreacion() {
    this.limpiarTabla();
    this.cancelar.emit();
    this.dialogRef.close();
  }

  /*
  *método para cerrar el modal cuando se hace clic fuera del formulario
  */
  onOverlayClick(event: MouseEvent) {
    if (this.isModalMode) {
      this.cancelarCreacion();
    }
  }

  /*
  *método para cerrar el modal con la tecla Escape
  */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isModalMode) {
      this.cancelarCreacion();
    }
  }


  /*
  *verificar la coherencia de los datos ingresados en precio y cantidad
  *@return true - el objeto cumple las validaciones 
  *@return false - el objeto no cumple con las validaciones
  */
  private validarDatosProducto(): boolean {

    let respuesta: boolean = true;

    //validar que todos los campos tengan datos
    if (!(this.productoData.prenda && this.productoData.institucion && this.productoData.talla && this.productoData.horario && this.productoData.genero)) {
      respuesta = false;
      const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no pueden haber campos vacios'});
      return respuesta;
    }

    //validar que sean enteros
    if (!(Number.isInteger(this.productoData.cantidad) && Number.isInteger(this.productoData.precio) )) {
      respuesta = false;
      const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'el precio y las cantidades tienen que ser enteros'});
      return respuesta;
    }

    //validar que sean mayores que cero
    if (!(this.productoData.cantidad >= 0 && this.productoData.precio > 0)) {
      respuesta = false;
      const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no pueden haber datos menores a cero'});
      return respuesta;
    }



    return respuesta;
  }




  /*
  *despues de crear un producto se limpia el formulario
  */
  limpiarTabla() {
    this.productoData = {
      id: 0,
      prenda: '',
      institucion: '',
      talla: '',
      horario: '',
      genero: '',
      precio: 0,
      cantidad: 0,
      descripcion: ''
    };
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


  public cerrarModal() {
    this.dialogRef.close();
  }
}


