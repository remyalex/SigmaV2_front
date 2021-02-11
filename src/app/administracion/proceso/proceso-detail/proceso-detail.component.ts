import { Component, OnInit, Inject } from '@angular/core';
import { Proceso } from '../models/proceso.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';

/** Componente encargado de gestionar la visualización del proceso*/
@Component({
  selector: 'app-proceso-detail',
  templateUrl: './proceso-detail.component.html'
})
export class ProcesoDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
  /** Objeto usado para enviar al servicio de CRUD*/
  proceso: Proceso;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ProcesoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Proceso
  ) {
    this.proceso = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
