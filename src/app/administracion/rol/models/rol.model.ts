import { Permiso } from '../../permisos/models/permiso.model';

export class Rol {
    public activo: boolean = true;
    public descripcion: string;
    public eliminado: boolean = false;
    public id: number;
    public nombre: string;
    public permisos: Permiso[];
    public usuarioRequiereAsignarZona: boolean;
    constructor() {}
}
