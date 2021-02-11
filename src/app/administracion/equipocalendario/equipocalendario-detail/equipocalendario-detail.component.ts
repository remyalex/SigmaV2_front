import { Component, OnInit, Inject } from '@angular/core';
import { Equipocalendario } from '../models/equipocalendario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';

/** Componente encargado de gestionar la visualización del detalle
 * de los calendarios de equipos
 **/
@Component({
  selector: 'sigma-administracion-equipocalendario-detail',
  templateUrl: './equipocalendario-detail.component.html'
})
export class EquipocalendarioDetailComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Variable usada para gestionar el modelo del calendario del equipo */
  equipocalendario: Equipocalendario;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  */
  constructor(
    private dialogRef: MatDialogRef<EquipocalendarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Equipocalendario
  ) {
    this.equipocalendario = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
