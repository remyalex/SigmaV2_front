import { Component, OnInit, Inject } from '@angular/core';
import { SigmaConfirmComponent } from '../../sigma-confirm/sigma-confirm.component';
import { MatDialogConfig, MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { CONST_DOCUMENTOS_COMPONENTE } from '../sigma-actividad-documentos.constant';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { DocService } from '../services/sigma-actividad-documentos.services';

/** Componente encargado de gestionar la edición de un documento de actividad*/
@Component({
  selector: 'app-sigma-actividad-documentos-edit',
  templateUrl: './sigma-actividad-documentos-edit.component.html'
})
export class SigmaActividadDocumentosEditComponent implements OnInit {

  formDocumentos: FormGroup;
 /** Constantes a usar en el componente */
  constants = CONST_DOCUMENTOS_COMPONENTE;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  documento: Documento;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Bandera que permite saber si el formulario es requerido */
  requerido = true;

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
    private servicio: DocService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SigmaActividadDocumentosEditComponent>,
    private utilitiesServices: UtilitiesService,
    private dialog: MatDialog
  ) {
    this.documento = data.documento,
    this.documento.mantenimientoId = data.mantenimientoId;
    this.formDocumentos = this.formBuilder.group({
      tipoDocumento: [null, Validators.compose([Validators.required])],
      archivoId: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.documento).subscribe(
      data => {
        this.servicio.updateDocList(data);
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close();
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.formDocumentos, this.snackBar);
      }
    );
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
      if (val == 1) {
        this.dialogRef.close();
      }
    });
  }

   /**
   * Método encargado de actualizar el valor del documento
   * en el modelo del negocio
   *
   * @param atributo nombre del atributo a modificar
   * @param objeto valor con el cual se desea asignar el atributo
   */
  setDataDoc(atributo: any, objeto: any) {
    this.documento[atributo] = objeto;
  }

  /**
   * Método encargado de validar el tipo de dato del archivo a cargar
   *
   * @param boolean indica si el valor es requerido
   */
  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

}

