import { Lista } from '../../listas/models/lista.model';
import { Lugar } from '../../lugar/models/lugar.model';

export class LugardisponibilidadCriteria {

  public turno: Lista;
  public lugarNombre = '';
  public tipoAsignacion: Lista;

  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'lugarId';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return 'turnoId=' + (this.turno ? this.turno.id : '') +
      '&lugarNombre=' + this.lugarNombre +
      '&tipoAsignacionId=' + (this.tipoAsignacion ? this.tipoAsignacion.id : '') +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
