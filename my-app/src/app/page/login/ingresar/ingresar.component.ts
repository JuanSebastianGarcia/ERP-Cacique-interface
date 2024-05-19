import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../../core/models/login-dto';
import { LoginService } from '../../../core/service/login.service';
import { TokenService } from '../../../core/service/token.service';
import { Router } from '@angular/router';
import { TokenDto } from '../../../core/models/token-dto';
import { RespuestaDto } from '../../../core/models/respuesta-dto';

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
    
    this.loginService.ingresarUsuario(this.loginData).subscribe({
      next: (data: RespuestaDto<TokenDto>) => {
        if (data.error) {
          console.log("no se puede ingresar");
        } else {
          // Manejar el caso de éxito
          console.log(data.respuesta.token);
          this.tokenService.login(data.respuesta.token);
          this.router.navigate(["productos"]);
        }
      }
    });

    //this.router.navigate(["productos"]);
  }








}
