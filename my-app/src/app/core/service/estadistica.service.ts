import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KPIMensualDto } from "../models/kpi-mensual-dto";
import { RespuestaDto } from "../models/respuesta-dto";
import { Observable } from "rxjs";
import { InfoGraficaHistoriaDto } from "../models/info-grafica-historica-dto";
import { KPIDiarioDto } from "../models/kspi-diario-dto";
import { RegistroMovimientoDto } from "../models/movimiento-dto";

@Injectable({
    providedIn: 'root'
})
export class EstadisticaService {


    /** Base URL for invoice-related endpoints */
    private baseUrl: string = 'http://localhost:9090/api/estadistica';

    
    constructor(private http: HttpClient) {}


    /**
     * Get monthly KPIs
     * @returns Observable with the response containing monthly KPIs
     */
    public getKPIsMensuales(): Observable<RespuestaDto<KPIMensualDto[]>> {
        return this.http.get<RespuestaDto<KPIMensualDto[]>>(`${this.baseUrl}/indicadores-mensuales`);
    }


    /**
     * Get historical data for charts
     * @param tipo Tipo de datos a obtener (INGRESOS, GASTOS, UTILIDADES)
     * @returns Observable with the response containing historical data for charts
     */
    public getDatosGraficos(tipo: string): Observable<RespuestaDto<InfoGraficaHistoriaDto>> {

        const params = new HttpParams()
            .set('TipoIndicador', tipo);

        return this.http.get<RespuestaDto<InfoGraficaHistoriaDto>>(`${this.baseUrl}/historico-indicadores`, { params });
    }



    /**
     * Esta funcion consulta por los ingresos obtenidos en el ultimo año filtrados por tipo de datos
     * de configuracion de los productos
     * @param dato Dato a agrupar (institucion, horario, prenda, genero, talla)
     * @returns Observable with the response containing ingresos agrupados
     */
    public getIngresosAgrupados(dato: string): Observable<RespuestaDto<InfoGraficaHistoriaDto>> {
        return this.http.get<RespuestaDto<InfoGraficaHistoriaDto>>(`${this.baseUrl}/analisis-ventas-agrupadas?TipoDato=${dato}`);
    }




    /**
     * Obtener los kpis diarios
     * @param fecha Fecha de la que se quieren obtener los KPIs
     * @returns Observable with the response containing daily KPIs
     */
    public getKpisDiarios(fecha:string): Observable<RespuestaDto<KPIDiarioDto>> {

        const params = new HttpParams()
            .set('fecha', fecha);

        return this.http.get<RespuestaDto<KPIDiarioDto>>(`${this.baseUrl}/kpis-diarios?`, { params });
    
    }



    public getMovimientosDiarios(fecha:string): Observable<RespuestaDto<RegistroMovimientoDto[]>> {

        const params = new HttpParams()
            .set('fecha', fecha);

        return this.http.get<RespuestaDto<RegistroMovimientoDto[]>>(`${this.baseUrl}/registros-movimientos`, { params });

    }

}