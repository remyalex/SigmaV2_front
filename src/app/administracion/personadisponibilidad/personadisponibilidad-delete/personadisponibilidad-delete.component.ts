import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { PersonadisponibilidadService } from '../services/personadisponibilidad.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la eliminación de persona disponibilidad */
@Component({
  selector: 'sigma-administracion-personadisponibilidad-delete',
  templateUrl: './personadisponibilidad-delete.component.html'
})
export class PersonadisponibilidadDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  personadisponibilidad: Personadisponibilidad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<PersonadisponibilidadDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Personadisponibilidad,
    private servicio: PersonadisponibilidadService,
    private utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar
  ) {
    this.personadisponibilidad = data;
    this.form = fb.group({ id: [this.personadisponibilidad.id, Validators.required] }
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
    this.servicio.delete(this.personadisponibilidad.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
