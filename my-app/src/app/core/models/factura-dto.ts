import { ProductoFacturaDto } from "./producto-factura-dto";

export interface FacturaDto{
    idFactura:number,
    estadoFactura:string,
    fechaFactura:string,
    cedulaCliente:string,
    listaProductos:ProductoFacturaDto[],
    metodoPago:string,
    pago:number,
    valorPagado:number
}