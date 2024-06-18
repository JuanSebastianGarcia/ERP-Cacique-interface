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
import { IngresarComponent } from "./page/login/ingresar/ingresar.component";



@Component({
    selector: 'app-root',
    standalone: true,
    providers: [LoginService,
        TokenService,
        ProductoService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        BarraLateralComponent,
        CommonModule,
        RouterModule,
        MatCardModule,
        MatTableModule,
        IngresarComponent
    ]
})
export class AppComponent {



  constructor(public tokenService:TokenService){};


}
