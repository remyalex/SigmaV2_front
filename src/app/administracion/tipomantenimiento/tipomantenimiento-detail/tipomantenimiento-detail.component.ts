import { Component, OnInit, Inject } from '@angular/core';
import { Tipomantenimiento } from '../models/tipomantenimiento.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOMANTENIMIENTO } from './../tipomantenimiento.constant';

/** Componente encargado de gestionar la visualización de un tipo mantenimiento */
@Component({
  selector: 'sigma-administracion-tipomantenimiento-detail',
  templateUrl: './tipomantenimiento-detail.component.html'
})
export class TipomantenimientoDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOMANTENIMIENTO;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipomantenimiento: Tipomantenimiento;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<TipomantenimientoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Tipomantenimiento
  ) {
    this.tipomantenimiento = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
