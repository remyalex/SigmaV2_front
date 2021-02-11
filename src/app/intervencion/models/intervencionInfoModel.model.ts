import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { ActaVolanteModel } from 'src/app/gestion-social/registrar-acta-vecindad-volante/models/acta-volante.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';

export class IntervencionInfo {

    public id: number;
    public nroActa: string;
    public observaciones: string;
    public fechaVisita: string;
    public activo = true;
//    public mantenimiento: WorkflowMantenimientoModel;
//    public mantenimientoId: number;
    public tipoVia: ListaItem;
    public tipoEjecucion: ListaItem;
    public clase: ListaItem;
    public rutaTransporte: ListaItem;
    public persona: Persona;
    public usuario: Usuario;
    public tipoSuperficie: ListaItem;

    constructor() {}
}
