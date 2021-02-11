import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class RadicadoVinculadoModel {


    id: number;
    numeroRadicado: string;
    rechazado: number;
    fechaRadicadoOrfeo: string;
    mantenimiento: WorkflowMantenimientoModel;
    tipoRadicado: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
