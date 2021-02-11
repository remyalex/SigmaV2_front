export class EquipoDisponibilidadCriteria {
  public equipoId = '';
  public equipoNumeroInterno = '';
  public page = 0;
  public size = 10;
  public sortBy = 'equipoId';
  public sortOrder = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'equipoId=' + this.equipoId +
      '&equipoNumeroInterno=' + this.equipoNumeroInterno +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
