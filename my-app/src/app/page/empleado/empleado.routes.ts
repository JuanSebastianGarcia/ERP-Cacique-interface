import { Routes } from "@angular/router"
import { VisualizarEmpleadosComponent } from "./visualizar-empleados/visualizar-empleados.component";
import { CrearEmpleadoComponent } from "./crear-empleado/crear-empleado.component";



export const EMPLEADO_ROUTES: Routes =[
    {
        path:'',component:VisualizarEmpleadosComponent
    },
    {
        path:'crear-empleado',component:CrearEmpleadoComponent
    }
    
];