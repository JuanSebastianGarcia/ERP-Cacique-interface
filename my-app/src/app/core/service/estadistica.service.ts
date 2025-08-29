import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { KPIMensualDto } from "../models/kpi-mensual-dto";
import { RespuestaDto } from "../models/respuesta-dto";
import { Observable } from "rxjs";

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
}