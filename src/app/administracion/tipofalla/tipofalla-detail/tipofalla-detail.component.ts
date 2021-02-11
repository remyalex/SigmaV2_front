import { Component, OnInit, Inject } from '@angular/core';
import { Tipofalla } from '../models/tipofalla.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOFALLA } from './../tipofalla.constant';

/** Componente encargado de gestionar la visualización de un tipo de falla*/
@Component({
  selector: 'sigma-administracion-tipofalla-detail',
  templateUrl: './tipofalla-detail.component.html'
})
export class TipofallaDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOFALLA;
   /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
   tipofalla: Tipofalla;


 /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TipofallaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Tipofalla
  ) {
    this.tipofalla = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
