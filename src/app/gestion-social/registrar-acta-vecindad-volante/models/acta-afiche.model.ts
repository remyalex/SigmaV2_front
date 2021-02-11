import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { ActaAficheArchivoModel } from './acta-afiche-archivo.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';

export class ActaAficheModel {
    public id: number;
    public noAfiche: string;
    public nombreEstablecimiento: string;
    public direccion: string;
    public telefono: number;
    public personaContacto: string;
    public cantidad: number;
    public descripcion: string;
    public observaciones: string;
    public activo: boolean = true;
    public intervencionEncabezado: IntervencionInfo;
    public tipoPiezaDivulgar: ListaItem;
    public fechaRegistro: string;
    public archivo: Archivo;
    public actaAficheArchivo: ActaAficheArchivoModel;
    public mantenimiento: WorkflowMantenimientoModel;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
