import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { GrupoMantenimientoModel } from './grupo-mantenimiento.model';

export class GrupoModel {

    public id: Number;
    public nombre: String = '';
    public descripcion: String = '';
    public fecha: Date;
    public calzadas: Number;
    public kilometroCarril: Number;
    public origenSeleccion: ListaItem;
    public estadoSeleccion: ListaItem;
    public activo: Boolean;
    public mantenimientos: WorkflowMantenimientoModel[];
    //public grupoMantenimientos: GrupoMantenimientoModel[];

    constructor () {}
}
