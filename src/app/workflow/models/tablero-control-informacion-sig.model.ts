import { MantenimientoModule } from 'src/app/mejoramiento/mantenimiento/mantenimiento.module';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class TableroControlSIGModel {

  public id: number;
  public activo = true;
  public calendariosEquipo: any[] = [];
  public calendariosPersona: any[] = [];
  public fecha: string;
  public mantenimientos: MantenimientoModule[] = [];
  public estadoVisita: ListaItem;

}
