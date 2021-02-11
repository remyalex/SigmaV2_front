import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO } from '../historial-mantenimiento.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/**
 * Componente encargado de gestionar el historial
 * del detalle del mantenimiento
 **/
@Component({
  selector: 'app-historial-detalle',
  templateUrl: './historial-detalle.component.html'
})
export class HistorialDetalleComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<HistorialDetalleComponent>,
  ) {
    this.mantenimiento = data;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() { }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

}
