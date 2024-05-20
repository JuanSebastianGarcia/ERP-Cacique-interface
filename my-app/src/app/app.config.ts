import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { autenticacionInterceptor } from './core/interceptor/autenticacion.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
  importProvidersFrom(HttpClientModule),
  provideHttpClient(withInterceptors([autenticacionInterceptor])),    
  provideRouter(routes), 
  provideAnimationsAsync('noop'),
 
  ]
};
