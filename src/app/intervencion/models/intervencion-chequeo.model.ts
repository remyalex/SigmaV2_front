import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { IntervencionEncabezado } from '../visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';

export class IntervencionChequeoModel {

    public id: number;
    public activo = true;
    public fechaRegistro: string;
    public observaciones: string;
    public fotos: Archivo[];
    public intervencionEncabezado: IntervencionEncabezado;
    public listaChequeo: ListaItem;
    public createdAt: string;

    constructor() {}
}
