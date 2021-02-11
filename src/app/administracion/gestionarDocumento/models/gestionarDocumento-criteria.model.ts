import { ListaItem } from '../../listas-items/models/listas-items.model';

export class GestionarDocumentoCriteria {

  public id: string = '';
  public tipoDocumento: ListaItem;
  public autor: string = '';
  public fechaInicio: string = '';
  public fechaInicioTemp: Date;
  public fechaFin: string = '';
  public fechaFinTemp: Date;
  public nombre: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fecha';
  public sortOrder: string = 'desc';

  public tipoDocCodigo: any;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoDocCodigo = this.tipoDocumento ? this.tipoDocumento.id : '';

    return 'id=' + this.id +
      '&tipoDocumentoId=' + this.tipoDocCodigo +
      '&autor=' + this.autor +
      '&fechaInicio=' + this.fechaInicio +
      '&fechaFin=' + this.fechaFin +
      '&nombre=' + this.nombre +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
