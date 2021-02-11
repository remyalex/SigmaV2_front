import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Tipofalla } from '../models/tipofalla.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipofallaService } from '../services/tipofalla.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOFALLA } from './../tipofalla.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un tipo de falla*/
@Component({
  selector: 'sigma-administracion-tipofalla-edit',
  templateUrl: './tipofalla-edit.component.html'
})
export class TipofallaEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOFALLA;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  tipofalla: Tipofalla;
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
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param differs Elemento usado para mantener la información clonada.
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: TipofallaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipofallaEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipofalla,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.tipofalla = data;

    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([ Validators.required ])],
        'activo': [null, Validators.compose([ Validators.required ])],
        'descripcion': [null, Validators.compose([ Validators.required ])],
        'tipoSuperficieId': [null, Validators.compose([ Validators.required ])],
        'valor': [null, Validators.compose([ Validators.max(Number.MAX_SAFE_INTEGER) ])]
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.tipofalla));
    this.customerDiffer = this.differs.find(this.tipofalla).create();
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(vali => {
      if (vali == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.tipofalla) {
          this.tipofalla[key] =  this.clone[key];
        }
        this.dialogRef.close();
      }

    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.tipofalla).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipofalla);
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
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
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /**
   * Método encargado de asignar al modelo el valor modificado en el formulario
   *
   * @param _id Identificador único del valor a asignar en el modelo
   **/
  setTipoSuperficieTipofalla (_id: number) {
    this.tipofalla.tipoSuperficie.id = _id;
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.tipofalla);
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

        this.servicio
          .searchByList(
            this.constants['path_administracion_tipofalla_' + record.key],
            this.tipofalla[record.key]
          )
          .then(data => {
            if (data) {
              this.tipofalla[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }
}
