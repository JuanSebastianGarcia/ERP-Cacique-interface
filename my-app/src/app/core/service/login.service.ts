import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login-dto';
import { RespuestaDto } from '../models/respuesta-dto';
import { HttpClient } from '@angular/common/http';
import { TokenDto } from '../models/token-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginURL = 'http://localhost:9090/api/login/ingresar';

  constructor(private http : HttpClient) { }

  /*
  *ingresar usuario
  *envia una solicitud al servidor para verificar que el usuario existe
  */
  public ingresarUsuario(loginDto : LoginDto): Observable<RespuestaDto<string>>{
    return this.http.post<RespuestaDto<string>>(`${this.loginURL}`, loginDto);
  }

}
