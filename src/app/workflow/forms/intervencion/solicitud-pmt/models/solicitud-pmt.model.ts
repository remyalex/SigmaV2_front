import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { SolicitudPmtArchivo } from './solicitud-pmt-archivo.model';

export class SolicitudPMT {
    id: number;
    fechaRadicadoMovilidad: string;
    numeroRadicadoPmt: number;
    numeroRadicadoMovilidad: number;
    fechaInicio: string;
    fechaFin: string;
    horaInicioTrabajo: string;
    horaFinalTrabajo: string;
    horaInicioCierre: string;
    horaFinalCierre: string;
    coi: number;
    observaciones: string;
    eliminado: string;
    intervencionEncabezado: Intervencion;
    tipoCierre: ListaItem;
    tipoPmt: ListaItem;
    estadoPmt: ListaItem;
    mantenimientos: WorkflowMantenimientoModel[];
    solicitudArchivos: SolicitudPmtArchivo[];

    constructor() {}
}
