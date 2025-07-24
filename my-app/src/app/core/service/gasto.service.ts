import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RespuestaDto } from "../models/respuesta-dto";
import { GastoDto } from "../models/gasto-dto";

@Injectable({
    providedIn: 'root'
})
export class GastoService{

    private gastoUrl:string='http://localhost:9090/api/gasto';


    constructor(private http:HttpClient){}



    public crearGasto(gasto:GastoDto):Observable<RespuestaDto<string>>{
        return this.http.post<RespuestaDto<string>>(`${this.gastoUrl}`,gasto);
    }



}
