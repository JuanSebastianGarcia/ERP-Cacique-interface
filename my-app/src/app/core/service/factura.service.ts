import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RespuestaDto } from "../models/respuesta-dto";
import { FacturaDto } from "../models/factura-dto";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class FacturaService {

    private facturaURL = 'http://localhost:9090/api/manejoFactura/';

    constructor(private http: HttpClient) { }

    /*
    *funcion para consultar una factura
    */
   public consultarFactura(codigo:number,tipoCodigo:string): Observable<RespuestaDto<FacturaDto>>{
    return this.http.get<RespuestaDto<FacturaDto>>(`${this.facturaURL}/consultarFactura/${codigo}/${tipoCodigo}`);
   }
   
}