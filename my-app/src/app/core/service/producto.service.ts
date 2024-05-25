import { Injectable } from '@angular/core';
import { FiltroListaProductoDto } from '../models/filtro-lista-producto-dto';
import { ProductoDto } from '../models/producto-dto';
import { Observable } from 'rxjs';
import { RespuestaDto } from '../models/respuesta-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {



  //variable que almacena la informacion del producto actualizando
  productoDto: ProductoDto={
    id:0,
    prenda:'',
    institucion:'',
    talla:'',
    horario:'',
    genero:'',
    precio:0,
    cantidad:0,
    descripcion:''

  };


  /*
  *url que lleva a la api de los productos
  */
  private productosURL = 'https://cacique-erp.azurewebsites.net/api/manejoProducto';


  constructor(private http: HttpClient) { 

  }

  /*
  *buscar productos
  *envia una solicitud al servidor para que retorne una lista de productos
  */
  public buscarProductos(filtroProducto:FiltroListaProductoDto): Observable<RespuestaDto<ProductoDto[]>>{
    return this.http.post<RespuestaDto<ProductoDto[]>>(`${this.productosURL}/buscarProductos`,filtroProducto);
  }


  /*
  *eliminar un producto
  *envia una solicitud al servidor para eliminar un producto de la lista
  */
  eliminarProducto(id: number) {
    return this.http.delete<RespuestaDto<string>>(`${this.productosURL}/eliminarProducto/${id}`);
  }

  /*
  *agregar un producto
  *envia una solicitud al servidor para agregar un producto
  */
  agregarProducto(productoData: ProductoDto):Observable<RespuestaDto<string>> {
    return this.http.post<RespuestaDto<string>>(`${this.productosURL}/crearProducto`,productoData)
  }

  /*
  *actualizar un producto
  *envia una solicitud al servidor para actualizar los datos del producto
  */
  actualizarProducto(productoData: ProductoDto):Observable<RespuestaDto<string>>{
    return this.http.post<RespuestaDto<string>>(`${this.productosURL}/actualizarProducto`,productoData);
  }





  /*
  *Este metodo recibe la informaciond de un producto y la mantiene almacenada durante el tiempo de edicion
  */
  agregarProductoActualizando(producto: any) {
    this.productoDto.cantidad=producto.cantidad;
    this.productoDto.id=producto.id;
    this.productoDto.prenda=producto.prenda;
    this.productoDto.institucion=producto.institucion;
    this.productoDto.talla=producto.talla;
    this.productoDto.horario=producto.horario;
    this.productoDto.precio=producto.precio;
    this.productoDto.genero=producto.genero;

  }

  /*
  *metodo que retorna la propiedad productoDto
  */
  getProductoDto(): ProductoDto {
    return this.productoDto;
  }
}
