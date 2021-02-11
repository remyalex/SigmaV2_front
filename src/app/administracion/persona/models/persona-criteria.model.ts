export class PersonaCriteria {

  public identificacion: string = '';
  public nombres: string = '';
  public usuario: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'identificacion';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'identificacion=' + this.identificacion +
      '&nombres=' + this.nombres +
      '&usuario=' + this.usuario +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
