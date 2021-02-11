import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Equipocalendario } from '../models/equipocalendario.model';
import { EquipocalendarioService } from '../services/equipocalendario.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';

/** Componente encargado de gestionar la eliminación de calendarios de equipos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-equipocalendario-delete',
  templateUrl: './equipocalendario-delete.component.html'
})
export class EquipocalendarioDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
   /** Variable usada para gestionar el modelo del calendario del equipo */
  equipocalendario: Equipocalendario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
   * Método encargado de construir una instancia de la clase
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param data Información a procesar
   * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private dialogRef: MatDialogRef<EquipocalendarioDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Equipocalendario,
    private servicio: EquipocalendarioService,
    private snackBar: MatSnackBar
  ) {
    this.equipocalendario = data;
    this.form = fb.group( { id: [this.equipocalendario.id, Validators.required] }
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
    this.servicio.delete(this.equipocalendario.id).subscribe(
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
