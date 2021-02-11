export class GestionarProcesosCriteria {

  public pkValor: string = '';
  public idMantenimiento: string = '';
  public actividadActual: Boolean = false;
  public civ: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'civ';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'pk=' + this.pkValor +
      '&idMantenimiento=' + this.idMantenimiento +
      '&civ=' + this.civ +
      '&actividadActual=' + this.actividadActual +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}