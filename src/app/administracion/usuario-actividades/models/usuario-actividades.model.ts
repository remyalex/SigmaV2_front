export class UsuarioActividades {
    public id: number;
    public activo: boolean = true;
    public eliminado: boolean;
    public pendientes: number;
    public usuarioId: number;
    public procesoNombre: string;
    public procesoUrl: string;
    public actividadNombre: string;
    public actividadUrl: string;
    constructor() {
    }
} 