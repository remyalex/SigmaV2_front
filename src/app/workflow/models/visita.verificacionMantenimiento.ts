import { VisitaVerificacionModel } from './visita.verificacion';
import { MantenimientoModule } from 'src/app/mejoramiento/mantenimiento/mantenimiento.module';
import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';

export class VisitaVerificacionMantenimientoModel {
  public id: number;
  public activo: boolean;
  public consecutivo: number;
  public mantenimiento: WorkflowMantenimientoModel;
  public visitaVerifiacion: VisitaVerificacionModel;
}
