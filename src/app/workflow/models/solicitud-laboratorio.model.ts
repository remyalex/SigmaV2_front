import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { SolicitudLaboratorioArchivo } from './solicitud-laboratorio-archivo.model';
import { SolicitudLaboratorioArchivoInfo } from './solicitud-laboratorio-archivo-info.model';

export class SolicitudLaboratorio {
    public id: number;
    public fecha: string;
    public mantenimiento: WorkflowMantenimientoModel;
    public tipoResultado: ListaItem;
    public usuario: Usuario;
    public archivo: Archivo;
    public fechaRegistroResultado: string;
    public usuarioTramite: Usuario;
    public observaciones: string;
    public espesorDisenio: number;
	public tipoMaterial: ListaItem;
	public tipoMezcla: ListaItem;
    public frecuencia: ListaItem;
    public activo: boolean = true;
    public solicitudLaboratorioArchivos: SolicitudLaboratorioArchivo[];
    //public solicitudLaboratorioArchivos: SolicitudLaboratorioArchivoInfo[];
    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}