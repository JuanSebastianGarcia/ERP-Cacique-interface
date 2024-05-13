import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../../core/models/login-dto';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.css'
})
export class IngresarComponent {



  loginData: LoginDto  = {
    email: '',
    password:''  
  }

  constructor(){};

  
  login() {
    
    console.log(this.loginData)

  }
}
