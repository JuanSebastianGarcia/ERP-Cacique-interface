import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { ProductoDto } from '../../../core/models/producto-dto';
import { ProductoService } from '../../../core/service/producto.service';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { MatDialog } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';


@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [FormsModule,
    MatSelectModule,
    CommonModule,
    MatGridListModule
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent implements OnInit {


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
  instituciones = [{ value: '', viewValue: '' },];
  prendas = [{ value: '', viewValue: '' },];
  tallas = [{ value: '', viewValue: '' },];
  horarios = [{ value: '', viewValue: '' },];
  generos = [{ value: '', viewValue: '' },];


  //formulario dto que sera enviado al servidor para crear el producto
  public productoData: ProductoDto= {
    id: 0,
    prenda: 'string',
    institucion: 'string',
    talla: 'string',
    horario: 'string',
    genero: 'string',
    precio: 0,
    cantidad: 0
  }


  constructor(private router: Router, 
              private productoService: ProductoService,
              private configureTypesService: ConfigurationTypesService,
              private dialog:MatDialog
            ) { }



  ngOnInit(): void {
    this.cargarListas();
  }




  /*
  *caputar los datos y hacer el registro de un nuevo producto
  */
  agregarProducto() {

    //validacion de los datos
    if (this.validarDatosProducto() == true) {


      this.productoService.agregarProducto(this.productoData).subscribe({

        next: (data: RespuestaDto<string>) => {
          const dialogRef = this.dialog.open(MensajeInformacionComponent,{data:data.respuesta});//confirmar la creacion   
          this.limpiarTabla();
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:error.error.respuesta});//informar un error
        }
      });

    }

  }


  /*
  *verificar la coherencia de los datos ingresados en precio y cantidad
  *@return true - el objeto cumple las validaciones 
  *@return false - el objeto no cumple con las validaciones
  */
  private validarDatosProducto(): boolean {

    let respuesta: boolean = true;

    //validar que sean enteros
    if (!(Number.isInteger(this.productoData.cantidad) && Number.isInteger(this.productoData.precio))) {
      respuesta = false;
      const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'el precio y las cantidades tienen que ser enteros'});
    }

    //validar que sean mayores que cero
    if (!(this.productoData.cantidad >= 0 && this.productoData.precio >= 0)) {
      respuesta = false;
      const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'no pueden haber datos menores a cero'});
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
}


