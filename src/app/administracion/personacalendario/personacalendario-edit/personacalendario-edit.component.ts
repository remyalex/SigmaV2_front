import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Personacalendario } from '../models/personacalendario.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PersonacalendarioService } from '../services/personacalendario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la edición de persona calendario */
@Component({
  selector: 'sigma-administracion-personacalendario-edit',
  templateUrl: './personacalendario-edit.component.html'
})
export class PersonacalendarioEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  personacalendario: Personacalendario;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: PersonacalendarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonacalendarioEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Personacalendario,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
  ) {
    this.personacalendario = data;
    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],

        'disponibleId': [null, Validators.compose([Validators.required])],
        'fechaFin': [null, Validators.compose([Validators.required])],
        'fechaInicio': [null, Validators.compose([Validators.required])],
        'personaDisponibilidadId': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.personacalendario));
    this.customerDiffer = this.differs.find(this.personacalendario).create();

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
        for (let key in this.personacalendario) {
          this.personacalendario[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.personacalendario).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      if (error.status == 400) {
        if (error.error.length > 0) {
          this.form.controls[error.error[0].field].setErrors({
            incorrect: true
          });

          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open(this.constants.error500, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      }
      if (error.status == 500 || error.status == 0) {
        this.snackBar.open(this.constants.error500, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    });
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

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.personacalendario);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicio.searchByList(
          this.constants['path_administracion_personacalendario_' + record.key], this.personacalendario[record.key])
          .then(data => {
            if (data) {
              this.personacalendario[record.key.replace(/Id$/, '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }
}
