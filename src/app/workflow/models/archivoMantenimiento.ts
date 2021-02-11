import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

export class ArchivoMantenimientoModel {
    public activo: boolean = true;
    public archivo: ArchivoModel = new ArchivoModel();
    public fechaRegistro: string;
    public id: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public observaciones: string;

    constructor() { }
}