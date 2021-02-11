import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { ActaVolanteModel } from './acta-volante.model';

export class ActaVolanteResidenteModel {
    public id: number;
    public activo: boolean = true;
    public direccion: string;
    public fechaRegistro: string;
    public propietario: string;
    public telefono: string;
    public volanteEntregado: boolean = true;
//    public volanteEntregado: string;
    public actaVolante: ActaVolanteModel;
    public actaVolanteId: number;
    public mantenimiento: WorkflowMantenimientoModel;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
