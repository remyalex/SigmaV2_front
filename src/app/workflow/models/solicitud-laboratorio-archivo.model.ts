import { Archivo } from 'src/app/workflow/models/archivo.model';
//import { SolicitudLaboratorio } from './solicitud-laboratorio.model';
import { SolicitudLaboratorioInfo } from './solicitud-laboratorio-info.model';

export class SolicitudLaboratorioArchivo {
    public id: number;
    public activo: boolean = true;
    public fechaRegistro: string;
    public observaciones: string;
    public solicitudLaboratorio: SolicitudLaboratorioInfo;
    public archivo: Archivo;
    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}