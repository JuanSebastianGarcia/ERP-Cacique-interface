import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RespuestaDto } from "../models/respuesta-dto";
import { GastoDto } from "../models/gasto-dto";
import { TipoGastoDto } from "../models/tipo-gasto-dto";
import { EstadisticasDto } from "../models/estadisticas-gastos-dto";

/**
 * Servicio para la gestión de gastos del sistema
 * Proporciona operaciones CRUD para los gastos
 */
@Injectable({
    providedIn: 'root'
})
export class GastoService{


    /** URL base para los endpoints de gastos */
    private gastoUrl:string='http://localhost:9090/api/gasto';
    private tipoGastoUrl:string='http://localhost:9090/api/tipo-gasto';


    /**
     * @param http Cliente HTTP para peticiones al backend
     */
    constructor(private http:HttpClient){}

    /**
     * Crear un nuevo gasto
     * @param gasto Datos del gasto a crear
     * @returns Observable con respuesta del servidor
     */
    public crearGasto(gasto:GastoDto):Observable<RespuestaDto<string>>{
        return this.http.post<RespuestaDto<string>>(`${this.gastoUrl}`,gasto);
    }

    /**
     * Obtiene los gastos filtrados por fecha.
     * @param fecha Fecha para filtrar los gastos (formato YYYY-MM-DD)
     * @returns Observable con un array de gastos filtrados por la fecha proporcionada
     */
    public obtenerGastos(fecha: string): Observable<RespuestaDto<GastoDto[]>> {
        return this.http.get<RespuestaDto<GastoDto[]>>(`${this.gastoUrl}?fecha=${fecha}`);
    }

    /**
     * Obtiene los gastos filtrados por fecha y tipo de gasto.
     * @param fecha Fecha para filtrar los gastos (formato YYYY-MM-DD)
     * @param tipoGastoID ID del tipo de gasto para filtrar
     * @returns Observable con un array de gastos filtrados por fecha y tipo de gasto
     */
    public obtenerGastosByTipo(fecha: string, tipoGastoID: number): Observable<RespuestaDto<GastoDto[]>> {
        return this.http.get<RespuestaDto<GastoDto[]>>(`${this.gastoUrl}?tipoGastoId=${tipoGastoID}&fecha=${fecha}`);
    }

    /**
     * Eliminar un gasto por ID
     * @param id ID del gasto a eliminar
     * @returns Observable con respuesta del servidor
     */
    public eliminarGasto(id:number):Observable<RespuestaDto<string>>{
        return this.http.delete<RespuestaDto<string>>(`${this.gastoUrl}/${id}`);
    }

    /**
     * Editar un gasto existente
     * @param gasto Datos actualizados del gasto (debe incluir ID)
     * @returns Observable con respuesta del servidor
     */
    public editarGasto(gasto:GastoDto):Observable<RespuestaDto<string>>{
        return this.http.put<RespuestaDto<string>>(`${this.gastoUrl}/${gasto.id}`,gasto);
    }
    
    /**
     * Obtener todos los tipos de gasto disponibles
     * @returns Observable con array de tipos de gasto
     */
    public obtenerTiposGasto():Observable<RespuestaDto<TipoGastoDto[]>>{
        return this.http.get<RespuestaDto<TipoGastoDto[]>>(`${this.tipoGastoUrl}`);
    }

    /**
     * Crear un nuevo tipo de gasto
     * @param tipoGasto Datos del tipo de gasto a crear
     * @returns Observable con respuesta del servidor
     */
    public crearTipoGasto(tipoGasto: TipoGastoDto): Observable<RespuestaDto<string>> {
        return this.http.post<RespuestaDto<string>>(`${this.tipoGastoUrl}/${tipoGasto.nombreTipoGasto}`, tipoGasto);
    }

    /**
     * Actualizar un tipo de gasto existente
     * @param tipoGasto Datos actualizados del tipo de gasto
     * @returns Observable con respuesta del servidor
     */
    public actualizarTipoGasto(tipoGasto: TipoGastoDto): Observable<RespuestaDto<string>> {
        return this.http.put<RespuestaDto<string>>(`${this.tipoGastoUrl}/${tipoGasto.idTipoGasto}/${tipoGasto.nombreTipoGasto}`, tipoGasto);
    }

    /**
     * Eliminar un tipo de gasto por ID
     * @param id ID del tipo de gasto a eliminar
     * @returns Observable con respuesta del servidor
     */
    public eliminarTipoGasto(id: number): Observable<RespuestaDto<string>> {
        return this.http.delete<RespuestaDto<string>>(`${this.tipoGastoUrl}/${id}`);
    }

    /**
     * Obtiene las estadísticas de los gastos
     * @returns Observable con las estadísticas de los gastos
     */
    public obtenerEstadisticas():Observable<RespuestaDto<EstadisticasDto>>{
        return this.http.get<RespuestaDto<EstadisticasDto>>(`${this.gastoUrl}/statistics`);
    }

}
