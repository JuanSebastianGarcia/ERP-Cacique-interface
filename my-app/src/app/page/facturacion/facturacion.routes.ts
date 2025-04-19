import { Routes } from "@angular/router";
import { BuscarFacturaComponent } from "./buscar-factura/buscar-factura.component"
import { ActualizarFacturaComponent } from "./actualizar-factura/actualizar-factura.component";


export const FACTURACION_ROUTES:Routes = [

    {path:'buscar-factura',component: BuscarFacturaComponent},
    {path:'actualizar-factura',component: ActualizarFacturaComponent},
];