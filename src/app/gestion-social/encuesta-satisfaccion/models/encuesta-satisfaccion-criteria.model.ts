import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class EncuestaSatisfaccionCriteria {
  public pk: number;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fecha';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return "pk=" + this.pk +
      "&page=" + (this.page) +
      "&size=" + this.size +
      "&sortBy=" + this.sortBy +
      "&sortOrder=" + this.sortOrder;
  }
}