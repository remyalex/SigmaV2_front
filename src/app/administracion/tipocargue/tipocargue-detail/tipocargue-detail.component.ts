import { Component, OnInit, Inject } from '@angular/core';
import { Tipocargue } from '../models/tipocargue.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOCARGUE } from './../tipocargue.constant';

/** Componente encargado de gestionar la visualización de un tipo cargue */
@Component({
  selector: 'sigma-administracion-tipocargue-detail',
  templateUrl: './tipocargue-detail.component.html'
})
export class TipocargueDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUE;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargue: Tipocargue;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TipocargueDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Tipocargue
  ) {
    this.tipocargue = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
