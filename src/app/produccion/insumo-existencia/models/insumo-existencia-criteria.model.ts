import { Insumo } from './../../../administracion/insumo/models/insumo.model';
import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';

export class InsumoExistenciaCriteria {

  public id: number;
  public fechaInicial: string;
  public fechaFinal: string;
  public inventarioInicial: number;
  public inventarioFinal: number;
  public cantidadEntrada: number;
  public cantidadSalida: number;
  public activo: boolean;
  public insumo: Insumo;
  public tipoMezcla: ListaItem;
  public unidadMedida: string;
  public contrato: any;

  public sortOrder = 'asc';
  public size = 10;
  public page = 0;
  public sortBy = 'id';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return (
      'fechaInicial=' + ( this.fechaInicial ? this.fechaInicial : '' ) +
      '&fechaFinal=' + ( this.fechaFinal ? this.fechaFinal : '' ) +
      // '&inventarioInicial=' +  ( this.inventarioInicial ? this.inventarioInicial : '' ) +
      // '&inventarioFinal=' + ( this.inventarioFinal != null ? this.inventarioFinal : '' ) +
      // '&cantidadEntrada=' + ( this.cantidadEntrada  != null ? this.cantidadEntrada : '' ) +
      // '&cantidadSalida=' + ( this.cantidadSalida  != null ? this.cantidadSalida : '' ) +
      '&insumoId=' + ( this.insumo  ? this.insumo.id : '' ) +
      '&insumoUnidadMedidadId=' + ( this.unidadMedida  ? this.unidadMedida : '' ) +
      '&tipoMezclaId=' + ( this.tipoMezcla  ? this.tipoMezcla.id : '' ) +
      '&contratoId=' + ( this.contrato  ? this.contrato.id : '' ) +
      '&page=' + (this.page) +
      '&size=' + (this.size) +
      '&sortBy=' + (this.sortBy) +
      '&sortOrder=' + (this.sortOrder)
    );
  }
}
