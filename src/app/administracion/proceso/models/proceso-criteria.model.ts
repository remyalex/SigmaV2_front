export class ProcesoCriteria {

  public descripcion = '';
  public nombre = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';

  public sortOrder = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'descripcion=' + this.descripcion +
      '&nombre=' + this.nombre +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
