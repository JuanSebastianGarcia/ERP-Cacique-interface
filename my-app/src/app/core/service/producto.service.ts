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

  private productosURL = 'http://localhost:8443/api/manejoProducto/buscarProductos';

  constructor(private http: HttpClient) { }

  /*
  *buscar productos
  *envia una solicitud al servidor para que retorne una lista de productos
  */
  public buscarProductos(filtroProducto:FiltroListaProductoDto): Observable<RespuestaDto<ProductoDto[]>>{
    return this.http.post<RespuestaDto<ProductoDto[]>>(`${this.productosURL}`,filtroProducto);
  }


}
