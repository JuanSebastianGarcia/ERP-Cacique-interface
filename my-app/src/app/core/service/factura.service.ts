import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { RespuestaDto } from "../models/respuesta-dto";
import { FacturaDto } from "../models/factura-dto";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private facturaURL: string = 'http://localhost:9090/api/manejoFactura/buscarFactura';
  private facturasCargadas: FacturaDto[] = [];
  private idFacturaActualizando: number = 0;

  constructor(private http: HttpClient) {}

  /**
   * Función para consultar una factura
   */
  public consultarFactura(codigo: number, tipoCodigo: string): Observable<RespuestaDto<FacturaDto>> {
    return this.http.get<RespuestaDto<FacturaDto>>(`${this.facturaURL}/${codigo}/${tipoCodigo}`).pipe(
      tap((respuesta) => {
        if (respuesta && Array.isArray(respuesta.respuesta)) {
          this.facturasCargadas = respuesta.respuesta;
        }
      })
    );
  }

  
  /**
   * Retorna la factura previamente cargada que coincide con el ID actual
   */
  public getFacturaActualizar(): FacturaDto | undefined {
    return this.facturasCargadas.find(f => f.idFactura === this.idFacturaActualizando);
  }


  /**
   * Establece el ID de la factura que se desea actualizar
   */
  public setIdFacturaActualizando(id: number): void {
    this.idFacturaActualizando = id;
  }
}
