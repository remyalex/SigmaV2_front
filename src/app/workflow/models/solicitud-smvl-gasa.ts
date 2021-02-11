import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
export class SolicitudSmvlGasa {
    public id: number;
    public activo = true;
    public numeroRadicadoSmvl: string;
    public fechaSolicitudSmvl: string;
    public observaciones: string;
    //public listaChequeo: ListaItem = new ListaItem();
    public listaChequeo: ListaItem;
    public consecutivo: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public eliminado: string;
}
