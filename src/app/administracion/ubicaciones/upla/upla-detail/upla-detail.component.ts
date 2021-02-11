import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_UPZ} from '../models/upla.constants';
import { Upla } from '../models/upla.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de una upla*/
@Component({
  selector: 'app-upla-detail',
  templateUrl: './upla-detail.component.html'
})
export class UplaDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_UPZ;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  upla: Upla;

   /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<UplaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Upla
  ) {
    this.upla = data;
   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

}
