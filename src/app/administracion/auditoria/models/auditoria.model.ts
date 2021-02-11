import { Usuario } from '../../usuario/models/usuario.model';

/** Clase usada para agrupar la información de auditoria en un objeto*/
export class Auditoria {

    public activo: boolean = true;
    public accion: string;
    public data: string;
    public fecha: string;
    public id: number;
    public objetoid: number;
    public tabla: string;
    public usuario: Usuario;

    constructor() {

    }
}
