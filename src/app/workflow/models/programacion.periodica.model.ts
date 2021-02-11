import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { PeriodicidadModel } from 'src/app/intervencion/models/periodicidad.model';
import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';

export class ProgramacionperiodicaModel {
 public id: number;
 public vigencia: ListaItem;
 public nroDiasLaborables: number;
 public observaciones: string;
 public periodicidad: PeriodicidadModel;
 public tipoIntervencion: ListaItem;
 public periodo: PeriodicidadModel;

 public kmCarrilImpacto: number;
 public kmCarrilLineal: number;
 public kmCarrilObra: number;
 public duracionPlaneada: number;
 public fechaInicialIntervencion: string;

 public activo: boolean;
 public archivo: ArchivoModel;
 public mantenimiento: WorkflowMantenimientoModel;
 public intervencionEncabezado: IntervencionEncabezado;
 public mantenimientos: WorkflowMantenimientoModel[] = [];
}
