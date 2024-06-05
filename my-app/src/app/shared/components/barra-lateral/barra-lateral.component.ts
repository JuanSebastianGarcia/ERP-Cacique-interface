import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../core/service/token.service';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-barra-lateral',
  templateUrl: './barra-lateral.component.html',
  styleUrl: './barra-lateral.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterModule,
    MatExpansionModule
  ]
})
/*
*Este componente se encarga de presentar una barra lateral la cual contiene todas las funcionalidades del programa
*/
export class BarraLateralComponent {


  // Inyección del servicio BreakpointObserver para observar cambios en los breakpoints (puntos de interrupción de diseño)
  private breakpointObserver = inject(BreakpointObserver);


  // Propiedad que controla si el sidenav (panel lateral) está abierto o cerrado
  opened = true;


  // Observable que emite un booleano indicando si el dispositivo es un "handset" (dispositivo móvil)
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );



  constructor(private tokenService: TokenService,
               private router: Router){ }





  /*
  * Método para cerrar sesión y limpiar la sesion actual
  */
  logout() {
    // Llama al método logout del servicio de tokens
    this.tokenService.logout();
    // Navega a la página principal después de cerrar sesión
    this.router.navigate(['']);
  }
}
