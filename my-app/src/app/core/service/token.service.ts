import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-key';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  /*
    asignar un nuevo token
    @param token - token optenido por el servidor
  */
  public setToken(token: string ){
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  } 


  /*
    consultar el token
    @return - codigo del token  
  */
  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }


  /*
    consultar si hay un token almacenado
    @return - si existe un token(true) si no existe(false)
  */
  public isLogged(): boolean{

    let respuesta: boolean =false;

    if(this.getToken()){
      respuesta=true;
    }

    return respuesta;
  }


  /*
    decodificar el token
    @param token - token optenido por el servidor
    @return valores del token
  */ 
  private decodePayload(token: string): any {
    const payload = token!.split(".")[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values;
  }


  /*
  ingresar un nuevo token que inicio sesion
  */
 public login(token: string){
  this.setToken(token);
  
 }


 /*
 eliminar un token que cierra sesion
 */
 public logout(){
  localStorage.removeItem(TOKEN_KEY);
 }
}
