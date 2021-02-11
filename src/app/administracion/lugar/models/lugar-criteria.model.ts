import { ListaItem } from '../../listas-items/models/listas-items.model';

export class LugarCriteria {
  public tipoLugar: ListaItem;
  public origenLugar: ListaItem;
  public nombre = '';
  public page = 0;
  public size = 10;
  public sortBy = 'descripcion';

  public sortOrder = 'asc';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    const tipoLugarId = this.tipoLugar ? this.tipoLugar.id : '';
    const origenLugarId = this.origenLugar ? this.origenLugar.id : '';
    return (
      'tipoLugarId=' + tipoLugarId +
      '&origenLugarId=' + origenLugarId +
      '&nombre=' +  this.nombre +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder
    );
  }
}
