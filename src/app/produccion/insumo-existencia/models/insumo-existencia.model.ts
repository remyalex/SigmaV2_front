import { ListaItem } from './../../../administracion/listas-items/models/listas-items.model';
import { Insumo, Contrato } from './../../../administracion/insumo/models/insumo.model';
import { ContentChildDecorator } from '@angular/core';

export class InsumoExistencia {

  public id: number;
  public fechaInicial: string;
  public fechaFinal: string;
  public inventarioInicial: number;
  public cantidadEntrada: number;
  public cantidadSalida: number;
  public inventarioFinal: number;
  public insumo: Insumo;
  public contrato: Contrato;
  public activo: boolean;
  public tipoMezcla: ListaItem;

  constructor() {
    this.insumo = new Insumo ();
  }

}
