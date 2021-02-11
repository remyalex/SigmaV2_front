import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { Recurso } from '../models/recurso.model';
import { RecursoService } from '../services/recurso.service';

/** Componente encargado de gestionar la edición de un recurso */
@Component({
  selector: 'sigma-administracion-recurso-edit',
  templateUrl: './recurso-edit.component.html'
})
export class RecursoEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  recurso: Recurso;
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
  */
  constructor(
    private servicio: RecursoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RecursoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Recurso,
    private dialog: MatDialog,
    private differs: KeyValueDiffers
  ) {
    this.recurso = data;

    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null, Validators.compose([Validators.required])],

        'equipoId': [null, Validators.compose([Validators.required])],
        'fechaDesde': [null, Validators.compose([Validators.required])],
        'fechaHasta': [null, Validators.compose([Validators.required])],
        'intervalo': [null, Validators.compose([Validators.required])],
        'tipoAsignacionId': [null, Validators.compose([Validators.required])],
        'tipoDisponibilidadId': [null, Validators.compose([Validators.required])],
        'turnoId': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.recurso));
    this.customerDiffer = this.differs.find(this.recurso).create();
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
        for (let key in this.recurso) {
          this.recurso[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.recurso).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      if (error.status == 400) {
        this.form.controls[error.error[0].field].setErrors({ 'incorrect': true });
        this.snackBar.open(error.error[0].message, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
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

  /** Método para reemplazar valor equipoId por _id del objeto recurso 
    * @param _id variable tipo numerico
    */
  setEquipoRecurso(_id: number) {
    this.recurso.equipoId = _id;
  }

  /** Método para reemplazar valor tipoAsignacionId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTipoAsignacionRecurso(_id: number) {
    this.recurso.tipoAsignacionId = _id;
  }

  /** Método para reemplazar valor tipoDisponibilidadId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTipoDisponibilidadRecurso(_id: number) {
    this.recurso.tipoDisponibilidadId = _id;
  }

  /** Método para reemplazar valor turnoId por _id del objeto recurso 
  * @param _id variable tipo numerico
  */
  setTurnoRecurso(_id: number) {
    this.recurso.turnoId = _id;
  }


  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.recurso);
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
          this.constants['path_administracion_recurso_' + record.key], this.recurso[record.key])
          .then(data => {
            if (data) {
              this.recurso[record.key.replace('Id', '') + 'Valor'] = data.valor;
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
