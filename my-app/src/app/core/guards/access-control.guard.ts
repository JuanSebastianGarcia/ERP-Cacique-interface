import { Inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../service/token.service';

export const accessControlGuard: CanActivateFn = (route, state) => {

  //inyeccion de servicios
  const tokenService = Inject(TokenService);
  
  //datos del token
  const tipoEmpleado=tokenService.getTipoEmpleado();

  if(tipoEmpleado === 'JEFE'){
    return true;
  }else{
    return true;
  }

};
