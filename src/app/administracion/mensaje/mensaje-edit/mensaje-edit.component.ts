import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Mensaje } from '../models/mensaje.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MensajeService } from '../services/mensaje.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_MENSAJE } from './../mensaje.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un mensaje */
@Component({
  selector: 'sigma-administracion-mensaje-edit',
  templateUrl: './mensaje-edit.component.html'
})
export class MensajeEditComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MENSAJE;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Mensaje a presentar al usuario en caso de fallas */
  mensaje: Mensaje;
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
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada
  */
  constructor(
    private servicio: MensajeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MensajeEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Mensaje,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private dataGenericService:  DataGenericService
  ) {
    this.mensaje = data;

    this.form = this.formBuilder.group(
      {

        'activo': [null, Validators.compose([Validators.required])],
        'destinatarioId': [null, Validators.compose([Validators.required])],
        'fechaRegistro': [null, Validators.compose([Validators.required])],
        'id': [null, Validators.compose([Validators.required])],
        'leido': [null, Validators.compose([Validators.required])],
        'mensaje': [null, Validators.compose([Validators.required])],
        'origen': [null, Validators.compose([Validators.required])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.mensaje));
    this.customerDiffer = this.differs.find(this.mensaje).create();
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
        for (let key in this.mensaje) {
          this.mensaje[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.mensaje).subscribe(data => {
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_mensaje);
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
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

  /** Método encargado de reemplazar la variable destinatarioId
   * @param _id variable numerica usada para sustitución
   */
  setDestinatarioMensaje(_id: number) {
    this.mensaje.destinatarioId = _id;
  }


  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.mensaje);
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
          this.constants['path_administracion_mensaje_' + record.key], this.mensaje[record.key])
          .then(data => {
            if (data) {
              this.mensaje[record.key.replace('Id', '') + 'Valor'] = data.valor;
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
