import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ProductoDto } from '../../../core/models/producto-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/service/producto.service';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [MatCardModule,FormsModule,],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit{

  //variables que se mostraran en el html
  public id: number = 0;
  public prenda: string = "prenda";
  public cantidad: number = 0;
  public institucion: string = "institucion";
  public talla: string = "talla";
  public horario: string = "horario";
  public precio: number =0;
  public genero: string = " genero";

  /*
  *almacena los datos del producto que se va a actualizar
  */
  productoData : ProductoDto = {
    id:0,
    prenda:'',
    institucion:'',
    talla:'',
    horario:'',
    genero:'',
    precio:0,
    cantidad:0,
    descripcion:' '
  }

  //variables que almacenan los cambios en la cantidad
  public cantidadAgregar:number=0;
  public cantidadDescontar:number=0;
  


  constructor(private router:Router,private productoService: ProductoService){}



  ngOnInit(): void {
    this.productoData=this.productoService.getProductoDto();

    //invocacion
    this.cargarDatos();
  }



  /*
  *guardar producto
  *Este metodo se encarga de almacenar los nuevos datos, validando que la cantidad no sea incongruente
  *y asignando los nuevos datos
  */
  actualizarProducto(){

      let datosValidados:boolean=this.validarDatos();


      //se validan las restas
      if (datosValidados) {
        this.productoData.cantidad=this.productoData.cantidad-this.cantidadDescontar;

        this.enviarSolicitudActualizar();
      }else{
        alert('la cantidad no se puede actualizar o el precio esta por debajo de cero');
      }

  }

  /*
  *volver a la pagina anterior
  */
  volver(){
    this.router.navigate(['productos']);
  }


  /*
  * envia la solicitud de actualizacion 
  */
  private enviarSolicitudActualizar(){
    this.productoService.actualizarProducto(this.productoData).subscribe(
      {
        next: data=>{
          alert('productoActualizado');
          this.router.navigate(['productos']);
        },
        error: error =>{
          alert('ocurrio un error');
          this.router.navigate(['productos']);
        }
        
      }
    );
  }


  /*
  *se encarga de asignar los datos a las variables que son leidas por el hmtl
  */
  private cargarDatos() {
    this.id = this.productoData.id;
    this.prenda = this.productoData.prenda;
    this.cantidad = this.productoData.cantidad;
    this.institucion = this.productoData.institucion;
    this.talla = this.productoData.talla;
    this.horario = this.productoData.horario;
    this.precio = this.productoData.precio;
    this.genero = this.productoData.genero;
  }


  /*
  *valida la coherencia del precio y las nuevas cantidades
  */
  validarDatos():boolean{

    let respuesta:boolean = false;

    //se agregan las sumas
    this.productoData.cantidad=this.productoData.cantidad+this.cantidadAgregar;

    if(this.productoData.cantidad>=this.cantidadDescontar && this.productoData.precio>0){
      respuesta=true;
    }

    return respuesta;
}




}












