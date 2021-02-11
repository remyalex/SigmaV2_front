import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class FormulaCriteria {
  public tipoMezcla: ListaItem;
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'desc';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    const tipoMezclaId = this.tipoMezcla ? this.tipoMezcla.id : '';
    return (
      'tipoMezclaId=' + tipoMezclaId +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder
    );
  }
}
