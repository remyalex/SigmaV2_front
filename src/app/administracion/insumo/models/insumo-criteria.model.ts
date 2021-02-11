export class InsumoCriteria {

  public claseInsumoId: any = '';
  public codigo: string = '';
  public nombre: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'codigo';

  public sortOrder: string = 'asc';
  public insumoId;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.insumoId = this.claseInsumoId !== '' ? this.claseInsumoId.id : '';

    return 'claseInsumoId=' + this.insumoId +
      '&codigo=' + this.codigo +
      '&nombre=' + this.nombre +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
