import { ListaItem } from '../../listas-items/models/listas-items.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';


export class GestionarDocumento {
    
    public activo: boolean= true;
    public tipoDocumento: ListaItem;
    public estadoDocumento: ListaItem;
    public numero: number;
    public descripcion: string;
    public id: number;
    public fecha: string;
    public autor: string;
    public archivo: ArchivoModel = new ArchivoModel();

    constructor() {

    }
}
