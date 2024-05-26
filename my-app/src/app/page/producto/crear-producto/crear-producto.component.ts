import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule} from '@angular/material/select';
import { ProductoDto } from '../../../core/models/producto-dto';
import { ProductoService } from '../../../core/service/producto.service';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';


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
export class CrearProductoComponent {


  /*
  *Variables que almacenan la opcion de las listas
  */
  prenda : string='';
  institucion : string='';
  talla : string='';
  horario : string='';
  genero : string='';
  cantidad:number=0;
  precio:number=0.0;
  descripcion:string='';


  /*
  *
  */
  /*
  *LOS SIGUIENTES DATOS ESTAN PARA LAS LISTAS DESPLEGABLES
  */
  instituciones = [
    {value: 'robledo', viewValue: 'robledo'},
    {value: 'tecnologico', viewValue: 'tecnologico'},
    {value: 'instituto', viewValue: 'instituto'},
    {value: 'romaval', viewValue: 'romaval'},
    {value: 'baudilio', viewValue: 'baudilio'},
    {value: 'general santander', viewValue: 'general santander'},
    {value: 'san jose', viewValue: 'san jose'},
    {value: 'niño jesus', viewValue: 'niño jesus'},
    {value: 'jhon dewey', viewValue: 'jhon dewey'},
    {value: 'la virgina', viewValue: 'la virgina'},
    {value: 'rafael uribe', viewValue: 'rafael uribe'},
    {value: 'antonio nariño', viewValue: 'antonio nariño'},
  ];
  prendas = [
    {value: 'camibuso', viewValue: 'camibuso'},
    {value: 'pantalon', viewValue: 'pantalon'},
    {value: 'sudadera', viewValue: 'sudadera'},
    {value: 'camisa cuello sport', viewValue: 'camisa cuello sport'},
    {value: 'camisa cuello corbata', viewValue: 'camisa cuello corbata'},
    {value: 'camisa manga larga', viewValue: 'camisa manga larga'},
    {value: 'camisa manga corta', viewValue: 'camisa manga corta'},
    {value: 'pantaloneta', viewValue: 'pantaloneta'},
    {value: 'chaqueta', viewValue: 'chaqueta'},
    {value: 'falda', viewValue: 'falda'},
    {value: 'chaleco', viewValue: 'chaleco'},
    {value: 'medias', viewValue: 'medias'},
    {value: 'corbata', viewValue: 'corbata'},
  ];
  tallas = [
    {value: '0', viewValue: '0'},
    {value: '1', viewValue: '1'},
    {value: '2', viewValue: '2'},
    {value: '3', viewValue: '3'},
    {value: '4', viewValue: '4'},
    {value: '5', viewValue: '5'},
    {value: '6', viewValue: '6'},
    {value: '8', viewValue: '8'},
    {value: '10', viewValue: '10'},
    {value: '12', viewValue: '12'},
    {value: '14', viewValue: '14'},
    {value: '16', viewValue: '16'},
    {value: 'xs', viewValue: 'xs'},
    {value: 's', viewValue: 'S'},
    {value: 'm', viewValue: 'M'},
    {value: 'l', viewValue: 'L'},
    {value: 'xl', viewValue: 'XL'},
    {value: 'xxl', viewValue: 'XXL'},
    {value: 'xxxl', viewValue: 'XXXL'},
    {value: 'xxxxl', viewValue: 'XXXXL'},
  ];
  horarios = [
    {value: 'diario', viewValue: 'diario'},
    {value: 'fisica', viewValue: 'fisica'},
  ];
  generos = [
    {value: 'hombre', viewValue: 'hombre'},
    {value: 'mujer', viewValue: 'mujer'},
  ];

  //formulario dto que sera enviado al back
  productoData : ProductoDto ={
    id:0,
    prenda:'string',
    institucion:'string',
    talla:'string',
    horario:'string',
    genero:'string',
    precio:0.0,
    cantidad:0,
    descripcion:'string'
  }



  
  constructor(private router:Router,private productoService:ProductoService){ }




  /*
  *caputar los datos y hacer el registro de un nuevo producto
  */  
  agregarProducto(){

    //validacion de los datos
    if(this.validarDatos()==true){


      this.productoService.agregarProducto(this.productoData).subscribe({

        next:(data:RespuestaDto<string>) =>{
            alert(data.respuesta);//notificar exito         
        },
        error: error=>{
          alert('el producto no se pudo agregar');//notificar respuesta
        }
      });

    }

  }


  /*
  *verificar la coherencia de los datos ingrsados en precio y cantidad
  *@return true - el objeto cumple las validaciones 
  *@return false - el objeto no cumple con las validaciones
  */
  private validarDatos(): boolean {
    
    let respuesta : boolean =true;

    if(!(Number.isInteger(this.productoData.cantidad) && Number.isInteger(this.productoData.precio))){
      respuesta=false;
      alert('los datos de precio y cantidad deben ser valores numericos enteros');
    }
    if(!(this.productoData.cantidad>=0 && this.productoData.precio>=0)){
      respuesta=false;
      alert('los datos de precio y cantidad deben ser valores coherentes de cero en adelante');
    }

    return respuesta;
  }




  /*
  *volver a la pagina anterior
  */
  volverTabla(){
      this.router.navigate(['productos']);
  }



}
