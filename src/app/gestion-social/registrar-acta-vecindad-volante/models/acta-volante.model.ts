import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ActaVolanteResidenteModel } from './acta-volante-residente.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
// tslint:disable-next-line: max-line-length
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { ActaVolanteArchivoModel } from './acta-volante-archivo.model';

export class ActaVolanteModel {
    public id: number;
    public noVolante: string;
    public intervencionEncabezado: IntervencionInfo;
    public activo: boolean = true;
    public actaVolanteResidente: ActaVolanteResidenteModel;
    public actaVolanteArchivo: ActaVolanteArchivoModel;
    public mantenimiento: WorkflowMantenimientoModel;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
