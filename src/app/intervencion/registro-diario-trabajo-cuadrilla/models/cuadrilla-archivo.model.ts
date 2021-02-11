import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Archivo } from '../../../workflow/models/archivo.model';


export class CuadrillaArchivoModel {

    id: number;
    activo: boolean;
    fechaRegistro: string;
    observaciones: string;
    archivo: Archivo;
    tipoArchivo: ListaItem;

    constructor() {
    }
}
