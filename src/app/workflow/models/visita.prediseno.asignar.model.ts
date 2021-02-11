import { Equipocalendario } from 'src/app/administracion/equipodisponibilidad/models/equipocalendario.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { MantenimientoModule } from 'src/app/mejoramiento/mantenimiento/mantenimiento.module';
import { VisitaPredisenoApiqueModel } from './visita.prediseno.apique.model';

export class VisitaPredisenoAsignarModel {
  public id: number;
  public activo: boolean = true;
  public calendariosEquipo: any[] = [];
  public equipo: Equipo = new Equipo();
  public fechaAsignacion: string;
  public fechaMinima: string;
  public fechaMaxima: string;
  public mantenimientos: MantenimientoModule[] = [];
  public apliqueActual: VisitaPredisenoApiqueModel;
}

export class VisitaPredisenoEquipocalendarioModel {
  public id: number;
  public activo: boolean = true;
  public visitaPredisenoAsignar: VisitaPredisenoAsignarModel;
  public equipoCalendario: Equipocalendario;
}
