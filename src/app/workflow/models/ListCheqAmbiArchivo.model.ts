import { ListaChequeoAmbiental } from './listaChequeoAmbiental.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

export class ListCheqAmbiArchivo {

    public id: number;
    public fecha: string;
    public activo: boolean= true;
    public archivo: ArchivoModel = new ArchivoModel();

    constructor() {

    }
}
