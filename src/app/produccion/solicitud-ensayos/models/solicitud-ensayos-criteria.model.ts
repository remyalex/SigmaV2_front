import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class SolicitudEnsayosCriteria {
  public pk: any;
  public fecha = '';
  public tipoEnsayoId: any = '';
  public fechaRegistroEnsayo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'fecha';
  public sortOrder = 'asc';
  public generico = false;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    // tslint:disable-next-line: max-line-length
    const tipoEnsayoId = this.tipoEnsayoId !== undefined && this.tipoEnsayoId != null && this.tipoEnsayoId !== '' ? this.tipoEnsayoId.id : '';

    return 'pk=' + this.pk +
      '&fecha=' + this.fecha +
      '&tipoEnsayoId=' + tipoEnsayoId +
      '&fechaRegistroEnsayo=' + this.fechaRegistroEnsayo +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}
