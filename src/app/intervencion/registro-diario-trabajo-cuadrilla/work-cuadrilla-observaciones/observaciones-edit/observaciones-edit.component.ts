import { Component, OnInit, Inject } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { CuadrillaArchivoModel } from '../../models/cuadrilla-archivo.model';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CuadrillaObservacionGeneralModel } from '../../models/cuadrilla-observacion-general.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaObservacionArchivolModel } from '../../models/cuadrilla-observacion-archivo.model';

@Component({
  selector: 'app-observaciones-edit',
  templateUrl: './observaciones-edit.component.html'
})
export class ObservacionesEditComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  CuadrillaObservacionGeneralModel: CuadrillaObservacionGeneralModel = new CuadrillaObservacionGeneralModel();
  clone: CuadrillaObservacionGeneralModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  placa: any;
  archivosMaterial: any = [];
  archivosSeccion: any = [];
  enviando = false;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<ObservacionesEditComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.CuadrillaObservacionGeneralModel = JSON.parse(JSON.stringify(data.observacion));
    this.form = this.formBuilder.group({
      observaciones: [null, Validators.compose([Validators.maxLength(300)])],
      archivo: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.CuadrillaObservacionGeneralModel));
    this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.iniciando);

    this.serviceCuadrillaGeneral.sendStatus$.subscribe((status) => {
      if (status && status === this.constantsEstadoPeticion.enviando) {
        this.enviando = true;
      } else {
        this.enviando = false;
      }

      if (status && status === this.constantsEstadoPeticion.ok) {
        this.close();
      }
    });
    this.extractArchivosBySolicitud();
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionObservaciones(this.CuadrillaObservacionGeneralModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionObservaciones(null);
    this.dialogRef.close(0);
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.CuadrillaObservacionGeneralModel = this.clone;
        this.close();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true) {
      this.save();
    } else {
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  extractArchivosBySolicitud() {
    if (this.CuadrillaObservacionGeneralModel.obsArchivos) {
      this.archivosSeccion = [];
      for (const sArchivo of this.CuadrillaObservacionGeneralModel.obsArchivos) {
        this.archivosSeccion.push(sArchivo.archivo);
      }
    }
  }

  setArchivoSolicitud(event: any) {
    let eventObject;
    if (event && event.length > 0) {
      this.runFiles(event);
    } else if (event) {
      eventObject = '[' + JSON.stringify(event) + ']';
      eventObject = JSON.parse(eventObject);
      this.runFiles(eventObject);
    }

    if (event === '') {
      this.archivosSeccion = [];
      this.CuadrillaObservacionGeneralModel.obsArchivos = [];
    }
  }

  runFiles(event: any) {
    for (const archivo of event) {
      if (archivo.id) {
        let existe = false;
        for (const solicitudArchivo of this.CuadrillaObservacionGeneralModel.obsArchivos) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const seccionArchivo = new CuadrillaObservacionArchivolModel();
          seccionArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          seccionArchivo.archivo = archivo;
          this.CuadrillaObservacionGeneralModel.obsArchivos.push(seccionArchivo);
        }
      }
    }
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.CuadrillaObservacionGeneralModel[attr] = newstr.trim();
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
