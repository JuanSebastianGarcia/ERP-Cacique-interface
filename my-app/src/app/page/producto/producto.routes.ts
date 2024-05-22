import { Routes } from "@angular/router";
import { VisualizarProductosComponent } from "./visualizar-productos/visualizar-productos.component";
import { CrearProductoComponent } from "./crear-producto/crear-producto.component";
import { EditarProductoComponent } from "./editar-producto/editar-producto.component";


export const PRODUCTO_ROUTES:Routes = [

    {path:'',component: VisualizarProductosComponent},
    {path:'crear-producto',component:CrearProductoComponent},
    {path:'editar-producto',component:EditarProductoComponent}
];