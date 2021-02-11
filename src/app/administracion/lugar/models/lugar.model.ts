export class Lugar {

    public activo: boolean = true;
    public contactoCorreo: string;
    public contactoNombre: string;
    public contactoTelefono: string;
    public descripcion: string;
    public direccion: string;

    public fechaDesde: string;
    public fechaHasta: string;
    public fechaDesdeDate: string;
    public fechaHastaDate: string;
    public horaFin: string;
    public horaInicio: string;
    public horaFinTime: string;
    public horaInicioTime: string;
    public id: number;
    public nombre: string = '';

    public origenLugar: any;
    public tipoLugar: any;
    public estadoLugar: any;
    public disponibilidades: any;

    constructor() {

    }
}
