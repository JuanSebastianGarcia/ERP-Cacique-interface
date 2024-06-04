import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaDto } from '../models/respuesta-dto';
import { ConfigTypesDto } from '../models/config-types-dto';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationTypesService {


  /*
  *url que lleva a la api de los configureTypes
  */
  private configTypesUrl = 'http://localhost:9090/api/configuracionTipos';


  constructor(private http:HttpClient) { }




  /*
  *envia una solicitud para obtener la lista de horarios
  */
  public buscarHorarios(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarHorarios`);
  }


  /*
  *envia una solicitud para obtener la lista de tallas
  */
  public buscarTallas(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarTallas`);
  }


  /*
  *envia una solicitud para obtener la lista de prendas
  */
  public buscarPrendas(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarPrendas`);
  }


  /*
  *envia una solicitud para obtener la lista de generos
  */
  public buscarGeneros(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarGeneros`);
  }


  /*
  *envia una solicitud para obtener la lista de instituciones
  */
  public buscarInstituciones(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarInstituciones`);
  }


  /*
   *
   */
  eliminarGeneros(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/eliminarGenero/${dato}`);
  }

  /*
   *
   */
  eliminarPrendas(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/eliminarPrenda/${dato}`);
  }

  /*
   *
   */
  eliminarTallas(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/eliminarTalla/${dato}`);
  }

  /*
   *
   */
  eliminarHorarios(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/eliminarHorario/${dato}`);
  }

  /*
   *
   */
  eliminarInstituciones(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/eliminarInstitucion/${dato}`);
  }




}
