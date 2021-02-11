import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { IntervencionEncabezado } from '../visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';

export class IntervencionFoto {

    public id: number;
    public activo = true;
    public fechaRegistro: string;
    public observaciones: string;
    public archivo: Archivo;
    public intervencionEncabezado: IntervencionEncabezado;
    public tipoArchivo: ListaItem;
    public numeroFoto: number;

    constructor() {}
}
