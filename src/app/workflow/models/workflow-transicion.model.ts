import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowActividadModel } from './workflow-actividad.model';
import { WorkflowCondicionModel } from './workflow-condicion.model';
import { TransicionEstadoDocumentoModel } from './transicionEstadoDocumento.model';


export class WorkflowTransicionModel {
    public id: number;
    public nombre: string;
    public estadoPk: ListaItem;
    public descripcion: string;
    public esMasiva: boolean;
    public esReasignable: boolean;
    public activo: boolean;
    public requiereObservacion: boolean;
    public tipoAsignacion: ListaItem;
    public actividadInicial: WorkflowActividadModel;
    public actividadFinal: WorkflowActividadModel;
    public condicion: WorkflowCondicionModel;
    public procesoGestion: string;
    public transicionEstadoDocumento: Array<TransicionEstadoDocumentoModel>;
}
