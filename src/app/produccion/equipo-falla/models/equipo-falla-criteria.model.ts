export class EquipoFallaCriteria {

  public claseEquipoId: any = '';
  public origenEquipoId: any = '';
  public origenId: any = '';
  public marcaEquipoId: any = '';
  public estadoEquipoId: any = '';
  public lugarEquipoId: any = '';
  public movil = '';
  public numeroInterno: any = '';
  public placa = '';
  public placaInventario: any = '';
  public tipoEquipoId: any = '';
  public activo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'numeroInterno';
  public esMaquinariaProduccion = false;

  public sortOrder = 'asc';
  public tipoId;
  public claseId;
  public marcaId;
  public estadoId;
  public lugarId;
  public numeroInternoString;
  public placaInventarioString;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoId = this.tipoEquipoId !== undefined ? this.tipoEquipoId !== '' ? this.tipoEquipoId.id : '' : '';
    this.claseId = this.claseEquipoId !== undefined ? this.claseEquipoId !== '' ? this.claseEquipoId.id : '' : '';
    this.marcaId = this.marcaEquipoId !== undefined ? this.marcaEquipoId !== '' ? this.marcaEquipoId.id : '' : '';
    this.estadoId = this.estadoEquipoId !== undefined ? this.estadoEquipoId !== '' ? this.estadoEquipoId.id : '' : '';
    this.lugarId = this.lugarEquipoId !== undefined ? this.lugarEquipoId !== '' ? this.lugarEquipoId.id : '' : '';
    this.numeroInternoString = this.numeroInterno !== undefined ? this.numeroInterno !== '' ? this.numeroInterno.numeroInterno : '' : '';
    // tslint:disable-next-line: max-line-length
    this.placaInventarioString = this.placaInventario !== undefined ? this.placaInventario !== '' ? this.placaInventario.placaInventario : '' : '';
    this.origenId = this.origenEquipoId !== undefined ? this.origenEquipoId !== '' ? this.origenEquipoId.id : '' : '';

    return 'claseEquipoId=' + this.claseId +
      '&movil=' + this.movil +
      '&numeroInterno=' + this.numeroInternoString +
      '&placa=' + this.placa +
      '&placaInventario=' + this.placaInventarioString +
      '&origenEquipoId=' + this.origenId +
      '&tipoEquipoId=' + this.tipoId +
      '&marcaEquipoId=' + this.marcaId +
      '&estadoEquipoId=' + this.estadoId +
      '&lugarEquipoId=' + this.lugarId +
      '&esMaquinariaProduccion=' + this.esMaquinariaProduccion +
      '&activo=' + this.activo +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
