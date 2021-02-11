import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';

export class CargueResultadosLaboratorio {
    public id: number;
    public fecha: string;
    public mantenimiento: WorkflowMantenimientoModel;
    public tipoEnsayo: ListaItem;
    public usuario: Usuario;
    public archivo: ArchivoModel;
    public fechaEnsayo: string;
    public usuarioTramite: Usuario;
    public observaciones: string;
    public activo: boolean = true;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
