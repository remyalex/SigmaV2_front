import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';

export class GrupoMantenimientoModel {

    public id: Number;
    public activo: Boolean;
    public observaciones: string;
    public mantenimiento: WorkflowMantenimientoModel;
    public estadoRegistroActivo: ListaItem;

    constructor () {}
}
