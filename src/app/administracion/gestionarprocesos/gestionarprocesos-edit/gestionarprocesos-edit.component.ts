import { Component, OnInit, Inject } from '@angular/core';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de gestionar la edición de los procesos del sistema */
@Component({
  selector: 'app-gestionarprocesos-edit',
  templateUrl: './gestionarprocesos-edit.component.html'
})
export class GestionarprocesosEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone: any;
  /** Variable Mantenimiento encargada de tener referencia al mantenimiento seleccionado */
  mantenimiento: WorkflowMantenimientoModel;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param mantenimiento Mantenimiento seleccionado para gestion del pk por mantenimiento
   */
    constructor(
    @Inject (MAT_DIALOG_DATA) mantenimiento: WorkflowMantenimientoModel,
    private dialogRef: MatDialogRef<GestionarprocesosEditComponent>
  ) {
    this.mantenimiento = mantenimiento;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.mantenimiento = this.clone;
    this.dialogRef.close(0);
  }

}
