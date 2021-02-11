export class UsuarioCriteria {
  public apellidos: string = '';
  public identificacion: string = '';
  public nombres: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'apellidos';

  public sortOrder: string = 'asc';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return (
      'apellidos=' +
      this.apellidos +
      '&identificacion=' +
      this.identificacion +
      '&nombres=' +
      this.nombres +
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
