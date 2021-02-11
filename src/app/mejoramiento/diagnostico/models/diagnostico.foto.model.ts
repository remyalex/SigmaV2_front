import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Archivo } from 'src/app/workflow/models/archivo.model';

export class DiagnosticoFotoModel {
    public activo = true;
    public archivo: Archivo = new Archivo();
    public fechaRegistro: string;
    public id: number;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
