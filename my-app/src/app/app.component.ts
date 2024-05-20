import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/service/login.service';
import { TokenService } from './core/service/token.service';
import { BarraLateralComponent } from './shared/components/barra-lateral/barra-lateral.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {ProductoService } from './core/service/producto.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
            RouterOutlet, 
            BarraLateralComponent,
            CommonModule,
            RouterModule,
            MatCardModule,
            MatTableModule,


  ],
  providers: [LoginService,
              TokenService,
              ProductoService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

  constructor(public tokenService:TokenService){};




}
