import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'', 
        loadChildren: () => import('./page/login/login.routes').then( m => m.LOGIN_ROUTES)
    }
];
