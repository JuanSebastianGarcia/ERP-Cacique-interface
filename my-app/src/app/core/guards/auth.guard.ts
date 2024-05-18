import { CanActivateChildFn, Router } from '@angular/router';
import { TokenService } from '../service/token.service';
import { inject } from '@angular/core';

/*Proporciona un control de acceso a las rutas para asi evitar accesos sin autorizacion
*/
export const authGuard: CanActivateChildFn = (childRoute, state) => {

  //servicio que almacena el token
  const tokenService = inject(TokenService);

  //servicio de rutas
  const router = inject(Router);

  if(tokenService.isLogged()==true){
    console.log("the access is allod");
    return true;
  }else{
    router.navigate([""]);
    console.log("the access deny");
    return false;
  }
};
