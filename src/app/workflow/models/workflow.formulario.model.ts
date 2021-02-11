import { Type } from '@angular/core';
import { FormComponent } from '../interfaces/workflow-forms.interface';
import { WorkflowMantenimientoActividadModel } from './workflow-mantenimiento-actividad.model';

export class WorkflowFormulario {

  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public component: Type<FormComponent>, public data: WorkflowMantenimientoActividadModel) {}
}
