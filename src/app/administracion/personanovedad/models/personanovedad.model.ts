import { ListaItem } from '../../listas-items/models/listas-items.model';

export class Personanovedad {

    public activo: boolean = true;
    public fechaDesde: string;
    public fechaHasta: string;
    public fechaDesdeDate: string;
    public fechaHastaDate: string;

    public id: number;
    public observaciones: string;
    public personaId: number;
    public tipoNovedadPersona: ListaItem;

    constructor() {

    }
}
