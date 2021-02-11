import { Component, OnInit, Inject } from '@angular/core';
import { Mensaje } from '../models/mensaje.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_MENSAJE } from './../mensaje.constant';

/** Componente encargado de gestionar la visualización de un {}*/
@Component({
  selector: 'sigma-administracion-mensaje-detail',
  templateUrl: './mensaje-detail.component.html'
})
export class MensajeDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MENSAJE;
  /** Mensaje a presentar al usuario en caso de fallas */
  mensaje: Mensaje;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<MensajeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Mensaje
  ) {
    this.mensaje = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
