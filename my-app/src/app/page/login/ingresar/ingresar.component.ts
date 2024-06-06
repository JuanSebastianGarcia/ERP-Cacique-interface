import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../../core/models/login-dto';
import { LoginService } from '../../../core/service/login.service';
import { TokenService } from '../../../core/service/token.service';
import { Router } from '@angular/router';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { MatDialog } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.css'
})
export class IngresarComponent {


  //formulario que almacena los datos del login
  loginData: LoginDto = {
    email: '',
    password: ''
  }

  /*
  SERVICES
    loginService
    tokenService
  */
  constructor(private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router,
    public dialog: MatDialog) { };


  /*
  ingresar al servicio. validar si el empleado existe o no
  */
  login() {

    if (this.validarCampos()) {

      this.loginService.ingresarUsuario(this.loginData).subscribe({
        next: (data: RespuestaDto<string>) => {
          // Manejar el caso de éxito
          this.tokenService.login(data.respuesta);
          this.router.navigate(["productos"]);
        },
        error: (error) => {
          
          if (error.error.error) {//error en los datos
            const dialogRef = this.dialog.open(MensajeAlertaComponent, { data: error.error.respuesta });
            
          } else {//error en la conexion con el servidor
            const dialogRef = this.dialog.open(MensajeAlertaComponent, { data: 'No se tiene conexion con el servidor' });
          }
        }
      });

    } else {
      const dialogRef = this.dialog.open(MensajeAlertaComponent, { data: 'Debe de llenar los campos' });
    }

  }



  /*
  *se valida que los campos del login no esten vacios
  *return (true) si los campos estan completados, (false) si algun campo esta vacio
  */
  private validarCampos() {
    let respuesta: boolean = true;

    if (this.loginData.email == '' || this.loginData.password == '') {
      respuesta = false;
    }
    return respuesta;
  }



}
