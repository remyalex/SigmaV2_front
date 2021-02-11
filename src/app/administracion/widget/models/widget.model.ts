import { Permiso } from '../../permisos/models/permiso.model';

export class Widget {
    
    public activo: boolean= true;
    public descripcion: string;
    public id: number;
    public permiso: Permiso;
    public titulo: string;
    public url: string;
    public urlVerMas: string;

    constructor() {

    }
}
