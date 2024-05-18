import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './core/service/login.service';
import { TokenService } from './core/service/token.service';
import { BarraLateralComponent } from './shared/components/barra-lateral/barra-lateral.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule,BarraLateralComponent,CommonModule,RouterModule],
  providers: [LoginService,TokenService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

  constructor(public tokenService: TokenService){};




}
