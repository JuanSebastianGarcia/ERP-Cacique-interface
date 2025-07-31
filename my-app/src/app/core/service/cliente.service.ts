import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RespuestaDto } from "../models/respuesta-dto";
import { ClienteDto } from "../models/cliente-dto";
import { Observable } from "rxjs";

/**
 * Servicio para gestionar las operaciones CRUD de clientes
 */
@Injectable({
    providedIn: 'root'
})
export class ClienteService {
  private clienteURL: string = 'http://localhost:9090/api/cliente';
  private clientesCargados: any[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Busca un cliente por su código identificador
   * @param codigo - Código único del cliente a buscar
   * @returns Observable con la respuesta que contiene los datos del cliente
   */
  public buscarCliente(codigo:number):Observable<RespuestaDto<ClienteDto>>{
    return this.http.get<RespuestaDto<ClienteDto>>(`${this.clienteURL}/${codigo}`);
  }

  /**
   * Crea un nuevo cliente en el sistema
   * @param cliente - Datos del cliente a crear
   * @returns Observable con la respuesta de confirmación
   */
  public crearCliente(cliente: ClienteDto): Observable<RespuestaDto<string>> {
    return this.http.post<RespuestaDto<string>>(`${this.clienteURL}`, cliente);
  }



  /**
   * Busca un cliente por su código identificador de forma síncrona en la lista de clientes cargados
   * @param codigo - Código único del cliente a buscar
   * @returns ClienteDto encontrado o undefined si no existe
   */
  public buscarClienteSincrono(codigo:number):Observable<RespuestaDto<ClienteDto>>{
    return this.http.get<RespuestaDto<ClienteDto>>(`${this.clienteURL}/${codigo}`);
  }

}