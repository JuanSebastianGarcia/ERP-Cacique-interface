import { Injectable } from '@angular/core';
import { FiltroListaProductoDto } from '../models/filtro-lista-producto-dto';
import { ProductoDto } from '../models/producto-dto';
import { Observable } from 'rxjs';
import { RespuestaDto } from '../models/respuesta-dto';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  

  /*
  *url que lleva a la api de los productos
  */
  private productosURL='http://localhost:9090/api/producto'


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

  };

  constructor(private http: HttpClient) { 

  }

  /*
  *buscar productos
  *envia una solicitud al servidor para que retorne una lista de productos
  */
  public buscarProductos(filtroProducto:FiltroListaProductoDto): Observable<RespuestaDto<ProductoDto[]>>{
    let params = new HttpParams()
      .set('prenda', filtroProducto.prenda)
      .set('talla', filtroProducto.talla)
      .set('horario', filtroProducto.horario)
      .set('genro', filtroProducto.genero)
      .set('institucion', filtroProducto.institucion);

    return this.http.get<RespuestaDto<ProductoDto[]>>(`${this.productosURL}`, { params });
  }


  /*
  *eliminar un producto
  *envia una solicitud al servidor para eliminar un producto de la lista
  */
  eliminarProducto(id: number) {
    return this.http.delete<RespuestaDto<string>>(`${this.productosURL}/${id}`);
  }

  /*
  *agregar un producto
  *envia una solicitud al servidor para agregar un producto
  */
  agregarProducto(productoData: ProductoDto):Observable<RespuestaDto<string>> {
    return this.http.post<RespuestaDto<string>>(`${this.productosURL}`,productoData)
  }

  /*
  *actualizar un producto
  *envia una solicitud al servidor para actualizar los datos del producto
  */
  actualizarProducto(productoData: ProductoDto):Observable<RespuestaDto<string>>{
    return this.http.put<RespuestaDto<string>>(`${this.productosURL}/${productoData.id}`,productoData);
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
