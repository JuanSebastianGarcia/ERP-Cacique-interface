import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaDto } from '../models/respuesta-dto';
import { HttpClient } from '@angular/common/http';
import { EmpleadoDto } from '../models/empleado-dto';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  /*
  *url que lleva a la api de los empleados
  */
  private empleadoURL='http://localhost:8443/api/manejoEmpleado'; 



  constructor(private http:HttpClient) { }



  /*
  *metodo que hara una solicitud que que pida la lista de empleados
  */
 public buscarEmpleados(): Observable<RespuestaDto<EmpleadoDto[]>> {
    return this.http.get<RespuestaDto<EmpleadoDto[]>>(`${this.empleadoURL}/buscarEmpleados`);
 }

}
