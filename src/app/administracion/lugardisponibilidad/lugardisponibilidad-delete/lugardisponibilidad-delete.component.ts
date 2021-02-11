import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { LugardisponibilidadService } from '../services/lugardisponibilidad.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';

/** Clase encargada de la eliminación del componente */
@Component({
  selector: 'sigma-administracion-lugardisponibilidad-delete',
  templateUrl: './lugardisponibilidad-delete.component.html'
})
export class LugardisponibilidadDeleteComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Objeto usado para enviar al servicio de CRUD*/
  lugardisponibilidad: Lugardisponibilidad;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private dialogRef: MatDialogRef<LugardisponibilidadDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Lugardisponibilidad,
    private servicio: LugardisponibilidadService,
    private snackBar: MatSnackBar
  ) {
    this.lugardisponibilidad = data;
    this.form = fb.group({ id: [this.lugardisponibilidad.id, Validators.required] }
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
    this.servicio.delete(this.lugardisponibilidad.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(
          this.constants.deleteError, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        }
        );
      }
    );
  }

}
