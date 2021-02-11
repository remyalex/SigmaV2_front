export class EquipocalendarioCriteria {
  public equipoDisponibilidadId: string = '';
  public equipoId: number = null;
  public fecha: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'equipoDisponibilidadId';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'equipoDisponibilidadId=' + this.equipoDisponibilidadId +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}

export class EquipocalendarioCalendarsCriteria {
  public equipo: number = null;
  public inicio: string = '';
  public fin: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'inicio';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'equipo=' + this.equipo +
      '&inicio=' + this.inicio +
      '&fin=' + this.fin +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
