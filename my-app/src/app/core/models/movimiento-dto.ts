export interface RegistroMovimientoDto{

    registros:Registro[]
}

export interface Registro{
    fechaRegistro:string,
    tipoMovimiento:string,
    valorMovimiento:number,
}
