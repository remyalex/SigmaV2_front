export class Recurso {
    
    public activo: boolean= true;
    public equipoId: number;
    public equipocalendario: Array<any>;
    public fechaDesde: string;
    public fechaHasta: string;
    public id: number;
    public intervalo: string;
    public tipoAsignacionId: number;
    public tipoDisponibilidadId: number;
    public turnoId: number;

    constructor() {

    }
}
