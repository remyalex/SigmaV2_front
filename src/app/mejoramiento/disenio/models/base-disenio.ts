import { ViewChild } from '@angular/core';

import { SigmaFormUploadFileComponent } from 'src/app/shared/component/sigma-form-upload-file/sigma-form-upload-file.component';
import { Disenio } from './disenio.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DisenioDocumento } from './disenio-documento.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';

export class BaseDisenio {
    snackBar: MatSnackBar;
    utilitiesServices: UtilitiesService;
    disenio: Disenio;
    /** Variable usada para agrupar los elementos del formulario */
    form: FormGroup;

    @ViewChild('sigmaFormUploadFileOtros') sigmaFormUploadFileOtros: SigmaFormUploadFileComponent;
    @ViewChild('sigmaFormUploadFileRedes') sigmaFormUploadFileRedes: SigmaFormUploadFileComponent;
    /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor( snackBar: MatSnackBar,  utilitiesServices: UtilitiesService) {
      this.snackBar = snackBar;
      this.utilitiesServices = utilitiesServices;
  }

    onChangeArchivoRedes(event: any) {
        let archivoObject;
        if (event && event.length > 0 && this.sigmaFormUploadFileRedes !== undefined) {
          switch (this.sigmaFormUploadFileRedes.status) {
            case 'completed':
              this.runFilesRedes(event);
              break;
            case 'deleted':
              this.runFilesEliminarRedes(event);
              break;
          }
        } else if (event) {
          archivoObject = '[' + JSON.stringify(event) + ']';
          archivoObject = JSON.parse(archivoObject);
          this.runFilesRedes(archivoObject);
        }
        if (
            (event.length === 0 && this.sigmaFormUploadFileRedes !== undefined &&
            this.sigmaFormUploadFileRedes.status === 'deleted')
            || (event === '')
            ) {
          this.disenio.consultaRedes = [];
        }
      }

      runFilesRedes(archivoEvent: any) {
        if (archivoEvent[0].nombre !== undefined) {
          let existe = false;
          this.disenio.consultaRedes.forEach( (archivosGuardados: any) => {
            for (let index = 0; index < archivoEvent.length; index++) {
              if (archivoEvent[index].nombre === archivosGuardados.archivo.nombre) {
                existe = true;
                this.snackBar.open('El archivo ' + archivosGuardados.archivo.nombre + ' ya fué seleccionada previamente', 'X', {
                  duration: 8000,
                  panelClass: ['warning-snackbar']
                });
              }
            }
          });

          if (!existe) {
            const copiaFotosModelAntesDeAgregarNuevas = JSON.parse(JSON.stringify(this.disenio.consultaRedes));
            archivoEvent.forEach(item => {
              this.disenio.consultaRedes.push(this.crearItemArchivo(item));
            });
            copiaFotosModelAntesDeAgregarNuevas.forEach(item => {
              this.sigmaFormUploadFileRedes.files.push(item.archivo);
            });
            this.form.get('consultaRedes').markAsTouched();
            this.form.get('consultaRedes').updateValueAndValidity();
          } else {
            this.sigmaFormUploadFileRedes.files = [];
            this.disenio.consultaRedes.forEach( (archivoGuardado: any) => {
              this.sigmaFormUploadFileRedes.files.push(archivoGuardado.archivo);
            });
          }
          this.sigmaFormUploadFileRedes.inputFile.nativeElement.value = null;
        }
      }

      runFilesEliminarRedes(archivoEvent: any) {
        const copiaArchivosRedes = JSON.parse(JSON.stringify(this.disenio.consultaRedes));
        for (let index = 0; index < archivoEvent.length; index++) {
          const indexTempEliminar = copiaArchivosRedes.findIndex( f => f.archivo.nombre === archivoEvent[index].nombre);
          if (indexTempEliminar >= 0) {
            copiaArchivosRedes.splice(indexTempEliminar, 1);
          }
        }
        const posicionEliminar = this.disenio.consultaRedes.findIndex( f => f.archivo.nombre === copiaArchivosRedes[0].archivo.nombre);
        this.disenio.consultaRedes.splice(posicionEliminar, 1);
      }

      onChangeArchivoOtrosDocumentos(event: any) {
        let archivoObject;
        if (event && event.length > 0 && this.sigmaFormUploadFileOtros !== undefined) {
          switch (this.sigmaFormUploadFileOtros.status) {
            case 'completed':
              this.runFilesOtros(event);
              break;
            case 'deleted':
              this.runFilesEliminarOtros(event);
              break;
          }
        } else if (event) {
          archivoObject = '[' + JSON.stringify(event) + ']';
          archivoObject = JSON.parse(archivoObject);
          this.runFilesOtros(archivoObject);
        }
        if (event.length === 0 && this.sigmaFormUploadFileOtros !== undefined &&
            this.sigmaFormUploadFileOtros.status === 'deleted') {
          this.disenio.otrosDocumentos = [];
        }
        if (event === '') {
          //this.consultaRedes = [];
          this.disenio.otrosDocumentos = [];
        }
      }
    
      runFilesOtros(archivoEvent: any) {
        if (archivoEvent[0].nombre !== undefined) {
          let existe = false;
          this.disenio.otrosDocumentos.forEach( (archivosGuardados: any) => {
            for (let index = 0; index < archivoEvent.length; index++) {
              if (archivoEvent[index].nombre === archivosGuardados.archivo.nombre) {
                existe = true;
                this.snackBar.open('El archivo ' + archivosGuardados.archivo.nombre + ' ya fué seleccionada previamente', 'X', {
                  duration: 8000,
                  panelClass: ['warning-snackbar']
                });
              }
            }
          });
    
          if (!existe) {
            const copiaFotosModelAntesDeAgregarNuevas = JSON.parse(JSON.stringify(this.disenio.otrosDocumentos));
            archivoEvent.forEach(item => {
              this.disenio.otrosDocumentos.push(this.crearItemArchivo(item));
            });
            copiaFotosModelAntesDeAgregarNuevas.forEach(item => {
              this.sigmaFormUploadFileOtros.files.push(item.archivo);
            });
            this.form.get('otrosDocumentos').markAsTouched();
            this.form.get('otrosDocumentos').updateValueAndValidity();
          } else {
            this.sigmaFormUploadFileOtros.files = [];
            this.disenio.otrosDocumentos.forEach( (archivoGuardado: any) => {
              this.sigmaFormUploadFileOtros.files.push(archivoGuardado.archivo);
            });
          }
          this.sigmaFormUploadFileOtros.inputFile.nativeElement.value = null;
        }
      }
    
      runFilesEliminarOtros(archivoEvent: any) {
        const copiaArchivosOtros = JSON.parse(JSON.stringify(this.disenio.otrosDocumentos));
        for (let index = 0; index < archivoEvent.length; index++) {
          const posicionEliminarCopia = copiaArchivosOtros.findIndex( f => f.archivo.nombre === archivoEvent[index].nombre);
          if (posicionEliminarCopia >= 0) {
            copiaArchivosOtros.splice(posicionEliminarCopia, 1);
          }
        }
        const posicionEliminar = this.disenio.otrosDocumentos.findIndex( f => f.archivo.nombre === copiaArchivosOtros[0].archivo.nombre);
        this.disenio.otrosDocumentos.splice(posicionEliminar, 1);
      }

      crearItemArchivo (item: Archivo) {
        const seccionArchivo = new DisenioDocumento();
        seccionArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
        seccionArchivo.archivo = item;
        return seccionArchivo;
      }

      patternString(attr, data) {
        let re = /[a-zA-z]/gi;
        let newstr = data.target.value.replace(re, "");
        this.disenio[attr] = newstr.trim();
      }
    
      /**
       * Método encargado de marcar las validaciones erroneas en el formulario
       * @param anyForm Grupo del formulario q se esta procesando
       */
      public markAndValidateAllInputs(anyForm: FormGroup) {
        for (let inner in anyForm.controls) {
          anyForm.get(inner).markAsTouched();
          anyForm.get(inner).updateValueAndValidity();
        }
      }
}
