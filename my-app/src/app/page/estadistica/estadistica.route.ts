import { Routes } from "@angular/router"
import { EstadisticaHistoricaComponent } from "./estadistica-historica/estadistica-historica.component";
import { EstadisticaDiariaComponent } from "./estadistica-diaria/estadistica-diaria.component";



export const ESTADISTICA_ROUTES: Routes =[
    {
        path:'estadisticas-historicas',component:EstadisticaHistoricaComponent
    },
    {
        path:'estadisticas-diaras',component:EstadisticaDiariaComponent
    }

  
];