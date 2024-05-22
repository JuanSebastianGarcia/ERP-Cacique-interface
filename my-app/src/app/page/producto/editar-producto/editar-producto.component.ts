import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ProductoDto } from '../../../core/models/producto-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [MatCardModule,FormsModule,],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent {
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
    descripcion:''
  }

  //variables que almacenan los cambios en la cantidad
  public cantidadAgregar:number=0;
  public cantidadDescontar:number=0;
  


  /*
  *metodo que se encarga de actualizar un producto
  */
  actualizarProducto(){
    
  }


  volver(){
    
  }
}













