import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogConfig, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { IntervencionChequeoModel } from '../../models/intervencion-chequeo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { IntervencionEncabezado } from '../visita-verificacion-admin/models/intervencionEncabezado.model';
import { CONST_SHARED } from 'src/app/shared/constantes-shared';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { WebcamImage } from 'ngx-webcam';

import { SigmaFormUploadFileComponent } from 'src/app/shared/component/sigma-form-upload-file/sigma-form-upload-file.component';
import { UploadFileService } from 'src/app/shared/services/upload.file.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-intervencion-chequeo-edit',
  templateUrl: './intervencion-chequeo-edit.component.html'
})
export class IntervencionChequeoEditComponent implements OnInit {

  dataSource: MatTableDataSource<IntervencionChequeoModel>;
  mantenimiento: WorkflowMantenimientoModel;
  chequeo: IntervencionChequeoModel;
  accion = '';
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  clone: IntervencionChequeoModel[];
  fotos: Archivo[];
  foto: Archivo;
  minUploadFiles = 2;
  maxUploadFiles = 4;
  constants = CONST_SHARED;
  public webcamImage: WebcamImage = null;
  public showWebcam = false;
  public showUpload = false;
  public tomarFotoBtn = true;
  public disabledControl = true;
  request: string;
  fotosCam: Archivo[];

  @ViewChild('sigmaFormUploadFile') sigmaFormUploadFile: SigmaFormUploadFileComponent;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<IntervencionChequeoEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel,
      'chequeo': IntervencionChequeoModel,
      'datasource': MatTableDataSource<IntervencionChequeoModel>,
      'accion': string
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private uploadFileService: UploadFileService,

  ) {
    this.dataSource = data.datasource;
    this.mantenimiento = data.mantenimiento;
    this.chequeo = data.chequeo;
    this.accion = data.accion;
    this.form = formBuilder.group({
      chequeo: [null, Validators.required],
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(600)])],
      archivos: [null, Validators.required]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.sigmaFormUploadFile.action = this.accion;
    this.fotosCam = [];

    if (this.accion === 'create') {
      this.chequeo.fechaRegistro = this.utilitiesService.convertDateToString(new Date(), 'DD-MM-YYYY');
      const intervencionEncabezado = new IntervencionEncabezado();
      intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
      this.chequeo.intervencionEncabezado = intervencionEncabezado;
      this.chequeo.fotos = [];
      this.fotos = [];

    } else if (this.accion === 'show') {
      this.form.get('chequeo').disable();
      this.form.get('observaciones').disable();
      this.form.get('archivos').disable();
    } else if (this.accion === 'edit') {
      this.inicializarFotos();
    }
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento.intervenciones[0].chequeos));

    if (this.sigmaFormUploadFile.files.length < this.maxUploadFiles) {
      this.tomarFotoBtn = true;
    } else {
      this.tomarFotoBtn = false;
    }

  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid) {
      const itemVerificar = this.accion === 'create' ? this.chequeo : this.mantenimiento.intervenciones[0].chequeos[0];
      if (this.isExistListaChequeo(this.chequeo) === true) {
        if (this.accion === 'create') {
          this.chequeo.createdAt = Date.now().toString();
          this.mantenimiento.intervenciones[0].chequeos.unshift(this.chequeo);
        }
        this.dataSource.data = this.mantenimiento.intervenciones[0].chequeos;
        this.dialogRef.close();
      }
    }
  }

  isExistListaChequeo(chequeo: IntervencionChequeoModel): boolean {
    let element: IntervencionChequeoModel;
    if (this.accion === 'create') {
      element = this.mantenimiento.intervenciones[0].chequeos.find(item => item.listaChequeo.id === chequeo.listaChequeo.id);
    } else {
      if (chequeo.id !== undefined) {
        element = this.mantenimiento.intervenciones[0].chequeos.find(item =>
          item.listaChequeo.id === chequeo.listaChequeo.id && item.id !== chequeo.id);
      } else {
        element = this.mantenimiento.intervenciones[0].chequeos.find(item =>
          item.listaChequeo.id === chequeo.listaChequeo.id && item.createdAt !== chequeo.createdAt);
      }
    }
    if (element !== undefined) {
      this.snackBar.open('La lista de chequeo seleccionada ya fué registrada previamente', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }
    return true;
  }

  setArchivoFoto(event: any) {
    if (event && event.length > 0) {
      switch (this.sigmaFormUploadFile.status) {
        case 'completed':
          this.runFiles(event);
          break;
        case 'deleted':
          this.runDeleteFiles(event);
          break;
      }
    } else if (event) {
      this.chequeo.fotos = [];
    }

    if (event === '') {
      this.fotos = [];
      this.chequeo.fotos = [];
    }
  }

  runDeleteFiles(eventArchivosSeleccionados: any) {
    const archivoEliminar = this.chequeo.fotos.filter(e => eventArchivosSeleccionados.indexOf(e) === -1)[0];
    let posicion = 0;
    this.chequeo.fotos.forEach((archivosGuardados, index) => {
      if (archivosGuardados.nombre === archivoEliminar.nombre) {
        posicion = index;
      }
    });
    this.chequeo.fotos.splice(posicion, 1);
    if (this.sigmaFormUploadFile.files.length < this.maxUploadFiles) {
      this.tomarFotoBtn = true;
    }

  }

  runFiles(eventArchivosSeleccionados: any) {
    if (eventArchivosSeleccionados[0].nombre !== undefined) {
      let existe = false;
      this.chequeo.fotos.forEach(archivosGuardados => {
        for (let index = 0; index < eventArchivosSeleccionados.length; index++) {
          if (eventArchivosSeleccionados[index].nombre === archivosGuardados.nombre) {
            existe = true;
            this.snackBar.open('La foto ' + archivosGuardados.nombre + ' ya fué seleccionada previamenteXXX', 'X', {
              duration: 8000,
              panelClass: ['warning-snackbar']
            });
          }
        }
      });

      if (!existe) {
        const copiaFotosModelAntesDeAgregarNuevas = JSON.parse(JSON.stringify(this.chequeo.fotos));
        eventArchivosSeleccionados.forEach(item => {
          this.chequeo.fotos.push(item);
        });
        copiaFotosModelAntesDeAgregarNuevas.forEach(item => {
          this.sigmaFormUploadFile.files.push(item);
        });
        this.form.get('archivos').markAsTouched();
        this.form.get('archivos').updateValueAndValidity();
      } else {
        this.sigmaFormUploadFile.setFiles(this.chequeo.fotos);
      }
      if (this.sigmaFormUploadFile.files.length >= this.maxUploadFiles) {
        this.tomarFotoBtn = false;
      }
    }
  }

  runFilesCam(eventArchivosSeleccionados: any) {
    if (eventArchivosSeleccionados[0].nombre !== undefined) {

      const copiaFotosModelAntesDeAgregarNuevas = JSON.parse(JSON.stringify(this.chequeo.fotos));
      eventArchivosSeleccionados.forEach(item => {
        this.chequeo.fotos.push(item);
      });
      copiaFotosModelAntesDeAgregarNuevas.forEach(item => {
        this.sigmaFormUploadFile.files.push(item);
      });
      this.form.get('archivos').markAsTouched();
      this.form.get('archivos').updateValueAndValidity();

      if (this.sigmaFormUploadFile.files.length >= this.maxUploadFiles) {
        this.tomarFotoBtn = false;
      }
    }
  }

  inicializarFotos() {
    if (this.chequeo.fotos) {
      this.fotos = [];
      for (const sArchivo of this.chequeo.fotos) {
        this.fotos.push(sArchivo);
      }
      try {
        this.sigmaFormUploadFile.files = this.fotos;
      } catch (error) { }
    }
  }

  onListaChequeoChange() {
    this.disabledControl = true;
    this.form.controls['observaciones'].disable();
    this.form.controls['archivos'].disable();
    if (this.chequeo.listaChequeo !== undefined) {
      if (this.chequeo.listaChequeo.id === 647229) {
        // ACTA DE LA COMUNIDAD NO PERMITE QUE SE INTERVENGA LA VIA
        this.form.get('archivos').validator = <any>Validators.compose([null]);
      } else {
        this.form.get('archivos').validator = <any>Validators.compose([Validators.required]);
      }
      this.disabledControl = false;
      this.form.controls['observaciones'].enable();
      this.form.controls['archivos'].enable();
      this.form.get('observaciones').markAsTouched();
      if (this.sigmaFormUploadFile !== undefined) {
        this.sigmaFormUploadFile.resetFormConditions();
      }
    }
  }


  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.webcamImage.imageAsBase64;
    this.webcamImage.imageAsDataUrl;

    this.fotosCam = [];
    this.uploadFileService.uploadFileB64(this.webcamImage.imageAsBase64).subscribe(data => {
      this.foto = data;
      this.fotosCam[0] = this.foto
      this.sigmaFormUploadFile.onTouch();
      this.sigmaFormUploadFile.files = [];
      this.sigmaFormUploadFile.files = this.fotosCam;
      this.sigmaFormUploadFile.response();
      this.sigmaFormUploadFile.status = 'completed';
    }, error => {
      this.snackBar.open(this.constants.errorSubirArchivo, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });

  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
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
      if (val === 1) {
        this.mantenimiento.intervenciones[0].chequeos = this.clone;
        this.dataSource.data = this.mantenimiento.intervenciones[0].chequeos;
        this.dialogRef.close(1);
      }
    });
  }

  activar(event) {
    if (event === '1') {
      this.showWebcam = true;
      this.showUpload = false;
    } else {
      this.showWebcam = false;
      this.showUpload = true;
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
