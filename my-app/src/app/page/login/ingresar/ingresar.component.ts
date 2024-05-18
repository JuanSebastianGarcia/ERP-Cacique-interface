import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../../core/models/login-dto';
import { LoginService } from '../../../core/service/login.service';
import { TokenService } from '../../../core/service/token.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.css'
})
export class IngresarComponent {


  //formulario que almacena los datos del login
  loginData: LoginDto  = {
    email: '',
    password:''  
  }

  /*
  SERVICES
    loginService
    tokenService
  */
  constructor(private loginService: LoginService, private tokenService: TokenService, private router:Router){};

  
  /*
  ingresar al servicio. validar si el empleado existe o no
  */
  login() {
    
    /*this.loginService.login(this.loginData).subscribe({
      next: (data: { error: boolean; respuesta: { token: any; }; }) => {
        if (data.error) {
          // Manejar el caso de error 
          console.log("no se puede ingresar");
        } else {
          // Manejar el caso de éxito
          this.tokenService.login(data.respuesta.token);
          this.router.navigate(["productos"]);
        }

      }
    });*/

    this.tokenService.login("1");
    this.router.navigate(["productos"]);
  }








}
