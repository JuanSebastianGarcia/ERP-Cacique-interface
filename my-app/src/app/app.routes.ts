import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { accessControlGuard } from './core/guards/access-control.guard';

export const routes: Routes = [

    {
        path:'', 
        loadChildren: () => import('./page/login/login.routes').then( m => m.LOGIN_ROUTES)
    },
    {
        path:'productos',
        loadChildren: ()=> import('./page/producto/producto.routes').then(m => m.PRODUCTO_ROUTES),
        canActivateChild: [authGuard,accessControlGuard]
    },
    {
        path:'empleados',
        loadChildren:() => import('./page/empleado/empleado.routes').then(m => m.EMPLEADO_ROUTES),
        canActivateChild: [authGuard,accessControlGuard]
    }
];
