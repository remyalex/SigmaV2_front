import { SigmaConfirmComponent } from './../../../shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElementoInspeccionModel } from '../models/elemento-inspeccion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CONST_INSPECCION_REGISTRO_AMBIENTAL } from '../registro-inspeccion.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { RegistrarInspeccionService } from '../services/registrar-inspeccion.service';
import { ElementoInsArchivo } from '../models/elemento-inspeccion-archivo.model';
import { CommonService } from '../../../shared/services/common.service';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ElementoInspeccionDetalleModel } from '../models/elemento-inspeccion-detalle.model';

@Component({
  selector: 'sigma-editar-inspeccion-ambiental',
  templateUrl: './editar-inspeccion.component.html'
})
export class EditarInspeccionComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() elementoInspeccion: ElementoInspeccionModel;
  
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() saveAllForm = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_INSPECCION_REGISTRO_AMBIENTAL;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  currentAction: any;
  archivosInspeccionAmb: Archivo[];

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  nextTransition = false;
  elementoInspeccionDetalle: ElementoInspeccionDetalleModel;
  inspeccionDetalleAccion: any;
  inspeccionDetalleObservacionElemento: any;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private snackBar: MatSnackBar, private dialog: MatDialog, private workflowService: WorkflowService, private utilitiesServices: UtilitiesService, private serviceInspeccion: RegistrarInspeccionService) {

    this.elementoInspeccionDetalle = new ElementoInspeccionDetalleModel();

    this.form = this.formBuilder.group({
      fecha: [{ value: null, disabled: true }],
      zona: [{ value: null, disabled: true }],
      localidad: [{ value: null, disabled: true }],
      upla: [{ value: null, disabled: true }],
      barrio: [{ value: null, disabled: true }],
      civ: [{ value: null, disabled: true }],
      pk: [{ value: null, disabled: true }],
      situacion: [null, Validators.compose([Validators.required])],
      elemento: [{ value: null, disabled: true }],
      individuosArboreos: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionArbolesCant: [null, Validators.compose([Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      sumideros: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionSumiderosCant: [null, Validators.compose([Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      espacioPublico: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionEspacioPublicoCant: [null, Validators.compose([ Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      banios: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      baniosMantenimientoCant: [null, Validators.compose([ Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      observaciones: [null, Validators.compose([Validators.required])],
      accionImplementada: [null, Validators.compose([Validators.required])],
      estado: [null, Validators.compose([Validators.required])],
      registroFotografico: [null, Validators.compose([Validators.required])],
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.extractArchivosBySolicitud();
    switch ( this.elementoInspeccion.elemento.descripcion ) {
      case 'arbóreos':
        this.elementoInspeccion.protArbolescantidad = this.elementoInspeccion.protCantidad;
        break;
      case 'Baños portátiles':
        this.elementoInspeccion.protBaniosCantidad = this.elementoInspeccion.protCantidad;
        break;
      case 'Sumideros':
        this.elementoInspeccion.protSumiderosCantidad = this.elementoInspeccion.protCantidad;
        break;
      case 'Espacio público':
        this.elementoInspeccion.protEspaciosCantidad = this.elementoInspeccion.protCantidad;
        break;
    }
    this.saveAllForm.emit({ nextTransition: false });
    this.commonService.getListaItemByNombreListaAndValorItem('UMV_INSPECCION_AMB_SITUACION', 'Previa').subscribe(listaItem => {
      this.elementoInspeccion.situacion = listaItem;
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    switch ( this.elementoInspeccion.elemento.descripcion ) {
      case 'arbóreos':
        this.elementoInspeccion.protCantidad = this.elementoInspeccion.protArbolescantidad;
        break;
      case 'Baños portátiles':
        this.elementoInspeccion.protCantidad = this.elementoInspeccion.protBaniosCantidad;
        break;
      case 'Sumideros':
        this.elementoInspeccion.protCantidad = this.elementoInspeccion.protSumiderosCantidad;
        break;
      case 'Espacio público':
        this.elementoInspeccion.protCantidad = this.elementoInspeccion.protEspaciosCantidad;
        break;
    }
    this.elementoInspeccion.detalleInspeccion.push(this.elementoInspeccionDetalle);
    this.elementoInspeccion.intervencion = this.mantenimiento.intervenciones[0];
    this.elementoInspeccion.tipoElementoAmbiental = this.elementoInspeccion.elemento;
    if (this.elementoInspeccion) {
      this.serviceInspeccion.update(this.elementoInspeccion).subscribe((data) => {
        this.snackBar.open(
          this.constants.successSave, 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
        this.saveAll();
      }, error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    }
  }

  saveAll() {
    this.saveAllForm.emit({ nextTransition: true });
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.currentAction = 'list';
          this.back.emit({ currentAction: this.currentAction });
        }
      }
    );
  }

  setArchivoSolicitud(event: any) {
    this.enviada = false;
    if (event && event.length > 0) {
      if (event.length < 3) {
        for (const archivo of event) {
          let existe = false;
          for (const solicitudArchivo of this.elementoInspeccion.inspAmbientalArchivos) {
            if (archivo.id === solicitudArchivo.archivo.id) {
              existe = true;
            }
          }
          if (!existe && archivo.id) {
            const solicitudArchivo = new ElementoInsArchivo();
            solicitudArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
            solicitudArchivo.archivo = archivo;
            this.elementoInspeccion.inspAmbientalArchivos.push(solicitudArchivo);
          }

        }
      } else {
        this.enviada = true;
        this.snackBar.open('Solo es posible cargar un maximo de 2 fotografias', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    }

    if (event === '') {
      this.elementoInspeccion.inspAmbientalArchivos = [];
    }
  }

  detalleInspeccion(attr, data) {
    this.elementoInspeccionDetalle[attr] = data;
  }

  extractArchivosBySolicitud() {
    if (this.elementoInspeccion.inspAmbientalArchivos) {
      this.archivosInspeccionAmb = [];
      for (const solicitudArchivo of this.elementoInspeccion.inspAmbientalArchivos) {
        this.archivosInspeccionAmb.push(solicitudArchivo.archivo);
      }
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.elementoInspeccion[attr] = newstr.trim();
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
