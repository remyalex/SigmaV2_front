import { Persona } from '../../persona/models/persona.model';
import { Lista } from '../../listas/models/lista.model';

export class PersonadisponibilidadCriteria {
  public persona: Persona; 
  public turno: Lista;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'personaId';
  
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters ():string {
      return  'personaId=' + (this.persona ? this.persona.id : '') +
              '&turnoId=' + (this.turno ? this.turno.id : '') +
              '&page=' + this.page +
              '&size=' + this.size +
              '&sortBy=' + this.sortBy +
              '&sortOrder=' + this.sortOrder;
  }

}
