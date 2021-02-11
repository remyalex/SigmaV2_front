import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListaChequeoAmbiental } from './listaChequeoAmbiental.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

export class ListaChequeoSstArchivo {

    public id: number;
    public fechaRegistro: string;
    public activo: boolean= true;
    public archivo: ArchivoModel;
	public tipoArchivo: ListaItem;

    constructor() {

    }
}
