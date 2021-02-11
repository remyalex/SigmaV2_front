import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proceso } from '../../../models/proceso.model';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';
import { ProcesoService } from '../../../services/proceso.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { TransicionModel } from '../../../models/transicion.model';
import { CONST_ADMINISTRACION_DOCUMENTO } from '../documentos.constant';

/** Componente encargado de gestionar la edición de un documento de transición*/
@Component({
  selector: 'app-documentos-update',
  templateUrl: './documentos-update.component.html'
})
export class DocumentosUpdateComponent implements OnInit {

  formDocumentos: FormGroup;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_DOCUMENTO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo para proceso */
  proceso: Proceso;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo para  trsansición */
  transicion: TransicionModel;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo de documentos */
  transicionEstadoDocumento: Documento;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder,
    private servicio: ProcesoService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DocumentosUpdateComponent>,
    private utilitiesServices: UtilitiesService,
    private dialog: MatDialog
  ) {
    this.proceso = data.proceso,
    this.transicion = data.transicion,
    this.transicionEstadoDocumento = data.documentoToEdit;
    this.formDocumentos = this.formBuilder.group({
      tipoDocumento: [null, Validators.compose([Validators.required])],
      estadoDocumentoInicial: [null, Validators.compose([Validators.required])],
      estadoDocumentoFinal: [null, Validators.compose([Validators.required])],
      activo: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.proceso));
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      procesoDataToSend => {
        this.servicio.sendNewDataSelection(procesoDataToSend);
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(this.formDocumentos.value);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.formDocumentos, this.snackBar);
      }
    );
  }

  /** Método encargado de adicionar una condicion a la transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.formDocumentos);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.formDocumentos.valid === true) {
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
    // tslint:disable-next-line: forin
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
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
        this.servicio.sendNewDataSelection(this.clone);
        this.dialogRef.close();
       }
    });
  }
}
