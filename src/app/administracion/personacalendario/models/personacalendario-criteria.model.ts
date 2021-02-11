export class PersonacalendarioCriteria {

  public disponibleId: string = '';
  public personaDisponibilidadId: string = '';
  public personaId: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'disponibleId';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return 'disponibleId=' + this.disponibleId +
      '&personaDisponibilidadId=' + this.personaDisponibilidadId +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}


export class PersonacalendarioCalendarsCriteria {

  public persona: number = null;
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

    return 'persona=' + this.persona +
      '&inicio=' + this.inicio +
      '&fin=' + this.fin +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
