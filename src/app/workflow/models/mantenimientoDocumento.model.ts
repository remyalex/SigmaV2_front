import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';
import { Documento } from 'src/app/mejoramiento/disenio/models/documento.model';

export class MantenimientoDocumentoModel {
    id: number;
    fecha: string;
    documento: Documento;
    activo: boolean;
    mantenimiento: WorkflowMantenimientoModel;
}