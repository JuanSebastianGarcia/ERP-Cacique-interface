import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../core/service/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-lateral',
  templateUrl: './barra-lateral.component.html',
  styleUrl: './barra-lateral.component.css',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ]
})
/*
*Este componente se encarga de presentar una barra lateral la cual contiene todas las funcionalidades del programa
*/
export class BarraLateralComponent {

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
