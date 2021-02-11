import { Archivo } from 'src/app/workflow/models/archivo.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

export class RowResult {
    error: false;
    message: string;
    data: WorkflowMantenimientoModel;
}
