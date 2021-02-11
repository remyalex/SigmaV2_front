import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ActaAficheModel } from './acta-afiche.model';

export class ActaAficheArchivoModel {
    public id: number;
    public fechaRegistro: string;
    public activo: boolean = true;
    public archivo: Archivo;
    public actaAfiche: ActaAficheModel;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
