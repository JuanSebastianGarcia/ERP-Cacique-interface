export interface InfoGraficaHistoriaDto{

    graficaDiaria:GraficaDiariaDto[];
    graficaMensual:GraficaMensualDto[];
    graficaAnual:GraficaAnualDto[];

}

interface GraficaDiariaDto{
    fecha:string;
    valor:number;
}

interface GraficaMensualDto{
    mes:string;
    valor:number;
}

interface GraficaAnualDto{
    anio:string;
    valor:number;
}
