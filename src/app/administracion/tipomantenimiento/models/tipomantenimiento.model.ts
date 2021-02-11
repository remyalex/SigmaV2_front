import { ListaItem } from './../../listas-items/models/listas-items.model';
export class Tipomantenimiento {

    public activo: boolean = true;
    public claseMantenimiento: ListaItem;
    public descripcion: string;
    public duracion: number;
    public id: number;
    public nombre: string;
    public procedimiento: string;
    public tipoEquipo: ListaItem;

    // public tipoEquipoValor: any;
    // public claseMantenimientoValor: any;
    constructor() {

    }
}
