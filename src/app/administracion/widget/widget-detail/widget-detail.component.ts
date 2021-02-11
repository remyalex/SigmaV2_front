import { Component, OnInit, Inject } from '@angular/core';
import { Widget } from '../models/widget.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ADMINISTRACION_WIDGET } from './../widget.constant';

/** Componente encargado de gestionar la visualización de un widget */
@Component({
  selector: 'sigma-administracion-widget-detail',
  templateUrl: './widget-detail.component.html'
})
export class WidgetDetailComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_WIDGET;
  /** Objeto usado para enviar al servicio de CRUD*/
  widget: Widget;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<WidgetDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Widget
  ) {
    this.widget = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
