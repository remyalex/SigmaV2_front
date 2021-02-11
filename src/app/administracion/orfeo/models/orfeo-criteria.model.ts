export class OrfeoCriteria {
  public fecha: string = '';
  public numeroRadicado: string = '' ;
  public identificacionSolicitante: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fechaRadicado';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor
  */
  public getUrlParameters (): string {
      return  'fechaRadicado=' + ( this.fecha !== undefined && this.fecha !== null  ? this.fecha : '' ) +
              '&numeroRadicado=' + ( this.numeroRadicado !== undefined ? this.numeroRadicado : '' ) +
              '&numeroIdentificacion=' + this.identificacionSolicitante +
              '&page=' + this.page +
              '&size=' + this.size +
              '&sortBy=' + this.sortBy +
              '&sortOrder=' + this.sortOrder;
  }

}
