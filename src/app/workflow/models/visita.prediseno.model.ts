import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';

export class VisitaPredisenoModel {
    public id: number;
    public activo = true;
    public consultaRedes: boolean;
    public fecha: string;
    public levantamientoTopografico: boolean;
    public modulacionLosas: boolean;
    public observacionIntervencion: string;
    public observacionSolicitud: string;
    public requiereApique: boolean;
    public requiereAforo: boolean;
    public solicitudAdicional: boolean;
    public viableIntervencion: boolean;
    public mantenimiento: WorkflowMantenimientoModel;
    public fichaEvaluacion: boolean;
    public informacionDiseno: boolean;
    constructor() {}
}
