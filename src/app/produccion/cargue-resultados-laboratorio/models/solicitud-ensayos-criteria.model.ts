export class SolicitudEnsayosCriteria {
  public pk: number;
  public fecha: string = '';
  public tipoEnsayoId: any = '';
  public fechaRegistroEnsayo: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fecha';
  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    // tslint:disable-next-line: max-line-length
    const tipoEnsayoId = this.tipoEnsayoId != undefined && this.tipoEnsayoId != null && this.tipoEnsayoId != "" ? this.tipoEnsayoId.id : '';

    return "pk=" + this.pk +
      "&fecha=" + this.fecha +
      "&tipoEnsayoId=" + tipoEnsayoId +
      "&fechaRegistroEnsayo=" + this.fechaRegistroEnsayo +
      "&page=" + (this.page) +
      "&size=" + this.size +
      "&sortBy=" + this.sortBy +
      "&sortOrder=" + this.sortOrder;
  }
/*    
    return "pk=" + this.pk +
      "&fecha=" + this.fecha +
      "&page=" + (this.page) +
      "&size=" + this.size +
      "&sortBy=" + this.sortBy +
      "&sortOrder=" + this.sortOrder;
  }
  */
}