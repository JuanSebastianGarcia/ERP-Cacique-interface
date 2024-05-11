import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'', 
        loadChildren: () => import('./page/login/login.routes').then( m => m.LOGIN_ROUTES)
    },
    {
        path:'productos',
        loadChildren: ()=> import('./page/producto/producto.routes').then(m => m.PRODUCTO_ROUTES)
    },
    {
        path:'empleados',
        loadChildren:() => import('./page/empleado/empleado.routes').then(m => m.EMPLEADO_ROUTES)
    }
];
