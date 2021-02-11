import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { CuadrillaRetiroArchivoModel } from './cuadrilla-retiro-archivo.model';

export class CuadrillaRetiroModel {

    id: number;
    volumen: number;
    activo: boolean;
    destino: ListaItem;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    retiroArchivos: CuadrillaRetiroArchivoModel[];

    constructor() {
    }
}
