import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { EquipodisponibilidadService } from '../services/equipodisponibilidad.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de la disponibilidad de un equipo */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-equipodisponibilidad-delete',
  templateUrl: './equipodisponibilidad-delete.component.html'
})
export class EquipodisponibilidadDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /** Variable usada para gestionar el modelo de la disponibilidad del equipo */
  equipodisponibilidad: Equipodisponibilidad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param _utilitiesService Componente de utilidades de peticiones a servicios
   **/
  constructor(
    private dialogRef: MatDialogRef<EquipodisponibilidadDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipodisponibilidad,
    private servicio: EquipodisponibilidadService,
    private snackBar: MatSnackBar,
    private _utilitiesService: UtilitiesService
  ) {
    this.equipodisponibilidad = data;
    this.form = fb.group( { id: [this.equipodisponibilidad.id, Validators.required] }
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
    this.disableSubmit = true;
    this.servicio.delete(this.equipodisponibilidad.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
