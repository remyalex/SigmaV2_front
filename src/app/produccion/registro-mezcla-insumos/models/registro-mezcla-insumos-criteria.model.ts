import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class RegistroMezclaInsumoCriteria {
  public pk: number;
  public fecha: string = '';
  public tipoEnsayoId: any = '';
  public fechaRegistroEnsayo: string = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public fechaDesde: string = '';
  public fechaHasta: string = '';
  public turno: any = '';
  public tipoMaterial: any = '';
  public turnoId;
  public tipoMaterialId;
  public fechaTempDesde: string = '';
  public fechaTempHasta: string = '';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  public getUrlParameters(): string {

    this.turnoId = this.turno !== '' && this.turno !== undefined && this.turno !== null ? this.turno.id : '';
    this.tipoMaterialId = this.tipoMaterial !== '' && this.tipoMaterial !== undefined && this.tipoMaterial !== null  ? this.tipoMaterial.id : '';
    this.fechaTempDesde = this.fechaDesde === null || this.fechaDesde === '' ? '' : this.fechaDesde;
    this.fechaTempHasta = this.fechaHasta === null || this.fechaHasta === '' ? '' : this.fechaHasta;

      return '&turnoId=' + this.turnoId +
      '&tipoMaterialId=' + this.tipoMaterialId +
      '&fechaDesde=' + this.fechaTempDesde +
      '&fechaHasta=' + this.fechaTempHasta +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

  public getUrlParameters_detalles(): string {
    this.turnoId = this.turno !== '' && this.turno !== undefined && this.turno !== null ? this.turno.id : '';
    this.tipoMaterialId = this.tipoMaterialId !== '' && this.tipoMaterialId !== undefined && this.tipoMaterialId !== null  ? this.tipoMaterialId : '';
    this.fechaTempDesde = this.fechaDesde === null || this.fechaDesde === '' ? '' : this.fechaDesde;
    this.fechaTempHasta = this.fechaHasta === null || this.fechaHasta === '' ? '' : this.fechaHasta;

    return '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}
