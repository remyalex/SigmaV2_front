import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Widget } from '../models/widget.model';
import { WidgetService } from '../services/widget.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_WIDGET } from './../widget.constant';

/** Componente encargado de gestionar la eliminación de un widget */
@Component({
  selector: 'sigma-administracion-widget-delete',
  templateUrl: './widget-delete.component.html'
})
export class WidgetDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_WIDGET;
  /** Objeto usado para enviar al servicio de CRUD*/
  widget: Widget;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón guardar */
  disabledButton = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<WidgetDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Widget,
    private servicio: WidgetService,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService
  ) {
    this.widget = data;
    this.form = fb.group({ id: [this.widget.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disabledButton = true;
    this.servicio.delete(this.widget.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabledButton = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
