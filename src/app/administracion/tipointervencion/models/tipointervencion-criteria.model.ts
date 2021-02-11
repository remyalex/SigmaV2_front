import { ListaItem } from './../../listas-items/models/listas-items.model';
export class TipointervencionCriteria {

  public descripcion: string = '';
  public tipoSuperficie: ListaItem = null;
  public referenciaIntervencion: ListaItem = null;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'descripcion';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters (): string {

      return  'descripcion=' + this.descripcion +
              '&tipoSuperficieId=' + (this.tipoSuperficie != null ? this.tipoSuperficie.id : '') +
              '&referenciaIntervencionId=' + (this.referenciaIntervencion != null ? this.referenciaIntervencion.id : '') +
              '&page=' + this.page +
              '&size=' + this.size +
              '&sortBy=' + this.sortBy +
              '&sortOrder=' + this.sortOrder;
  }

}
