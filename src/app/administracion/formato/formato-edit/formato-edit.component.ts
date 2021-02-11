import {
  Component,
  OnInit,
  Inject,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
  MatDialog
} from '@angular/material';
import { Formato } from '../models/formato.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormatoService } from '../services/formato.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Clase encargada de la edición del componente */
@Component({
  selector: 'sigma-administracion-formato-edit',
  templateUrl: './formato-edit.component.html'
})
export class FormatoEditComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Bandera que permite saber si el formato que debe ser cargado se requiere*/
  requerido = true;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  * @param differs Elemento usado para mantener la información clonada
  */
  constructor(
    private servicio: FormatoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormatoEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Formato,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesServices: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.formato = data;

    this.form = this.formBuilder.group({
      activo: [null, Validators.compose([Validators.required])],
      codigo: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      id: [null, Validators.compose([Validators.required])],
      plantilla: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      tipoDocumentoId: [null, Validators.compose([Validators.required])],
      archivoId: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.formato));
    this.customerDiffer = this.differs.find(this.formato).create();
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
        for (let key in this.formato) {
          this.formato[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.formato).subscribe(
      data => {
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_formato);
        this.dialogRef.close(this.form.value);
        this.enviada = false;
        this.snackBar.open(this.constants.successEdit, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
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

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.formato);
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
            this.constants['path_administracion_formato_' + record.key],
            this.formato[record.key]
          )
          .then(data => {
            if (data) {
              this.formato[record.key.replace('Id', '') + 'Valor'] = data.valor;
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
   * Método encargado de actualizar el formato a las fechas del formulario actualizadas
   *
   * @param atributo Nombre del atributo que se va a actualizar
   * @param objeto Evento con el valor actualizado por el usuario
   * */
  setDataFormato(atributo: any, objeto: any) {
    this.disableSubmit = false;
    this.formato[atributo] = objeto;
  }

  /** Método que sobreescribe el valor requerido
   * @param boolean valor true o false
  */
  validateUploadFile(boolean) {
    this.requerido = boolean;
  }
}
