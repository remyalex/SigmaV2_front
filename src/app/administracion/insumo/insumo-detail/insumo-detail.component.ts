import { Component, OnInit, Inject } from '@angular/core';
import { Insumo } from '../models/insumo.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';

/** Componente encargado de gestionar la visualización de un insumo*/
@Component({
  selector: 'sigma-administracion-insumo-detail',
  templateUrl: './insumo-detail.component.html'
})
export class InsumoDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  insumo: Insumo;
  /** Variable temporal encargada de mantener el valor de la clase del insumo */
  claseInsumoValor: any;
  /** Variable temporal encargada de mantener el valor de la unidad de medida del insumo */
  unidadMedidaValor: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<InsumoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Insumo
  ) {
    this.insumo = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
