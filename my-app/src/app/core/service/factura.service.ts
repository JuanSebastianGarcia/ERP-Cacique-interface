import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { RespuestaDto } from "../models/respuesta-dto";
import { FacturaDto } from "../models/factura-dto";
import { ProductoPendienteDto } from "../models/producto-pendiente-dto";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  /** Base URL for invoice-related endpoints */
  private facturaURL: string = 'http://localhost:9090/api/factura';

  /** Internal cache of loaded invoices */
  private facturasCargadas: FacturaDto[] = [];

  /** ID of the invoice being updated */
  private idFacturaActualizando: number = 0;

  constructor(private http: HttpClient) {}

  /**
   * Fetches an invoice based on code and code type
   * @param codigo - identifier value (e.g., client ID or invoice ID)
   * @param tipoCodigo - type of identifier (e.g., 'cliente' or 'factura')
   * @returns observable with the response containing invoice data
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
   * Retrieves the invoice from cache matching the current update ID
   * @returns invoice DTO or undefined if not found
   */
  public getFacturaActualizar(): FacturaDto | undefined {
    
    const factura = this.facturasCargadas.find(f => f.idFactura === this.idFacturaActualizando);

    factura?.listaProductos.forEach(producto => {
      producto.estadoCerrado = producto.estado === 'ENTREGADO';
    });

    return factura;
  }

  /**
   * Sets the ID of the invoice to be updated
   * @param id - invoice ID
   */
  public setIdFacturaActualizando(id: number): void {
    this.idFacturaActualizando = id;
  }

  /**
   * Sends a request to update an existing invoice
   * @param factura - updated invoice DTO
   * @returns observable with the response message
   */
  public actualizarFactura(factura: FacturaDto): Observable<RespuestaDto<String>> {
    return this.http.put<RespuestaDto<String>>(`${this.facturaURL}/${factura.idFactura}`, factura);
  }

  /**
   * Sends a request to create a new invoice
   * @param factura - invoice DTO to be generated
   * @returns observable with the response message
   */
  public generarFactura(factura: FacturaDto): Observable<RespuestaDto<String>> {
    return this.http.post<RespuestaDto<String>>(`${this.facturaURL}`, factura);
  }


  public buscarProductosPendientes(): Observable<RespuestaDto<ProductoPendienteDto[]>>{
    return this.http.get<RespuestaDto<ProductoPendienteDto[]>>(`${this.facturaURL}/consultarProductosPendientes`);

  }
}
