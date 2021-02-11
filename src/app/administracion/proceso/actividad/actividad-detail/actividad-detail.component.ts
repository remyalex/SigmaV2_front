import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActividadModel } from '../../models/actividad.model';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';

/** Componente encargado de gestionar la visualización de la actividad */
@Component({
  selector: 'sigma-administracion-procesoactividad-detail',
  templateUrl: './actividad-detail.component.html'
})
export class ActividadDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  procesoactividad: ActividadModel;


  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ActividadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: ActividadModel
  ) {
    this.procesoactividad = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
