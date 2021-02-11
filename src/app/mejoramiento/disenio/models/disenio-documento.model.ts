import { Archivo } from 'src/app/workflow/models/archivo.model';


export class DisenioDocumento {

  public id: number;
  public fecha: String;
  public archivo: Archivo;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}