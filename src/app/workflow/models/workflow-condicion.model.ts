import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowActividadModel } from './workflow-actividad.model';
import { WorkflowTerminoModel } from './workflow-termino.model';

export class WorkflowCondicionModel {
    public id: number;
    public nombre: string;
    public descripcion: string;
    public terminos: WorkflowTerminoModel[];

}
