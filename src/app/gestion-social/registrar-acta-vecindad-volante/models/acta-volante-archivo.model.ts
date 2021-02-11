import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ActaVolanteModel } from './acta-volante.model';

export class ActaVolanteArchivoModel {
    public id: number;
    public fechaRegistro: string;
    public activo: boolean = true;
    public archivo: Archivo;
    public actaVolante: ActaVolanteModel;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
