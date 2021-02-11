export class TarjetaOperacionCriteria {

  public claseEquipoId: any = '';
  public movil: string = '';
  public numeroInterno: string = '';
  public placa: string = '';
  public placaInventario: string = '';
  public tipoEquipoId: any = '';
  public activo = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'id';

  public sortOrder: string = 'asc';
  public tipoId;
  public claseId;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoId = this.tipoEquipoId !== '' ? this.tipoEquipoId.id : '';
    this.claseId = this.claseEquipoId !== '' ? this.claseEquipoId.id : '';

    return 'activo=' + this.activo +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
