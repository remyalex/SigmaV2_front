export class TipocargueCriteria {

  public nombre: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'nombre';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'nombre=' + this.nombre +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
