import { VisitaVerificacionMantenimientoModel } from './visita.verificacionMantenimiento';
import { UsuarioInfo } from './usuario-info.model';

export class VisitaVerificacionModel {
  public id: number;
  public activo: number;
  public directorObra: UsuarioInfo;
  public visitaVerificacionMantenimientos: Array<VisitaVerificacionMantenimientoModel> = [];
  public saveAll: Boolean;
}
