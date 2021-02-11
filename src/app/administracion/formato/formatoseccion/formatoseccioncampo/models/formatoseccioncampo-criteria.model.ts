export class FormatoseccioncampoCriteria {
  public descripcion: string = '';
  public formatoSeccionId: string = '';
  public nombre: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'descripcion';

  public sortOrder: string = 'asc';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return (
      'descripcion=' +
      this.descripcion +
      '&formatoSeccionId=' +
      this.formatoSeccionId +
      '&nombre=' +
      this.nombre +
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
