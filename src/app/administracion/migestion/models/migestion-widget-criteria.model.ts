export class MiGestionWidgetCriteria {

  public page = 0;
  public size = 3;
  public sortBy = 'fechaAsignacion';
  public sortOrder = 'desc';
  public responsableId: string;
  public tieneActividadActual = true;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    const responsableId = this.responsableId ? this.responsableId : '';

    return 'responsableId=' + responsableId +
      '&tieneActividadActual=' + this.tieneActividadActual +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
