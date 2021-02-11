import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

export class GestionarProcesosModel {

    public id: Number;
    public nombre: String = '';
    public descripcion: String = '';
    public mantenimientos: WorkflowMantenimientoModel[];

    constructor () {}
}
