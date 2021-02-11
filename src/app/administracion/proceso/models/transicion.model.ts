import { ListaItem } from '../../listas-items/models/listas-items.model';
import { ActividadModel } from './actividad.model';
import { Documento } from '../transicion/documentos/models/documento.model';

export class TransicionModel {

    public activo = true;
    public descripcion = '';
    public id: number;
    public nombre = '';
    public estadoPk: any;
    public permiso: ListaItem;
    public actividadInicial: ActividadModel;
    public actividadFinal: ActividadModel;
    public requiereObservacion = false;
    public esMasiva: Boolean;
    public esReasignable: Boolean;
    public tipoAsignacion: ListaItem;
    public estadoMantenimiento: any;
    public transicionEstadoDocumento: Array<Documento>;
    public condicion: any;
    public condiciones: any;

    constructor() {

    }
}