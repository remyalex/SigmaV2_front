import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Personacalendario } from '../models/personacalendario.model';
import { PersonacalendarioService } from '../services/personacalendario.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';

/** Componente encargado de gestionar la eliminación de persona calendario */
@Component({
  selector: 'sigma-administracion-personacalendario-delete',
  templateUrl: './personacalendario-delete.component.html'
})
export class PersonacalendarioDeleteComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  personacalendario: Personacalendario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<PersonacalendarioDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Personacalendario,
    private servicio: PersonacalendarioService,
    private snackBar: MatSnackBar
  ) {
    this.personacalendario = data;
    this.form = fb.group({ id: [this.personacalendario.id, Validators.required] }
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
    this.servicio.delete(this.personacalendario.id).subscribe(
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
