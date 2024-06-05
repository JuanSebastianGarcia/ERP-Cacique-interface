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
  descripcion: string = '';


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
  public productoData: ProductoDto = {
    id: 0,
    prenda: 'string',
    institucion: 'string',
    talla: 'string',
    horario: 'string',
    genero: 'string',
    precio: 0.0,
    cantidad: 0,
    descripcion: 'string'
  }




  constructor(private router: Router, 
              private productoService: ProductoService,
              private configureTypesService: ConfigurationTypesService
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
          alert(data.respuesta);//notificar exito    
          this.limpiarTabla();
        },
        error: error => {
          alert('el producto no se pudo agregar');//notificar respuesta
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
      alert('los datos de precio y cantidad deben ser valores numericos enteros');
    }

    //validar que sean mayores que cero
    if (!(this.productoData.cantidad >= 0 && this.productoData.precio >= 0)) {
      respuesta = false;
      alert('los datos de precio y cantidad deben ser valores coherentes de cero en adelante');
    }

    return respuesta;
  }




  /*
  *volver a la pagina anterior
  */
  volverTabla() {
    this.router.navigate(['productos']);
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
          alert('no se cargaron las instituciones');
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
          alert('no se cargaron las instituciones');
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
          alert('no se cargaron las instituciones');
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
          alert('no se cargaron las instituciones');
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
          alert('no se cargaron las instituciones');
        }
      }
    )
  }
}


