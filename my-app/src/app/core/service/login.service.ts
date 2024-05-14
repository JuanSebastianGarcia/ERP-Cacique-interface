import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login-dto';
import { RespuestaDto } from '../models/respuesta-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginURL = 'http://localhost:8443/api/login/ingresar';

  constructor(private http : HttpClient) { }

  public login(loginDto : LoginDto): Observable<RespuestaDto>{
    return this.http.post<RespuestaDto>(`${this.loginURL}/login`, loginDto);
  }

}
