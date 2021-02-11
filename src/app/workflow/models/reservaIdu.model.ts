import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';
export class reservaIduModel {
    private id: number;
	private rechazado: number;
	private numeroRadicadoIdu : string;
	private activo : boolean;
    public tipoRadicado: ListaItem;
	private mantenimiento : WorkflowMantenimientoModel;
}