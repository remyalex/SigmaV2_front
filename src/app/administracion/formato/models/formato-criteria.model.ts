import { ListaItem } from '../../listas-items/models/listas-items.model';

export class FormatoCriteria {
  public codigo: string = '';
  public tipoDocumento: ListaItem;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'codigo';

  public sortOrder: string = 'asc';

  public tipoDocCodigo: any;

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoDocCodigo = this.tipoDocumento ? this.tipoDocumento.id : '';

    return (
      'codigo=' +
      this.codigo +
      '&tipoDocumentoId=' +
      this.tipoDocCodigo +
      '&page=' +
      this.page +
      '&size=' +
      this.size +
      '&sortBy=' +
      this.sortBy +
      '&sortOrder=' +
      this.sortOrder
    );
  }
}
