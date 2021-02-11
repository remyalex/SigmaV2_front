export class PlanillaOperacionCriteria {

  public claseEquipoId: any = '';
  public movil: string = '';
  public placaInventario: string = '';
  public tipoEquipoId: any = '';
  public activo = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'numeroTarjeta';
  public sortOrder: string = 'asc';
  public tipoId;
  public claseId;
  public fecha: Date;
  public estadodId: number;
  public operadorId: number;
  public tipoVehiculoId: number;
  public placa: string = '';
  public numeroInterno: string  = '';
  public tipoTarjetaId: any = '';
  public numeroTarjeta: number;
  public fechaOperacion: string = '';
  public variableControl: string = '';
  public lecturaInicial: string = '';
  public lecturaFinal: string = '';
  public kmsInicial: string = '';
  public kmsFinal: string = '';
  public horaInicial: string = '';
  public horaFinal: string = '';
  public estadoMaquinariaId: number;
  public totalHoras: string = '';
  public fechaHasta: string;
  public actividades: any;
  public numeroTipoTarjeta;
  public select = false;

  /** M�todo encargado de crear uns instancia vac�a del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoId = this.tipoEquipoId !== '' ? this.tipoEquipoId.id : '';
    this.claseId = this.claseEquipoId !== '' ? this.claseEquipoId.id : '';
    this.numeroTipoTarjeta = this.tipoTarjetaId !== '' ? this.tipoTarjetaId.id : '';


    return 'activo=' + this.activo +
      '&eliminado=' + this.fechaHasta +
      '&tipoTarjetaId=' + this.numeroTipoTarjeta +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
