import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class ActasCriteria {
  public pk: number;
  public aprobado: boolean;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fecha';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    const aprobado = this.aprobado != null ? this.aprobado : '';

    return "pk=" + this.pk +
      "&aprobado=" + aprobado +
      "&page=" + (this.page) +
      "&size=" + this.size +
      "&sortBy=" + this.sortBy +
      "&sortOrder=" + this.sortOrder;
  }
}