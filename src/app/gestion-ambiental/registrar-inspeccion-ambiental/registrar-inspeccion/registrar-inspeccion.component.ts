import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CONST_INSPECCION_REGISTRO_AMBIENTAL } from '../registro-inspeccion.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { PredisenioService } from '../../../mejoramiento/predisenio/service/predisenio.service';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { RegistrarInspeccionService } from '../services/registrar-inspeccion.service';
import { ElementoInspeccionModel } from '../models/elemento-inspeccion.model';
import { ElementoInsArchivo } from '../models/elemento-inspeccion-archivo.model';
import { CommonService } from '../../../shared/services/common.service';
import { ElementoInspeccionDetalleModel } from '../models/elemento-inspeccion-detalle.model';


@Component({
  selector: 'sigma-registrar-inspeccion-amb',
  templateUrl: './registrar-inspeccion.component.html'
})
export class RegistrarInspeccionComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  
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

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  enviadaAll = true;
  nextTransition = false;
  elementoInspeccion: ElementoInspeccionModel;
  elementoInspeccionDetalle: ElementoInspeccionDetalleModel;
  inspeccionDetalleAccion: any;
  inspeccionDetalleObservacionElemento: any;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private servicio: PredisenioService,
    private workflowService: WorkflowService,
    private utilitiesServices: UtilitiesService,
    private serviceInspeccion: RegistrarInspeccionService) {

    const fechaActual = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());

    this.elementoInspeccion = new ElementoInspeccionModel();
    this.elementoInspeccionDetalle = new ElementoInspeccionDetalleModel();

    this.elementoInspeccion.mantenimientos = [];
    this.elementoInspeccion.inspAmbientalArchivos = [];
    this.elementoInspeccion.detalleInspeccion = [];
    this.elementoInspeccion.fecha = fechaActual;

    this.form = this.formBuilder.group({
      fecha: [{ value: null, disabled: true }],
      zona: [{ value: null, disabled: true }],
      localidad: [{ value: null, disabled: true }],
      upla: [{ value: null, disabled: true }],
      barrio: [{ value: null, disabled: true }],
      civ: [{ value: null, disabled: true }],
      pk: [{ value: null, disabled: true }],
      situacion: [null, Validators.compose([Validators.required])],
      elemento: [null, Validators.compose([Validators.required])],
      individuosArboreos: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionArbolesCant: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      sumideros: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionSumiderosCant: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      espacioPublico: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      proteccionEspacioPublicoCant: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(999), Validators.pattern('[0-9]*')])],
      banios: [{ value: null, disabled: true }],
      // tslint:disable-next-line: max-line-length
      baniosMantenimientoCant: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(99), Validators.pattern('[0-9]*')])],
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(2000)])],
      accionImplementada: [null, Validators.compose([Validators.required, Validators.maxLength(2000)])],
      estado: [null, Validators.compose([Validators.required])],
      registroFotografico: [null, Validators.compose([Validators.required, Validators.max(2)])]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.saveAllForm.emit({ nextTransition: false });
    this.commonService.getListaItemByNombreListaAndValorItem('UMV_INSPECCION_AMB_SITUACION', 'Nueva').subscribe(listaItem => {
      this.elementoInspeccion.situacion = listaItem;
    });
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

    this.elementoInspeccion.mantenimientos.push(this.mantenimiento);
    this.elementoInspeccion.detalleInspeccion.push(this.elementoInspeccionDetalle);
    this.elementoInspeccion.intervencion = this.mantenimiento.intervenciones[0];
    this.elementoInspeccion.tipoElementoAmbiental = this.elementoInspeccion.elemento;
    if (this.elementoInspeccion) {
      this.serviceInspeccion.create(this.elementoInspeccion).subscribe((data) => {
        this.snackBar.open(
          this.constants.successSave, 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
        this.enviadaAll = false;
      }, error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
    }
  }

  saveAll() {
    this.saveAllForm.emit({ nextTransition: true });
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
