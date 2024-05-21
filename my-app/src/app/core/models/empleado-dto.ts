/*
*Interfaz que modela un empleado 
*/
export interface EmpleadoDto {

    id:number,
    nombre:string,
    cedula:string,
    telefono:string,
    email:string,
    password:string,
    tipoEmpleado:string
}
