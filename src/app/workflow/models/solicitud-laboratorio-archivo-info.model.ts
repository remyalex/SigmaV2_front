import { Archivo } from 'src/app/workflow/models/archivo.model';

export class SolicitudLaboratorioArchivoInfo {
    public id: number;
    public activo: boolean = true;
    public fechaRegistro: string;
    public observaciones: string;
    public archivo: Archivo;
    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}