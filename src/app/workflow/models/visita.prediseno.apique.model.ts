import { ListaItem } from './../../administracion/listas-items/models/listas-items.model';

export class VisitaPredisenoApiqueModel {
  public id: number;
  public activo = true;
  public fecha: Date;
  public cantidadApiques: number;
  public nomenclatura: string;
  public observacion: string;
  public prioritarios: number;
  public solicitud: ListaItem;
  public actividad: ListaItem;
  public aforos = false;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
