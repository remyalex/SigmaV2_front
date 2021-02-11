import { WorkflowActividadModel } from './workflow-actividad.model';
import { UsuarioInfo } from './usuario-info.model';
import { WorkflowTransicionModel } from './workflow-transicion.model';
import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';

export class WorkflowMantenimientoActividadModel {
    public id: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public transicion: WorkflowTransicionModel;
    public actividad: WorkflowActividadModel;
    public usuarioAsignado: UsuarioInfo;
    public ejecutadoPor: UsuarioInfo;
    public observaciones: string;
}
