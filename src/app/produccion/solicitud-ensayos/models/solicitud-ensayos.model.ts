import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';

export class SolicitudEnsayos {
    public id: number;
    public fecha: string;
    public mantenimiento: WorkflowMantenimientoModel;
    public tipoEnsayo: ListaItem;
    public usuario: Usuario;
    public archivo: Archivo;
    public fechaRegistroEnsayo: string;
    public usuarioTramite: Usuario;
    public observaciones: string;
    public activo = true;
    public pk: string;
    public generico: Boolean;
    public descripcionTipoEnsayo: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}