import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { Recurso } from '../models/recurso.model';

/** Componente encargado de gestionar la visualización del recurso */
@Component({
  selector: 'sigma-administracion-recurso-detail',
  templateUrl: './recurso-detail.component.html'
})
export class RecursoDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;
  /** Objeto usado para enviar al servicio de CRUD*/
  recurso: Recurso;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<RecursoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Recurso
  ) {
    this.recurso = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
