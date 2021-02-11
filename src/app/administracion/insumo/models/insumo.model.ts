import { ListaItem } from '../../listas-items/models/listas-items.model';

export class Insumo {

    public activo: boolean = true;
    public claseInsumo: ListaItem;
    public codigo: string;
    public descripcion: string;
    public id: number;
    public nombre: string;
    public unidadMedida: ListaItem;
    public contrato: Array<Contrato>;
    constructor() {}
}

export class Contrato {
    public id: number;
    public activo: boolean = true;
    public numeroContrato: string;
    public fechaInicio: string;
    public fechaFin: string;
}
