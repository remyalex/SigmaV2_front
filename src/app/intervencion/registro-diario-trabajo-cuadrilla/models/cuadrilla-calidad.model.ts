import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';

export class CuadrillaCalidadModel {

    id: number;
    numeroMuestras: number;
    activo: boolean;
    resultado: string;
    tipoMaterial: ListaItem;
    tipoEnsayo: ListaItem;

    constructor() {
    }
}
