export class MaquinariaCriteria {

  public claseEquipo: any;
  public placaInventario: string = '';
  public tipoEquipo: any;
  public marcaEquipo: any;
  public lugar: any;
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'id';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    const tipoEquipoId = this.tipoEquipo !== undefined ? this.tipoEquipo !== '' ? this.tipoEquipo.id : '' : '';
    const marcaEquipoId = this.marcaEquipo !== undefined ? this.marcaEquipo !== '' ? this.marcaEquipo.id : '' : '';
    const claseEquipoId = this.claseEquipo !== undefined ? this.claseEquipo !== '' ? this.claseEquipo.id : '' : '';
    const lugarId = this.lugar !== undefined ? this.lugar !== '' ? this.lugar.id : '' : '';

    return 'claseEquipoId=' + claseEquipoId +
      '&placaInventario=' + this.placaInventario +
      '&tipoEquipoId=' + tipoEquipoId +
      '&marcaEquipoId=' + marcaEquipoId +
      '&lugarId=' + lugarId +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
