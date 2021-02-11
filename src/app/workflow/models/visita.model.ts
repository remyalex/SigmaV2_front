import { Equipocalendario } from 'src/app/administracion/equipodisponibilidad/models/equipocalendario.model';
import { Personacalendario } from 'src/app/administracion/personacalendario/models/personacalendario.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { MantenimientoModule } from 'src/app/mejoramiento/mantenimiento/mantenimiento.module';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class VisitaModel {

  public id: number;
  public activo: boolean = true;
  public calendariosEquipo: any[] = [];
  public calendariosPersona: any[] = [];
  public equipo: Equipo = new Equipo();
  public fecha: string;
  public mantenimientos: MantenimientoModule[] = [];
  public responsable: Persona = new Persona();
  public rutaMapa: string;
  public estadoVisita: ListaItem;
  public origen: ListaItem;
}

export class VisitaPersonacalendarioModel {

  public id: number;
  public activo: boolean = true;
  public visita: VisitaModel;
  public personaCalendario: Personacalendario;

}

export class VisitaEquipocalendarioModel {

  public id: number;
  public activo: boolean = true;
  public visita: VisitaModel;
  public equipoCalendario: Equipocalendario;

}