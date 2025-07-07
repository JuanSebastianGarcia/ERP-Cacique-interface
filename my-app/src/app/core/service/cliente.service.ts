import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RespuestaDto } from "../models/respuesta-dto";
import { ClienteDto } from "../models/cliente-dto";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ClienteService {
  private clienteURL: string = 'http://localhost:9090/api/cliente';
  private clientesCargados: any[] = [];

  constructor(private http: HttpClient) {}

    /*
    * Función para consultar un cliente
    */
  public buscarCliente(codigo:number):Observable<RespuestaDto<ClienteDto>>{
    return this.http.get<RespuestaDto<ClienteDto>>(`${this.clienteURL}/${codigo}`);
  }

  public crearCliente(cliente: ClienteDto): Observable<RespuestaDto<string>> {
    return this.http.post<RespuestaDto<string>>(`${this.clienteURL}`, cliente);
  }




}