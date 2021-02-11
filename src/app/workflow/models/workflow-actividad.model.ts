import { Permiso } from 'src/app/administracion/permisos/models/permiso.model';
import { WorkflowTransicionModel } from './workflow-transicion.model';
import { ComponenteUI } from './componenteui.model';
import { WorkflowProcesoModel } from './workflow-proceso.model';

export class WorkflowActividadModel {
    id: number;
    nombre: string;
    descripcion: string;
    url: string;
    componenteUI: ComponenteUI;
    activo: boolean;
    duracion: string;
    permiso: Permiso;
    proceso: WorkflowProcesoModel;
    transiciones: WorkflowTransicionModel[];
}