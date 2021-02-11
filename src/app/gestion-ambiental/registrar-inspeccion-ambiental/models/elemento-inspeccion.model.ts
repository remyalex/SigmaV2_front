import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Intervencion } from '../../../intervencion/models/intervencionModel.model';
import { ElementoInsArchivo } from './elemento-inspeccion-archivo.model';
import { ElementoInspeccionDetalleModel } from './elemento-inspeccion-detalle.model';


export class ElementoInspeccionModel {
    public id: number;
    public activo: boolean;
    public eliminado: string;
    public protCantidad: number;
    public protArbolescantidad: number;
    public protSumiderosCantidad: number;
    public protEspaciosCantidad: number;
    public protBaniosCantidad: number;
    public fecha: String;
    public accion: String;
    public observaciones: String;
    public intervencion: Intervencion;
    public estado: ListaItem;
    public situacion: ListaItem;
    public elemento: ListaItem;
    public tipoElementoAmbiental: ListaItem;
    public mantenimientos: WorkflowMantenimientoModel[];
    public inspAmbientalArchivos:  ElementoInsArchivo[];
    public detalleInspeccion:  ElementoInspeccionDetalleModel[];

    constructor() {}
}
