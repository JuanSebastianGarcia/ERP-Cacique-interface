import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../service/token.service';
import { Observable } from 'rxjs';

/*
*interceptor encargado de agregar el token al encabezado de las solicitudes
*/
export const autenticacionInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next:HttpHandlerFn):
 Observable<HttpEvent<unknown>> => {
  
  //servicio de token 
  const tokenServicio = new TokenService();
  
  if (tokenServicio.isLogged()) {
    const token=tokenServicio.getToken();
      req = req.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });
  }
  return next(req);
};
