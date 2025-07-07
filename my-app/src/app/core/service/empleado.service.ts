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
  private empleadoURL='http://localhost:9090/api/empleado'; 


  constructor(private http:HttpClient) { }



  /*
  *metodo que hace una solicitud que que pida la lista de empleados
  */
 public buscarEmpleados(): Observable<RespuestaDto<EmpleadoDto[]>> {
    return this.http.get<RespuestaDto<EmpleadoDto[]>>(`${this.empleadoURL}`);
 }


 /*
 *metodo que hace una solicitud al back para eliminar un empeado
 */
 public eliminarEmpleado(cedula:number): Observable<RespuestaDto<string>>{
   return this.http.delete<RespuestaDto<string>>(`${this.empleadoURL}/${cedula}`);
 }

 
 /*
 *metodo que hace una solicitud al back para agregar un empleado
 */
 public agregarEmpleado(empleadoData: EmpleadoDto):Observable<RespuestaDto<string>>{
  return this.http.post<RespuestaDto<string>>(`${this.empleadoURL}`,empleadoData);
  }
}
