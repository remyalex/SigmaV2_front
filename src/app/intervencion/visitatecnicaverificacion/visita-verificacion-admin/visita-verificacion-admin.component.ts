import { forEach } from '@angular/router/src/utils/collection';
import { IntervencionEncabezado } from './models/intervencionEncabezado.model';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, SimpleChanges } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatSnackBar, MatDialog, MatVerticalStepper } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { VisitaVerificacionBasicosComponent } from '../visita-verificacion-basicos/visita-verificacion-basicos.component';
import { Intervencion } from '../../models/intervencionModel.model';
import { IntervencionFalla } from '../../models/intervencion-falla';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { IntervencionFoto } from '../../models/intervencionFoto.model';
import { VisitaVerificacionFallasComponent } from '../visita-verificacion-fallas/visita-verificacion-fallas.component';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { SeleccionTransicionComponent } from 'src/app/shared/component/seleccion-transicion/seleccion-transicion.component';
import { VisitaVerificacionService } from '../services/visitaVerificacion.service';
import { VisitaVerificacionFotografiasComponent } from '../visita-verificacion-fotografias/visita-verificacion-fotografias.component';
import { VisitaVerificacionObsFotoComponent } from '../visita-verificacion-obs-foto/visita-verificacion-obs-foto.component';
import { VisitaVerificacionObservacionesComponent } from '../visita-verificacion-observaciones/visita-verificacion-observaciones.component';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-admin',
  templateUrl: './visita-verificacion-admin.component.html'
})
export class VisitaVerificacionAdminComponent implements OnInit {

  @Input() options: any;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() data: WorkflowMantenimientoActividadModel;
  @Input() transiciones: WorkflowTransicionModel[];
  transicionesIndividualesClone = [];

  mantenimientoSectionBasicos: WorkflowMantenimientoModel;
  mantenimientoSectionFallas: WorkflowMantenimientoModel;
  mantenimientoSectionFotosDiagnostico: WorkflowMantenimientoModel;
  mantenimientoSectionObservacionFotos: WorkflowMantenimientoModel;
  mantenimientoSectionObservacion: WorkflowMantenimientoModel;

  lastSectionUpdated = '';
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() saveTransicion = new EventEmitter();
  @Output() saveFunction = new EventEmitter();
  @Output() saveFunctionAll = new EventEmitter();
  @Output() onProcessing = new EventEmitter();
  @Input() loading = false;
  @ViewChild('sigmaSeleccionTransicion') sigmaSeleccionTransicion: SeleccionTransicionComponent;

  @ViewChild('sectionDatosBasicos') sectionDatosBasicos: VisitaVerificacionBasicosComponent;
  @ViewChild('sectionFallas') sectionFallas: VisitaVerificacionFallasComponent;
  @ViewChild('sectionFotosDiagnostico') sectionFotosDiagnostico: VisitaVerificacionFotografiasComponent;
  @ViewChild('sectionFotosChequeo') sectionFotosChequeo: VisitaVerificacionObsFotoComponent;
  @ViewChild('sectionObservacion') sectionObservacion: VisitaVerificacionObservacionesComponent;

  @ViewChild('stepper') stepper: MatVerticalStepper;
  /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;
  formPrincipal: FormGroup;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  formularioDatosBasicos: FormGroup;
  formularioRegistroFallas: FormGroup;
  formularioFotografias: FormGroup;
  formularioObservaciones: FormGroup;
  formularioDetalleGestion: FormGroup;
  formularioObservacionesFotografias: FormGroup;
  formularioEnvioGestion: FormGroup;

  mostrarTransicion = true;
  mostrarTransicionVerificandoFallas = false;
  mostrarOpcionesPreguntaSiNo = false;
  banderaCargaIntervencionesExistentes = false;
  intervencionesExistentes: IntervencionEncabezado[] = [];
  mostrarOpcionesPreguntaSiNoParteFinal = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  mostrarFormEditarIntervencion = false;
  showOnYes = null;
  opcionSeleccionadaSiNoRequiereActualizacionDiagnostico: string;
  opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal = '';
  currentAction: any;
  panelBasicoOpen: Boolean = false;
  private myInput = null;

  /*  Bandera indica que una vez se haga clic en las opciones: Si o No. debe crearse el acta */
  statusCreandoActa = false;
  mostrarDetalleVisitaDiagnostico = null;
  mostrarBotonCrearActa = false;
  loadingTransicion = false;
  /**
   * Indice que permite identificar cual es la sección activa
   * del acordeón.
   */
  public currentStep = 0;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private visitaVerificacionService: VisitaVerificacionService,
    private utilitiesServices: UtilitiesService
  ) {
    this.form = this.formBuilder.group({
      localidad: [null],
      upla: [null],
      barrio: [null],
      nInforme: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.inicializarFormularioIntervencion();
    this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico = '';
    this.copiarDelObjetoMantenimientoASecciones();
    if (this.getCantidadIntervenciones() === 1) {
      // cargar la intervencion.
      this.mostrarFormEditarIntervencion = true;
      this.mostrarDetalleVisitaDiagnostico  = false;
      this.mostrarBotonCrearActa = false;
      this.mostrarOpcionesPreguntaSiNo = true;
      this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico = this.usuarioSeleccionoSiRequiereActualizacionDiagnostico() ? '1' : '0';
      if (this.usuarioSeleccionoSiRequiereActualizacionDiagnostico()) {
        this.showOnYes = true;
      } else {
        this.showOnYes = false;
      }
    } else {
      // preparar para crear la nueva intervención
      this.statusCreandoActa = true;
      this.mostrarFormEditarIntervencion = false;
      this.mostrarDetalleVisitaDiagnostico  = true;
      this.mostrarBotonCrearActa = true;
      this.mostrarOpcionesPreguntaSiNo = false;
    }
  }

  copiarDelObjetoMantenimientoASecciones() {
    // clone data de las secciones
    this.mantenimientoSectionBasicos = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionFallas = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionFotosDiagnostico = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionObservacionFotos = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionObservacion = JSON.parse(JSON.stringify(this.mantenimiento));
  }

  prepararCreacionNuevaActa() {
    //this.mostrarFormEditarIntervencion = true;
    this.mostrarDetalleVisitaDiagnostico  = true;
    this.mostrarBotonCrearActa = true;
    this.mostrarOpcionesPreguntaSiNo = true;
    this.mostrarFormEditarIntervencion = false;
    this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal = '';
    this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico = '';
  }

  procesarEventoClickOpcionesSiNo() {
    if (!this.validarSiYaExisteNuevaIntervencionEnProceso()) {
      if (this.statusCreandoActa) {
        this.mostrarDetalleVisitaDiagnostico  = false;
        this.mostrarBotonCrearActa = false;
        if (this.getCantidadIntervenciones() === 0) {
          this.crearDeDiagnosticoAintervencionEncabezado();
        } else {
          this.eliminarIntervencionesActuales();
          this.crearDeDiagnosticoAintervencionEncabezado();
        }
      } else {
        this.inicializarFormularioIntervencion();
      }
    } else {
      if (this.mostrarFormEditarIntervencion === false) {
        this.mostrarFormEditarIntervencion = true;
        this.mostrarDetalleVisitaDiagnostico = false;
        this.mostrarBotonCrearActa = false;
      }
    }
  }

  validarSiYaExisteNuevaIntervencionEnProceso(): boolean {
    if (this.mantenimiento.intervenciones.length === 0) {
      return false;
    }
    if (this.mantenimiento.intervenciones[0].id === undefined) {
      return true;
    } else {
      return false;
    }
  }

  onModelChangeOpcionesSiNoFinal(event: any) {
    if (this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal !== '' &&
      this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal !== undefined) {
      this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico =
        JSON.stringify(JSON.parse(this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal));
      this.onChangeModeloDespuesSeleccionarSiNo(this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal);
      this.inicializarFormularioIntervencion();
      this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal = '';
      this.mostrarFormEditarIntervencion = false;
      this.mostrarOpcionesPreguntaSiNoParteFinal = false;
      this.restablecerValidacionesDeSeccionesDeFormularios(true);
      this.procesarEventoClickOpcionesSiNo();
      if (this.statusCreandoActa) {
        this.mostrarDetalleVisitaDiagnostico  = false;
        this.mostrarBotonCrearActa = false;
        if (this.getCantidadIntervenciones() === 0) {
          this.crearDeDiagnosticoAintervencionEncabezado();
        } else {
          this.eliminarIntervencionesActuales();
          this.crearDeDiagnosticoAintervencionEncabezado();
        }
      } else {
        this.inicializarFormularioIntervencion();
      }
    }
  }

  eliminarIntervencionesActuales() {
    this.mantenimiento.intervenciones = [];
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (changes.mantenimiento !== undefined && changes.mantenimiento.currentValue.intervenciones !== undefined
      && changes.mantenimiento.currentValue.intervenciones.length > 0) {
      if (this.mantenimientoSectionBasicos !== undefined && changes.mantenimiento.currentValue.intervenciones[0].id !== undefined &&
        changes.mantenimiento.currentValue.intervenciones[0].id > 0) {
        this.mantenimientoSectionFallas.intervenciones[0].id = changes.mantenimiento.currentValue.intervenciones[0].id;
        this.mantenimientoSectionObservacionFotos.intervenciones[0].id = changes.mantenimiento.currentValue.intervenciones[0].id;
        this.mantenimientoSectionFotosDiagnostico.intervenciones[0].id = changes.mantenimiento.currentValue.intervenciones[0].id;

        if (typeof this.mantenimientoSectionObservacionFotos.intervenciones[0] !== 'undefined') {
          this.mantenimientoSectionObservacionFotos.intervenciones[0].id = changes.mantenimiento.currentValue.intervenciones[0].id;
          // tslint:disable-next-line: max-line-length
          if (this.mantenimientoSectionObservacionFotos !== undefined && changes.mantenimiento.currentValue.intervenciones[0].chequeos.length > 0
             && this.lastSectionUpdated === 'listasChequeo') {
            this.mantenimientoSectionObservacionFotos.intervenciones[0].chequeos =
            changes.mantenimiento.currentValue.intervenciones[0].chequeos;
          }
        }

        if (this.mantenimientoSectionBasicos !== undefined && typeof this.mantenimientoSectionBasicos.intervenciones[0] !== 'undefined'
          && this.lastSectionUpdated === 'datosBasicos') {
          this.mantenimientoSectionBasicos.intervenciones[0].id = changes.mantenimiento.currentValue.intervenciones[0].id;
        }
        if (this.mantenimientoSectionFallas !== undefined && changes.mantenimiento.currentValue.intervenciones[0].fallas.length > 0 &&
          this.lastSectionUpdated === 'fallas') {
          this.mantenimientoSectionFallas.intervenciones[0].fallas = changes.mantenimiento.currentValue.intervenciones[0].fallas;
          this.sectionFallas.init();
        }
        if (this.mantenimientoSectionFotosDiagnostico !== undefined && changes.mantenimiento.currentValue.intervenciones[0].fotos.length > 0
           && this.lastSectionUpdated === 'fotografiasDiagnostico') {
          this.mantenimientoSectionFotosDiagnostico.intervenciones[0].fotos = changes.mantenimiento.currentValue.intervenciones[0].fotos;
          this.sectionFotosDiagnostico.init();
        }
        if (this.mantenimientoSectionObservacionFotos !== undefined && changes.mantenimiento.currentValue.intervenciones[0].chequeos.length > 0
          && this.lastSectionUpdated === 'listasChequeo') {
          this.mantenimientoSectionObservacionFotos.intervenciones[0].chequeos = changes.mantenimiento.currentValue.intervenciones[0].chequeos;
          this.sectionFotosChequeo.init();
        }
        if (this.lastSectionUpdated === 'all') {
          this.mantenimientoSectionBasicos.intervenciones = changes.mantenimiento.currentValue.intervenciones;
          this.mantenimientoSectionFallas.intervenciones[0].fallas = changes.mantenimiento.currentValue.intervenciones[0].fallas;
          this.sectionFallas.init();
          if (this.usuarioSeleccionoSiRequiereActualizacionDiagnostico() === true) {
            this.mantenimientoSectionObservacionFotos.intervenciones[0].chequeos = changes.mantenimiento.currentValue.intervenciones[0].chequeos;
            this.sectionFotosChequeo.init();
          } else {
            this.mantenimientoSectionFotosDiagnostico.intervenciones[0].fotos = changes.mantenimiento.currentValue.intervenciones[0].fotos;
            this.sectionFotosDiagnostico.init();
          }
        }
      }
    }
  }

  selectionChangeStepper(event: any) {
    setTimeout(this.actionChangeStepper, 300, this);
    if (event && event.selectedStep &&
      event.selectedStep.stepLabel && event.selectedStep.stepLabel.template &&
      event.selectedStep.stepLabel.template._def &&
      event.selectedStep.stepLabel.template._def.element &&
      event.selectedStep.stepLabel.template._def.element.template &&
      event.selectedStep.stepLabel.template._def.element.template.nodes.length &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {

      switch (event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {
        case 'Datos Basicos de la Visita':
          this.myInput = `DatosBasicosMat`;
          break;
        case 'Registro de la Visita ':
          this.myInput = `RegistroVisitaFallasMat`;
          break;
        case 'Fotografías de la Visita ':
          this.myInput = `RegistroVisitaFotosMat`;
          break;
        case 'Observaciones Y Fotografías de la Visita ':
          this.myInput = `ObservacionesFotografiasMat`;
          break;
        case 'Observaciones de la Visita ':
          this.myInput = `observacionesMat`;
          break;
        case 'Detalle de Gestión del Mantenimiento Vial ':
          this.myInput = `DetalleGestionMat`;
          break;
        default:
          this.myInput = null;
      }
    } else { this.myInput = null; }
  }

  actionChangeStepper(_this) {
    if(_this.stepper !== undefined) {
      switch (_this.stepper.selectedIndex) {
        case 0:
          _this.filtrarMantenimientosByRequiereActualizacionDiagnostico();
          break;
        case 1: // recursos
        _this.crearDeFallasAintervencionFallas();
        _this.filtrarMantenimientosByRequiereActualizacionDiagnostico();
          break;
        case 2:
          if (_this.showOnYes === true) {
            _this.setListaChequeo();
          } else {
            _this.setFotosIntervencion();
          }
          break;
        case 5:
          _this.filtrarMantenimientosByRequiereActualizacionDiagnostico();
          break;
    }
    }
}

  filtrarMantenimientosByRequiereActualizacionDiagnostico() {
    if (this.transicionesIndividualesClone.length === 0 || this.transiciones.length > 1) {
      if (this.mantenimiento.intervenciones !== null && this.mantenimiento.intervenciones.length > 0) {
        if (this.usuarioSeleccionoSiRequiereActualizacionDiagnostico() === true) {
          this.transicionesIndividualesClone = JSON.parse(JSON.stringify(this.transiciones.filter(f => f.id === 155)));
        } else {
          this.transicionesIndividualesClone = JSON.parse(JSON.stringify(this.transiciones.filter(f => f.id === 123)));
        }
      }
      if (this.sigmaSeleccionTransicion !== undefined) {
        this.sigmaSeleccionTransicion.evaluateOnlyOneTransition();
      }
    }
  }

  saveSeccion() {
    this.saveFunctionAll.emit({ mantenimiento: this.mantenimiento });
    this.filtrarMantenimientosByRequiereActualizacionDiagnostico();
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  getStatusSave() {
    if (this.showOnYes) {
      if (this.validaSeccionDatosBasicos()) {
        if (this.validaSeccionFallas()) {
          if (this.validaSeccionObservacionesYFotografias()) {
            this.validaSeccionDetalleGestion();
            this.validaSeccionEnvioGestion();
          }
        }
      }

    } else {

      if (this.validaSeccionDatosBasicos()) {
        if (this.validaSeccionFallas()) {
          if (this.validaSeccionFotos()) {
            if (this.validaSeccionObservaciones()) {
              this.validaSeccionDetalleGestion();
              this.validaSeccionEnvioGestion();
            }
          }
        }
      }

    }
  }

  validaSeccionDatosBasicos(): boolean {
    if (this.mantenimiento.intervenciones[0].id !== undefined && this.mantenimiento.intervenciones[0].id !== null) {
      this.formularioDatosBasicos.get('ctrlDatosBasicos').disable();
      return true;
    } else {
      return false;
    }
  }

  // Esta seccion se deja desbloqueada de manera predeterminada mientras se aclara funcionalidad del CU con UMV
  validaSeccionFallas(): boolean {
    if (this.mantenimientoSectionFallas.intervenciones[0].id !== undefined
      && this.mantenimientoSectionFallas.intervenciones[0].id !== null && this.mantenimientoSectionFallas.intervenciones[0].fallas) {
        let valid = true; let i = 0;
        for (i = 0; i < this.mantenimientoSectionFallas.intervenciones[0].fallas.length; i++) {
            const element = this.mantenimientoSectionFallas.intervenciones[0].fallas[i];
            if ( element.id === undefined || element.id === 0 || element.espesor === null || element.volumen == null ) {
              valid = false;
              break;
            }
        }
        if (valid === true) {
          this.mostrarTransicion = true;
          this.mostrarTransicionVerificandoFallas = true;
        } else {
          this.mostrarTransicion = false;
          this.mostrarTransicionVerificandoFallas = false;
        }
    } else {
      this.mostrarTransicion = false;
      this.mostrarTransicionVerificandoFallas = false;
    }
    this.formularioRegistroFallas.get('ctrlRegistroFallas').disable();
    return true;
  }

  validaSeccionFotos(): boolean {
    if (this.mantenimiento.intervenciones[0].fotos !== null && this.mantenimiento.intervenciones[0].fotos.length > 0
      && this.mantenimiento.intervenciones[0].fotos[0].id !== undefined) {
      this.formularioFotografias.get('ctrlFotografias').disable();
      return true;
    } else {
      return false;
    }
  }

  validaSeccionObservacionesYFotografias(): boolean {
    if (this.mantenimiento.intervenciones[0].chequeos !== null && this.mantenimiento.intervenciones[0].chequeos.length > 0
      && this.mantenimiento.intervenciones[0].chequeos[0].id !== undefined) {
      this.formularioObservacionesFotografias.get('ctrlObservacionesFotografias').disable();
      return true;
    } else {
      return false;
    }
  }

  validaSeccionObservaciones() {
    if (this.mantenimiento.intervenciones[0].observaciones !== null) {
      this.formularioObservaciones.get('ctrlObservaciones').disable();
      return true;
    } else {
      return false;
    }
  }

  validaSeccionDetalleGestion(): boolean {
    this.formularioDetalleGestion.get('ctrlDetalleGestion').disable();
    return true;
  }

  validaSeccionEnvioGestion(): boolean {
    this.formularioEnvioGestion.get('ctrlEnvioGestion').disable();
    return true;
  }

  validaVisualizacionSeccionFallasSegunTipoSuperficie(): boolean {
    switch (this.mantenimiento.tipoSuperficie.descripcion) {
      case 'RÍGIDO':
      case 'FLEXIBLE':
      case 'ADOQUÍN CONCRETO':
      case 'ADOQUÍN ARCILLA':
      case 'MIXTOS': return true; break;
      default: return false;
    }
  }

  saveLocal(event) {
    this.mantenimiento.intervenciones = event.intervenciones;
  }

  saveRegistroBasicos(event) {
    this.lastSectionUpdated = 'datosBasicos';
    this.mantenimiento.tipoVia = JSON.parse(JSON.stringify(event.mantenimiento.tipoVia));
    this.mantenimiento.intervenciones[0].tipoEjecucion = JSON.parse(JSON.stringify(event.mantenimiento.intervenciones[0].tipoEjecucion));
    this.mantenimiento.clase = JSON.parse(JSON.stringify(event.mantenimiento.clase));
    this.mantenimiento.intervenciones[0].rutaTransporte  = JSON.parse(JSON.stringify(event.mantenimiento.intervenciones[0].rutaTransporte));
    this.completeSaveRegistro();
  }

  saveRegistroFallas(event) {
    this.lastSectionUpdated = 'fallas';
    this.mantenimiento.intervenciones[0].fallas = JSON.parse(JSON.stringify(event.mantenimiento.intervenciones[0].fallas));
    this.completeSaveRegistro();
  }
  saveRegistroFotografiasDiagnostico(event) {
    this.lastSectionUpdated = 'fotografiasDiagnostico';
    this.mantenimiento.intervenciones[0].fotos = JSON.parse(JSON.stringify(event.mantenimiento.intervenciones[0].fotos));
    this.completeSaveRegistro();
  }

  saveRegistroObservacionFoto(event) {
    this.lastSectionUpdated = 'listasChequeo';
    this.mantenimiento.intervenciones[0].chequeos = JSON.parse(JSON.stringify(event.mantenimiento.intervenciones[0].chequeos));
    this.completeSaveRegistro();
  }

  saveRegistroObservaciones(event) {
    this.lastSectionUpdated = 'observaciones';
    this.mantenimiento.intervenciones[0].observaciones = event.mantenimiento.intervenciones[0].observaciones;
    this.completeSaveRegistro();
  }

  completeSaveRegistro() {
    this.mantenimiento.intervenciones[0].requiereActualizacionDiag = this.showOnYes;
    this.saveSeccion();
    this.filtrarMantenimientosByRequiereActualizacionDiagnostico();
    if (this.sigmaSeleccionTransicion !== undefined) {
      this.sigmaSeleccionTransicion.evaluateOnlyOneTransition();
    }
  }

  onPrepararNuevaActa() {
    this.opcionSeleccionadaSiNoRequiereActualizacionDiagnosticoFinal = '';
    this.mostrarOpcionesPreguntaSiNoParteFinal = false;
    this.statusCreandoActa = true;
  }

  onPrepararNuevaActaFinal() {
    this.mostrarOpcionesPreguntaSiNoParteFinal = true;
    this.statusCreandoActa = true;
  }

  restablecerValidacionesDeSeccionesDeFormularios(restablecer: boolean) {
    if (restablecer) {
      this.formularioDatosBasicos.get('ctrlDatosBasicos').enable();
      this.formularioRegistroFallas.get('ctrlRegistroFallas').enable();
      if (this.formularioFotografias === undefined && this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico === '0') {
        this.formularioFotografias = this.formBuilder.group({
          ctrlFotografias: [null, Validators.compose([Validators.required])]
        });
        this.formularioFotografias.get('ctrlFotografias').enable();
      }
      if (this.formularioObservacionesFotografias === undefined && this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico === '1') {
        this.formularioObservacionesFotografias = this.formBuilder.group({
          ctrlObservacionesFotografias: [null, Validators.compose([Validators.required])]
        });
        this.formularioObservacionesFotografias.get('ctrlObservacionesFotografias').enable();
      }
      this.formularioObservaciones.get('ctrlObservaciones').enable();
      this.formularioDetalleGestion.get('ctrlDetalleGestion').enable();
      this.formularioEnvioGestion.get('ctrlEnvioGestion').enable();
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.validarSeccionesGuardarTodo(true)) {
      if (this.form.valid === true) {
        this.enviada = true;
        this.disableSubmit = true;
        this.actualizarModeloConSecciones();
        this.saveSeccion();
      } else {
        this.disableSubmit = false;
        this.snackBar.open('Favor revise el formulario', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
    }
  }

  actualizarModeloConSecciones(): void {
    this.lastSectionUpdated = 'all';
    this.mantenimiento.intervenciones[0].requiereActualizacionDiag = this.showOnYes;
    this.mantenimiento.tipoVia = this.sectionDatosBasicos.getFormValue().tipoVia;
    this.mantenimiento.intervenciones[0].tipoEjecucion = this.sectionDatosBasicos.getFormValue().tipoEjecucion;
    this.mantenimiento.clase = this.sectionDatosBasicos.getFormValue().clase;
    this.mantenimiento.intervenciones[0].rutaTransporte  = this.sectionDatosBasicos.getFormValue().rutaTransporte;
    this.mantenimiento.intervenciones[0].fallas = this.sectionFallas.getFormValue();
    if (this.usuarioSeleccionoSiRequiereActualizacionDiagnostico()) {
      this.mantenimiento.intervenciones[0].chequeos = this.sectionFotosChequeo.getFormValue();
    } else {
      this.mantenimiento.intervenciones[0].fotos = this.sectionFotosDiagnostico.getFormValue();
      this.mantenimiento.intervenciones[0].observaciones = this.sectionObservacion.getFormValue().observaciones;
    }
  }

  validarSeccionesGuardarTodo(mostrarMensaje: boolean): boolean {
      let mensaje = '';
      if (!this.sectionDatosBasicos.formIsValid()) {
        mensaje = 'El formulario de la sección Datos básicos tiene campos sin diligenciar';
      }
      if (!this.sectionFallas.formIsValid() && mensaje === '') {
        mensaje = 'El formulario de la sección Registro de la visita tiene campos sin diligenciar';
      }
      if (this.usuarioSeleccionoSiRequiereActualizacionDiagnostico() === true) {
        if (!this.sectionFotosChequeo.formIsValid() && mensaje === '') {
          mensaje = 'El formulario de la sección Observaciones y Fotofrafías de la Visita no tiene ningún registro';
        }
      } else {
        if (!this.sectionFotosDiagnostico.formIsValid() && mensaje === '') {
          mensaje = 'El formulario de la sección Fotografías de la Visita no cumple con las condiciones requeridas';
        }
        if (!this.sectionObservacion.formIsValid() && mensaje === '') {
          mensaje = 'El formulario de la sección Observaciones de la visita tiene un campo sin diligenciar';
        }
      }
      if (mostrarMensaje === true && mensaje !== '') {
        this.snackBar.open(mensaje, 'X', {
          duration: 7000,
          panelClass: ['warning-snackbar']
        });
        return false;
      }
      return true;
  }

  usuarioSeleccionoSiRequiereActualizacionDiagnostico(): boolean {
    return this.mantenimiento.intervenciones[0].requiereActualizacionDiag;
  }

  onChangeModeloDespuesSeleccionarSiNo(event) {
    //this.mostrarFormEditarIntervencion = true;
    if (event === '1') {
      this.showOnYes = true;
      if (this.stepper !== undefined && this.stepper.selectedIndex === 2) {
        this.mantenimientoSectionFotosDiagnostico.intervenciones[0].fotos = this.sectionFotosDiagnostico.getFormValue();
      }
    } else {
      this.showOnYes = false;
      if (this.stepper !== undefined && this.stepper.selectedIndex === 2) {
        this.mantenimientoSectionObservacionFotos.intervenciones[0].chequeos = this.sectionFotosChequeo.getFormValue();
      }
    }
    if ( this.mantenimiento.intervenciones !== null && this.mantenimiento.intervenciones.length > 0) {
      this.mantenimiento.intervenciones[0].requiereActualizacionDiag = this.showOnYes;
    }
    setTimeout(this.actionChangeStepper, 300, this);
    setTimeout((function(_this) {
      return function() {
        _this.utilitiesServices.scrollToTop();
      }})(this), 400);
  }

  disabledQuestion() {
    return false;
  }

  clickCrearActa() {
    this.inicializarFormularioIntervencion();
  }

  inicializarFormularioIntervencion() {
    this.formularioDatosBasicos = this.formBuilder.group({
      ctrlDatosBasicos: [null, Validators.compose([Validators.required])]
    });

    this.formularioRegistroFallas = this.formBuilder.group({
      ctrlRegistroFallas: [null, Validators.compose([Validators.required])]
    });

    let opcionSiNoSeleccionada = false;
    if (this.mantenimiento.intervenciones.length === 0) {
      opcionSiNoSeleccionada = null;
    } else {
      if (this.mantenimiento.intervenciones[0].requiereActualizacionDiag !== undefined) {
        opcionSiNoSeleccionada = this.mantenimiento.intervenciones[0].requiereActualizacionDiag;
      } else {
        if (this.showOnYes !== false) {
          opcionSiNoSeleccionada = this.showOnYes;
        }
      }
    }
    if (opcionSiNoSeleccionada === null && this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico !== '') {
      opcionSiNoSeleccionada = this.opcionSeleccionadaSiNoRequiereActualizacionDiagnostico === '1' ? true : false;
    }
    if (opcionSiNoSeleccionada) {
      this.formularioObservacionesFotografias = this.formBuilder.group({
        ctrlObservacionesFotografias: [null, Validators.compose([Validators.required])]
      });

    } else {

      this.formularioFotografias = this.formBuilder.group({
        ctrlFotografias: [null, Validators.compose([Validators.required])]
      });

      this.formularioObservaciones = this.formBuilder.group({
        ctrlObservaciones: [null, Validators.compose([Validators.required])]
      });

    }

    this.formularioDetalleGestion = this.formBuilder.group({
      ctrlDetalleGestion: [null, Validators.compose([Validators.required])]
    });

    this.formularioEnvioGestion = this.formBuilder.group({
      ctrlEnvioGestion: [null, Validators.compose([Validators.required])]
    });
  }

  crearDeDiagnosticoAintervencionEncabezado(): void {
    this.inicializarFormularioIntervencion();
    const intervencionEncabezado = new Intervencion();
    intervencionEncabezado.requiereActualizacionDiag = this.showOnYes;
    intervencionEncabezado.responsable = this.mantenimiento.responsable;
    intervencionEncabezado.fechaVisita = this.utilitiesServices.getFechaServerFormat_ddMMaaaa(new Date());
    intervencionEncabezado.tipoEjecucion = this.mantenimiento.tipoEjecucion;
    intervencionEncabezado.tipoSuperficie = this.mantenimiento.tipoSuperficie;
    intervencionEncabezado.activo = false;
    const mantenimiento = {
      id: this.mantenimiento.id
    };
    intervencionEncabezado.mantenimiento = mantenimiento;
    intervencionEncabezado.fallas = [];
    intervencionEncabezado.fotos = [];
    // Se pasa la intervencion al mantenimiento
    this.mantenimiento.intervenciones.unshift(intervencionEncabezado);
    this.mantenimientoSectionFallas = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionFotosDiagnostico = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSectionObservacionFotos = JSON.parse(JSON.stringify(this.mantenimiento));

    if (!this.banderaCargaIntervencionesExistentes) {
      if (this.loading === false) {
        this.onProcessing.next(true);
      this.loading = true;
        this.visitaVerificacionService.listIntervencionByMantenimiento(this.mantenimiento.pk)
        .subscribe( (intervenciones: IntervencionEncabezado[]) => {
          this.intervencionesExistentes = intervenciones;
          this.mantenimiento.intervenciones[0].nroActa = this.obtenerNumeroActaIntervencion();
          this.mantenimientoSectionBasicos = JSON.parse(JSON.stringify(this.mantenimiento));
          this.statusCreandoActa = false;
          this.mostrarFormEditarIntervencion = true;
          this.copiarDelObjetoMantenimientoASecciones();
          this.onProcessing.next(false);
          this.loading = false;
        }, err => {
          this.loading = false;
          this.onProcessing.next(false);
          this.snackBar.open('Error consultando intervenciones existentes', 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });
      }
    } else {
      this.mantenimiento.intervenciones[0].nroActa = this.obtenerNumeroActaIntervencion();
      this.mantenimientoSectionBasicos = JSON.parse(JSON.stringify(this.mantenimiento));
      this.statusCreandoActa = false;
      this.mostrarFormEditarIntervencion = true;
      this.copiarDelObjetoMantenimientoASecciones();
    }
  }

  obtenerNumeroActaIntervencion() {
    let todasIntervenciones = JSON.parse( JSON.stringify( this.intervencionesExistentes ) );
    if (todasIntervenciones === null) {
      todasIntervenciones = [];
    }
    todasIntervenciones.push(this.mantenimiento.intervenciones);
    // Remover items duplicados (pendiente)
    const cantidadIntervenciones = (todasIntervenciones ? todasIntervenciones.length : 1);
    // arma el número string
    let numeroAux = cantidadIntervenciones.toString();
    while (numeroAux.length < 4) {
      numeroAux = '0' + numeroAux;
    }
    return numeroAux;
    //return this.addLeftPaddingZeros((intervenciones ? intervenciones.length : 0) + 1);
  }

  actualizarIntervencionEncabezado(intervencionEncabezadoModificado: Intervencion) {
    intervencionEncabezadoModificado.requiereActualizacionDiag = this.showOnYes;
    this.mantenimiento.intervenciones[0] = intervencionEncabezadoModificado;
  }

  crearDeFallasAintervencionFallas(): void {
    if (this.mantenimientoSectionFallas.intervenciones[0].fallas.length === 0) {
      let numnero = 0;
      this.mantenimiento.diagnostico.fallas.forEach(falla => {
        const item = new IntervencionFalla();
        const intervEncabezado = new IntervencionEncabezado();
        intervEncabezado.id = this.mantenimiento.intervenciones[0].id;
        item.intervencionEncabezado = intervEncabezado;
        const diagnosticoFalla = new DiagnosticoFallaModel();
        diagnosticoFalla.id = falla.id;
        item.diagnosticoFalla = diagnosticoFalla;
        item.numero = ++numnero;
        item.ancho = this.mantenimiento.tipoSuperficie.descripcion === 'RÍGIDO' ? falla.anchoLosa : falla.ancho;
        item.areaFalla = falla.area;
        item.longitud = this.mantenimiento.tipoSuperficie.descripcion === 'RÍGIDO' ? falla.longitudLosa : falla.longitud;
        item.tipoFalla = falla.tipoFalla;
        item.tipoSuperficie = this.mantenimiento.tipoSuperficie;
        item.tipoIntervencion = falla.tipoIntervencion;
        this.mantenimientoSectionFallas.intervenciones[0].fallas.push(item);
      });
      this.sectionFallas.init();
    }
  }

  setFotosIntervencion() {
    if (this.mantenimientoSectionFotosDiagnostico.intervenciones[0].fotos.length === 0) {
      let numnero = 0;
      for (const diagnosticoFoto of this.mantenimiento.diagnostico.fotos) {
        const intervencionFoto = new IntervencionFoto();
        intervencionFoto.fechaRegistro = diagnosticoFoto.fechaRegistro;
        intervencionFoto.numeroFoto = ++numnero;
        intervencionFoto.archivo = diagnosticoFoto.archivo;
        const intervencionEncabezado = new Intervencion();
        intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
        intervencionFoto.intervencionEncabezado = intervencionEncabezado;
        this.mantenimientoSectionFotosDiagnostico.intervenciones[0].fotos.push(intervencionFoto);
      }
    }
    if (this.sectionFotosDiagnostico.mantenimientoTabla === undefined) {
      this.sectionFotosDiagnostico.init();
    }
  }

  setListaChequeo() {
    if (this.mantenimiento.intervenciones.length > 0
      && this.sectionFotosChequeo.mantenimientoTabla === undefined) {
      this.sectionFotosChequeo.init();
    }
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
          if (this.mantenimiento.intervenciones.length > 0
            && this.mantenimiento.intervenciones[0].id === undefined || null) {
            this.mostrarFormEditarIntervencion = false;
            this.mostrarDetalleVisitaDiagnostico = true;
            this.mostrarBotonCrearActa = true;
            this.mostrarOpcionesPreguntaSiNoParteFinal = false;
            this.mostrarOpcionesPreguntaSiNo = false;
          } else {
            this.irAGridmantenimientos();
          }
        }
      }
    );
  }

  irAGridmantenimientos() {
    this.currentAction = 'list';
    this.back.emit({ currentAction: this.currentAction });
  }

  executeTransition(event): void {
    if (this.validarSeccionesGuardarTodo(true) === true) {
      this.data.mantenimiento = this.mantenimiento;
      this.data.mantenimiento.intervenciones[0].activo = true;
      this.saveTransicion.emit(this.data);
    }
  }

  /**
  * Marks all controls in a form group as touched and validate
  * @param formGroup - The form group to touch
  */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setFocus() {
    if (this.myInput !== null) {
      const targetElem = document.getElementById(this.myInput);
      targetElem.focus();
    }
  }

  getCantidadIntervenciones(): number {
    if (this.mantenimiento.intervenciones !== null) {
      return this.mantenimiento.intervenciones.length;
    }
    return 0;
  }

  onProcesingTransicion(event: any) {
    if (event !== undefined) {
      this.loadingTransicion = event;
    }
  }

  getLoading() {
    return this.loading || this.loadingTransicion  ? true : false;
  }
}
