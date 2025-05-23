import { Routes } from "@angular/router";
import { BuscarFacturaComponent } from "./buscar-factura/buscar-factura.component"
import { ActualizarFacturaComponent } from "./actualizar-factura/actualizar-factura.component";
import { CrearFacturaComponent } from "./crear-factura/crear-factura.component";
import { ProductosPendientesComponent } from "./productos-pendientes/productos-pendientes.component";


export const FACTURACION_ROUTES:Routes = [

    {path:'buscar-factura',component: BuscarFacturaComponent},
    {path:'actualizar-factura',component: ActualizarFacturaComponent},
    {path:'crear-factura',component: CrearFacturaComponent},
    {path:'productos-pendientes',component:ProductosPendientesComponent }
];