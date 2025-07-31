export interface ProductoFacturaDto {
    idRelacion: number,
    prenda:string,
    institucion:string,
    talla:string,
    horario:string,
    genero:string,
    precio:number,
    estado:string,
    descripcion:string,
    estadoCerrado?:boolean
}