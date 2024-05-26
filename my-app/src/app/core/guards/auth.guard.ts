import { CanActivateChildFn, Router } from '@angular/router';
import { TokenService } from '../service/token.service';
import { inject } from '@angular/core';

/*Proporciona un control de acceso a las rutas para asi evitar accesos sin autorizacion
*/
export const authGuard: CanActivateChildFn = (childRoute, state) => {

  //inyeccion de servicios
  const tokenService = inject(TokenService);

  //servicio de rutas
  const router = inject(Router);


  if(tokenService.isLogged()==true){
    return true;
  }else{//redireccion al login
    router.navigate([""]);
    return false;
  }
};


