import { Intervencion } from '../../../../../intervencion/models/intervencionModel.model';
import { WorkflowMantenimientoModel } from '../../../../models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class ElementoAmbientalModel {


    id: number;
    cantidadArboles: number;
    observacionesArboles: string;
    elementoArboles: string;
    cantidadSumideros: number;
    observacionesSumideros: string;
    elementoSumideros: string;
    cantidadSumiderosPluvial: number;
    observacionesSumiderosPluv: string;
    elementoSumiderosPluvial: string;
    cantidadPompeyano: number;
    observacionesPompeyano: string;
    elementoPompeyano: string;
    cantidadPlazas: number;
    observacionesPlazas: string;
    elementoPlazas: string;
    cantidadEspacioPublico: number;
    observacionesEspacioP: string;
    elementoEspacioP: string;
    cantidadBanos: number;
    observacionesBanos: string;
    mantenimiento: WorkflowMantenimientoModel;
    intervencionEncabezado: Intervencion;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
