import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Tipomantenimiento } from '../models/tipomantenimiento.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipomantenimientoService } from '../services/tipomantenimiento.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOMANTENIMIENTO } from './../tipomantenimiento.constant';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de tipo mantenimiento */
@Component({
  selector: 'sigma-administracion-tipomantenimiento-edit',
  templateUrl: './tipomantenimiento-edit.component.html'
})
export class TipomantenimientoEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOMANTENIMIENTO;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipomantenimiento: Tipomantenimiento;
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
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: TipomantenimientoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipomantenimientoEditComponent>,
    private formBuilder: FormBuilder,
    private _utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Tipomantenimiento,
    private dialog: MatDialog,
    private dataGenericService:  DataGenericService
  ) {
    this.tipomantenimiento = data;

    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([Validators.required])],
        'claseMantenimiento': [null, Validators.compose([Validators.required])],
        'id': [null, Validators.compose([Validators.required])],
        'tipoEquipo': [null, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(600)])],
        'duracion': [null, Validators.compose([Validators.required, Validators.max(9999), Validators.pattern('[0-9]*')])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
        'procedimiento': [null, Validators.compose([Validators.required, Validators.maxLength(2000)])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.tipomantenimiento));
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
        for (let key in this.tipomantenimiento) {
          this.tipomantenimiento[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disableSubmit = true;
    this.servicio.update(this.tipomantenimiento).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipomantenimiento);
    }, error => {
      this.disableSubmit = false;
      this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
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
