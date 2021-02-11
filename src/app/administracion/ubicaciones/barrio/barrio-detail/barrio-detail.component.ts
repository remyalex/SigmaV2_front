import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_BARRIO} from '../models/barrio.constants';
import { Barrio } from '../models/barrio.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de un barrio*/
@Component({
  selector: 'app-barrio-detail',
  templateUrl: './barrio-detail.component.html'
})
export class BarrioDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_BARRIO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  barrio: Barrio;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<BarrioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Barrio
  ) {
    this.barrio = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

}
