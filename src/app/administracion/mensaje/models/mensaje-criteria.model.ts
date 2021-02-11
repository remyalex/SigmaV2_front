export class MensajeCriteria {

  public fechaInicio: string = '';
  public fechaInicioTemp: Date;
  public fechaFin: string = '';
  public fechaFinTemp: Date;
  public leido: string = '';
  public mensaje: string = '';
  public destinatarioId: string;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fechaRegistro';
  public sortOrder: string = 'desc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return 'fechaInicio=' + this.fechaInicio +
      '&fechaFin=' + this.fechaFin +      
      '&leido=' + this.leido +
      '&mensaje=' + this.mensaje +
      '&destinatarioId=' + this.destinatarioId +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}