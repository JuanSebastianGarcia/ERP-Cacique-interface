import { Routes } from "@angular/router";
import { RegistroGastoComponent } from "./registro-gasto/registro-gasto.component";
import { GestionTipoGastoComponent } from "./gestion-tipo-gasto/gestion-tipo-gasto.component";

export const GASTOS_ROUTES: Routes=[

    {path:'registro',component:RegistroGastoComponent},
    {path:'gestionTipoGastos',component:GestionTipoGastoComponent}
];