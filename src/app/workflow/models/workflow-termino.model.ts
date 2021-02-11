import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowActividadModel } from './workflow-actividad.model';

export class WorkflowTerminoModel {
    public id: number;
    public operadorLogico: string;
    public atributo: string;
    public operador: string;
    public valor: string;
}
