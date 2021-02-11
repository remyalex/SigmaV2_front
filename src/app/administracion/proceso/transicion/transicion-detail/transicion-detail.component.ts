import { Component, OnInit, Inject } from '@angular/core';
import { TransicionModel } from '../../models/transicion.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';

/** Componente encargado de gestionar la visualización de una transición */
@Component({
  selector: 'sigma-administracion-procesotransicion-detail',
  templateUrl: './transicion-detail.component.html'
})
export class TransicionDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;
  /** Objeto usado para enviar al servicio de CRUD*/
  transicion: TransicionModel;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TransicionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: TransicionModel
  ) {
    this.transicion = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
