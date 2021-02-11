import { Component, OnInit, Inject } from '@angular/core';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';

/** Componente encargado de gestionar la visualización de un tipoCargueEstructura */
@Component({
  selector: 'sigma-administracion-tipocargueestructura-detail',
  templateUrl: './tipocargueestructura-detail.component.html'
})
export class TipocargueestructuraDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargueestructura: Tipocargueestructura;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TipocargueestructuraDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Tipocargueestructura
  ) {
    this.tipocargueestructura = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
