import { Personacalendario } from 'src/app/administracion/personacalendario/models/personacalendario.model';
import { WorkflowMantenimientoModel } from './workflow-mantenimiento.model';

export class SocialCalendarioPersona {
    public id: number;
    public activo: number;
    public personaCalendario: Personacalendario;
    public mantenimiento: WorkflowMantenimientoModel;
  }
