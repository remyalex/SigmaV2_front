import { Component, OnInit, Inject } from '@angular/core';
import {CONST_ADMINISTRACION_CUADRANTE} from '../models/cuadrante.constants';
import { Cuadrante } from '../models/cuadrante.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { CuadranteService } from '../services/cuadrante.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

/** Componente encargado de gestionar la edición de un cuadrante*/
@Component({
  selector: 'app-cuadrante-edit',
  templateUrl: './cuadrante-edit.component.html'
})
export class CuadranteEditComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_CUADRANTE;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  cuadrante: Cuadrante;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
   /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit: boolean;
  /** Clon del objeto que se va a modificar información */
  clone: Cuadrante;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: Cuadrante,
    formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CuadranteEditComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private servicio: CuadranteService,
    private utilitiesService: UtilitiesService
  ) {
    this.cuadrante = data;
    this.form = formBuilder.group({
      'id': [null, Validators.compose([Validators.required])],
      'nombre': [null, Validators.compose([Validators.required])],
      'valor': [null, Validators.compose([Validators.required])],
      'activo': [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.cuadrante));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        for (const key in this.cuadrante) {
          this.cuadrante[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.form);
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.servicio.update(this.cuadrante).subscribe(data => {
        this.dialogRef.close();
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      });
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
