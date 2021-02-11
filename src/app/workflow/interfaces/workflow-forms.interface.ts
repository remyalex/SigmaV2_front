import { FormGroup } from '@angular/forms';
import { WorkflowMantenimientoActividadModel } from '../models/workflow-mantenimiento-actividad.model';

export interface FormComponent {
  data: WorkflowMantenimientoActividadModel;
  forms: FormGroup [];
  accion: string;

}
