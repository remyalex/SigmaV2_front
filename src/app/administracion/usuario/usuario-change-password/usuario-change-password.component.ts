import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Usuario } from '../models/usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

/** Componente encargado de gestionar el cambio de contraseña de un usuario */
@Component({
  selector: 'sigma-administracion-usuario-change-password',
  templateUrl: './usuario-change-password.component.html'
})
export class UsuarioChangePasswordComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
  /** Objeto usado para enviar al servicio de CRUD*/
  usuario: Usuario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite identificar si el formulario se encuentra siendo procesado */
  public loading: boolean = false;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: UsuarioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UsuarioChangePasswordComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
  ) {
    this.usuario = data;

    this.form = this.formBuilder.group({
      clave: [null, Validators.compose([Validators.required])],
      claveConfirmacion: [null, Validators.compose([Validators.required])],
    }, {
      validator: RegistrationValidator.validate.bind(this.form)
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.usuario.clave = '';
    this.usuario.claveConfirmacion = '';
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        this.usuario.clave = '';
        this.usuario.claveConfirmacion = '';
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.setPassword(this.usuario).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.usuario.clave = '';
        this.usuario.claveConfirmacion = '';
        this.enviada = false;
        this.snackBar.open(this.constants.successEdit, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
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

/** Clase encargada de validar campos del formulario */
export class RegistrationValidator {
  /** método encargado de validar campos del formulario
  * @param form objeto formulario que será validado
  */
  static validate(form: FormGroup) {
    let clave = form.controls.clave.value;
    let claveConfirmacion = form.controls.claveConfirmacion.value;

    if (claveConfirmacion != null) {
      if (claveConfirmacion.length <= 0) {
        return null;
      }
    }

    if (claveConfirmacion !== clave) {
      form.controls['claveConfirmacion'].setErrors({ 'passwordConfirm': true });
    }
    else {
      form.controls['claveConfirmacion'].setErrors(null);
    }

    return null;
  }
}