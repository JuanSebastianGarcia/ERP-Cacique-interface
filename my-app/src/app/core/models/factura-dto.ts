import { ProductoFacturaDto } from "./producto-factura-dto";

export interface FacturaDto{
    idFactura:number,
    estadoFactura:string,
    cedulaCliente:string,
    listaProductos:ProductoFacturaDto[],
    metodopago:string,
    pago:number,
    valorPagado:number
}