export class EquipoCriteria {
  
  public claseEquipoId: any = '';
  public movil: string = '';
  public numeroInterno: string = '';
  public placa: string = '';
  public placaInventario: string = '';
  public equipoTipoId: any = '';
  public activo = true;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'numeroInterno';
  public sortOrder: string = 'asc';
  public tipoId;
  public claseId;
  public estadoId;
  public fechaHasta: any = '';
  public estadoEquipoId: any = '';
  public origenEquipoId: any = '';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.estadoId = this.estadoEquipoId !== '' && this.estadoEquipoId !== null && 
    this.estadoEquipoId !== undefined ? this.estadoEquipoId.id : '';
    this.fechaHasta = this.fechaHasta === null || this.fechaHasta === '' ? '' : this.fechaHasta;

    return 'eliminado=' + '' +
      '&activo=' + this.activo +
      '&fecha=' + this.fechaHasta +
      '&estadoEquipoId=' + this.estadoId +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}