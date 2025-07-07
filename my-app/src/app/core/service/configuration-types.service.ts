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

  /*
  *datos del dto para enviar al servidor para agregar un dato
  */
  datoDto:ConfigTypesDto={
    idTipo:0,
    nombreTipo:""
  }


  constructor(private http: HttpClient) { }




  /*
  *envia una solicitud para obtener la lista de horarios
  *
  * @return lista de datos encontrada
  */
  public buscarHorarios(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/horario`);
  }


  /*
  *envia una solicitud para obtener la lista de tallas
  *
  * @return lista de datos encontrada
  */
  public buscarTallas(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/talla`);
  }


  /*
  *envia una solicitud para obtener la lista de prendas
  *
  * @return lista de datos encontrada
  */
  public buscarPrendas(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/prenda`);
  }


  /*
  *envia una solicitud para obtener la lista de generos
  *
  *@return lista de datos encontrada
  */
  public buscarGeneros(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/genero`);
  }


  /*
  *envia una solicitud para obtener la lista de instituciones
  *
  * @return lista de datos encontrada
  */
  public buscarInstituciones(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/institucion`);
  }


  /*
   *envia una solicitud para eliminar un genero de la base de datos
   *
   * @param dato - nombre del dato a eliminar
   * 
   * @return respuesta del servidor
   */
  public eliminarGeneros(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/genero/${dato}`);
  }

  /*
   *envia una solicitud para eliminar una prenda de la base de datos
   *
   *  @param dato - nombre del dato a eliminar
   * 
   * @return respuesta del servidor
   */
  public eliminarPrendas(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/prenda/${dato}`);
  }


  /*
   *envia una solicitud para eliminar un talla de la base de datos
   *  
   * @param dato - nombre del dato a eliminar
   * 
   * @return respuesta del servidor
   */
  public eliminarTallas(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/talla/${dato}`);
  }


  /*
   *envia una solicitud para eliminar un horario de la base de datos
   *
   * @param dato - nombre del dato a eliminar
   * 
   * @return respuesta del servidor
   */
  public eliminarHorarios(dato: string): Observable<RespuestaDto<string>> {
    return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/horario/${dato}`);
  }


  /*
   *envia una solicitud para eliminar una institucion de la base de datos
   *
   * @param dato - nombre del dato a eliminar
   * 
   * @return respuesta del servidor
   */
  public eliminarInstituciones(dato: string): Observable<RespuestaDto<string>> {
      return this.http.delete<RespuestaDto<string>>(`${this.configTypesUrl}/institucion/${dato}`);
  }




  /*
  *envia una solicitud para agregar una institucion
  *
  * @param dato - nombre del dato que se quiere agregar
  * 
  * @return respuesta del servidor 
  */
  public agregarInstitucion(dato: string): Observable<RespuestaDto<string>> {

    this.datoDto.nombreTipo=dato;
    return this.http.post<RespuestaDto<string>>(`${this.configTypesUrl}/institucion`,this.datoDto);
  }


  /*
  *envia una solicitud para agregar un horario
  *
  * @param dato - nombre del dato que se quiere agregar
  * 
  * @return respuesta del servidor 
  */
  public agregarhorario(dato: string): Observable<RespuestaDto<string>> {
    this.datoDto.nombreTipo=dato;
    return this.http.post<RespuestaDto<string>>(`${this.configTypesUrl}/horario`,this.datoDto);
  }


  /*
  *envia una solicitud para agregar una talla
  *
  * @param dato - nombre del dato que se quiere agregar
  * 
  * @return respuesta del servidor 
  */
  public agregartalla(dato: string): Observable<RespuestaDto<string>> {
    this.datoDto.nombreTipo=dato;
    return this.http.post<RespuestaDto<string>>(`${this.configTypesUrl}/talla`,this.datoDto);
  }

    /*
  *envia una solicitud para agregar una prenda
  *
  * @param dato - nombre del dato que se quiere agregar
  * 
  * @return respuesta del servidor 
  */
  public agregarprenda(dato: string): Observable<RespuestaDto<string>> {
    this.datoDto.nombreTipo=dato;
    return this.http.post<RespuestaDto<string>>(`${this.configTypesUrl}/prenda`,this.datoDto);
  }


    /*
  *envia una solicitud para agregar un genero
  *
  * @param dato - nombre del dato que se quiere agregar
  * 
  * @return respuesta del servidor 
  */
  public agregarGenero(dato: string): Observable<RespuestaDto<string>> {
    this.datoDto.nombreTipo=dato;
    return this.http.post<RespuestaDto<string>>(`${this.configTypesUrl}/genero`,this.datoDto);
  }



}
