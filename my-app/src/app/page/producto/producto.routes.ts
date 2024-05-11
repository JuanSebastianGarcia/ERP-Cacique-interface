import { Routes } from "@angular/router";
import { VisualizarProductosComponent } from "./visualizar-productos/visualizar-productos.component";
import { CrearProductoComponent } from "./crear-producto/crear-producto.component";


export const PRODUCTO_ROUTES:Routes = [

    {path:'',component: VisualizarProductosComponent},
    {path:'crear-producto',component:CrearProductoComponent}

];