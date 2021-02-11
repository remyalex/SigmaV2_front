import { ListaItem } from '../../administracion/listas-items/models/listas-items.model';

export class VisitaPredisenoAforoModel {
  public id: number;
  public activo = true;
  public fecha: Date;
  public cantidadAforos: number;
  public nomenclatura: string;
  public observacion: string;
  public prioritarios: number;
  public solicitud: ListaItem;
  public actividad: ListaItem;
  public apiques = false;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
