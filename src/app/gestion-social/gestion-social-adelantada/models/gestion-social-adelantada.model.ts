import { WorkflowMantenimientoModel } from './../../../workflow/models/workflow-mantenimiento.model';

export class GestionSocialAdelantadaModel {
    public id: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public fechaRegistro: string;
    public accionesAdelantadas: string;
    public cantidadActasVecindad = 0;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
