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
  *envia una solicitud para obtener la lista de instituciones
  */
  public buscarInstituciones(): Observable<RespuestaDto<ConfigTypesDto[]>> {
    return this.http.get<RespuestaDto<ConfigTypesDto[]>>(`${this.configTypesUrl}/buscarInstituciones`);
  }

}
