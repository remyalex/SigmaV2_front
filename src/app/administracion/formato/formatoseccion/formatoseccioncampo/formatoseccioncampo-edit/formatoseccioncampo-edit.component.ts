import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
import { FormatoService } from '../../../services/formato.service';
import { Formato } from '../../../models/formato.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-formatoseccioncampo-edit',
  templateUrl: './formatoseccioncampo-edit.component.html'
})
export class FormatoseccioncampoEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Objeto Seccion Campo usado para enviar al servicio de CRUD*/
  formatoseccioncampo: Formatoseccioncampo;
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
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  * @param differs Elemento usado para mantener la información clonada.
  */
  constructor(
    private servicio: FormatoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormatoseccioncampoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesServices: UtilitiesService
  ) {
    this.formato = data.formato;
    this.formatoseccioncampo = data.formatoseccioncampoToEdit;

    this.form = this.formBuilder.group({
      activo: [null, Validators.compose([Validators.required])],
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      listaId: [null],
      nombre: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      orden: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern('[0-9]*')
        ])
      ],
      tipoCampoFormatoId: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.formatoseccioncampo));
    this.customerDiffer = this.differs.find(this.formatoseccioncampo).create();
    this.form.get('tipoCampoFormatoId').valueChanges.subscribe(
      result => {
        if (this.form.get('tipoCampoFormatoId').value !== undefined) {
          if (this.form.get('tipoCampoFormatoId').value.valor === 'LISTA') {
            this.form.get('listaId').enable();
          } else {
            this.form.get('listaId').disable();
            this.formatoseccioncampo.lista = null;
          }
        }
      }
    );
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
      if (val == 1) {
        for (let key in this.formatoseccioncampo) {
          this.formatoseccioncampo[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.formato).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.enviada = false;
        this.snackBar.open(this.constants.successEdit, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.servicio.updateDataFormato(data);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
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
        duration: 5000,
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

  /** Método encargado de sobreescribir un atributo
   * @param atributo parametro que será reemplazado
   * @param objeto parametro que reemplaza
   */
  setDataCampo(atributo: any, objeto: any) {
    this.formatoseccioncampo[atributo] = objeto;
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.formatoseccioncampo);
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
            this.constants[
            'path_administracion_formatoseccioncampo_' + record.key
            ],
            this.formatoseccioncampo[record.key]
          )
          .then(data => {
            if (data) {
              this.formatoseccioncampo[record.key.replace('Id', '') + 'Valor'] =
                data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }

  /**
   * Método encargado de actualizar el formato de texto del formulario
   * @param data Nombre del atributo que se va a actualizar
   * */
  patternString(data) {
    let re = /[a-zA-z]/gi;
    let newstr = data.target.value.replace(re, "");
    this.formatoseccioncampo.orden = newstr.trim();
  }

}
