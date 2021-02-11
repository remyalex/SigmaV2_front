import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatSnackBar, MatDialog } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { VisitaVerificacionBasicosComponent } from '../visita-verificacion-basicos/visita-verificacion-basicos.component';
import { Intervencion } from '../../models/intervencionModel.model';
import { IntervencionFalla } from '../../models/intervencion-falla';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { IntervencionFoto } from '../../models/intervencionFoto.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { IntervencionEncabezado } from '../visita-verificacion-admin/models/intervencionEncabezado.model';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-admin-detail',
  templateUrl: './visita-verificacion-admin-detail.component.html'
})
export class VisitaVerificacionAdminDetailComponent implements OnInit {

  @Input() options: any;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  // @Input() data: WorkflowMantenimientoActividadModel;
  @Input() transiciones: WorkflowTransicionModel[];

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();
  @Output() saveTransicion = new EventEmitter();
  @Output() saveFunction = new EventEmitter();
  @Output() saveFunctionAll = new EventEmitter();
  @ViewChild('basico') basicoComponente: VisitaVerificacionBasicosComponent;
  @Input() public mostrarButtonsBackCancelar: Boolean = true;

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

  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  nuevaActa = false;
  showOnYes = false;
  request: string;
  currentAction: any;
  panelBasicoOpen: Boolean = false;
  private myInput = null;

  /**
   * Indice que permite identificar cual es la sección activa
   * del acordeón.
   */
  public currentStep = 0;

  /**
  * Método encargado de construir una instancia
  */
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
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
    this.request = '0';
    if (this.mantenimiento.intervenciones !== undefined) {
      this.showOnYes = this.mantenimiento.intervenciones[0].requiereActualizacionDiag;
      this.request = this.showOnYes ? '1' : '0';
    }
    this.formsBuilder();
  }

  selectionChangeStepper(event: any) {
    switch (event.selectedIndex) {
      case 1: // recursos
        this.crearDeFallasAintervencionFallas();
        break;
      case 2:
        this.setFotosIntervencion();
        break;
    }


    if (event && event.selectedStep &&
      event.selectedStep.stepLabel && event.selectedStep.stepLabel.template &&
      event.selectedStep.stepLabel.template._def &&
      event.selectedStep.stepLabel.template._def.element &&
      event.selectedStep.stepLabel.template._def.element.template &&
      event.selectedStep.stepLabel.template._def.element.template.nodes.length &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {

      switch (event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {
        case 'Datos Basicos de la Visita' :
          this.myInput = `DatosBasicosMat`;
          break;
        case 'Registro de la Visita ' :
          this.myInput = `RegistroVisitaFallasMat`;
          break;
        case 'Fotografías de la Visita ' :
          this.myInput = `RegistroVisitaFotosMat`;
          break;
        case 'Observaciones Y Fotografías de la Visita ' :
          this.myInput = `ObservacionesFotografiasMat`;
        break;
        case 'Observaciones de la Visita ' :
          this.myInput = `observacionesMat`;
        break;
        case 'Detalle de Gestión del Mantenimiento Vial ' :
          this.myInput = `DetalleGestionMat`;
          break;
        default:
          this.myInput = null;
      }
    } else { this.myInput = null; }
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.mantenimiento.intervenciones[0].requiereActualizacionDiag = this.showOnYes;
    this.saveFunction.emit({ mantenimiento: this.mantenimiento });
  }

  setFocus() {
    if (this.myInput !== null) {
      const targetElem = document.getElementById(this.myInput);
      targetElem.focus();
    }
  }

  saveSeccion() {
    this.saveFunctionAll.emit({ mantenimiento: this.mantenimiento });
  }

  getStatusSave() {
    if (this.showOnYes) {
      if (this.mantenimiento.intervenciones[0].id !== undefined && this.mantenimiento.intervenciones[0].id !== null) {
        this.formularioDatosBasicos.get('ctrlDatosBasicos').disable();
        if (this.mantenimiento.intervenciones[0].fallas !== null
          && this.mantenimiento.intervenciones[0].fallas.length > 0
          && this.mantenimiento.intervenciones[0].fallas[0].id !== undefined) {
          this.formularioRegistroFallas.get('ctrlRegistroFallas').disable();
          if (this.mantenimiento.intervenciones[0].chequeos !== null
            && this.mantenimiento.intervenciones[0].chequeos.length > 0
            && this.mantenimiento.intervenciones[0].chequeos[0].id !== undefined) {
            this.formularioObservacionesFotografias.get('ctrlObservacionesFotografias').disable();
            this.formularioDetalleGestion.get('ctrlDetalleGestion').disable();
            this.formularioEnvioGestion.get('ctrlEnvioGestion').disable();
          }
        }
      }

    } else {
      if (this.mantenimiento.intervenciones[0].id !== undefined && this.mantenimiento.intervenciones[0].id !== null) {
        this.formularioDatosBasicos.get('ctrlDatosBasicos').disable();
        if (this.mantenimiento.intervenciones[0].fallas !== null
          && this.mantenimiento.intervenciones[0].fallas.length > 0
          && this.mantenimiento.intervenciones[0].fallas[0].id !== undefined) {
          this.formularioRegistroFallas.get('ctrlRegistroFallas').disable();
          if (this.mantenimiento.intervenciones[0].fotos !== null
            && this.mantenimiento.intervenciones[0].fotos.length > 0
            && this.mantenimiento.intervenciones[0].fotos[0].id !== undefined) {
            this.formularioFotografias.get('ctrlFotografias').disable();
            if (this.mantenimiento.intervenciones[0].observaciones !== null) {
              this.formularioObservaciones.get('ctrlObservaciones').disable();
              this.formularioDetalleGestion.get('ctrlDetalleGestion').disable();
              this.formularioEnvioGestion.get('ctrlEnvioGestion').disable();
            }
          }
        }
      }
    }

  }

  saveLocal(event) {
    this.mantenimiento.intervenciones = event.intervenciones;
  }

  saveRegistro(event) {
    this.mantenimiento.intervenciones[this.mantenimiento.intervenciones.length - 1].requiereActualizacionDiag = this.showOnYes;
    this.mantenimiento = event.mantenimiento;
    this.saveSeccion();
  }

  saveObservaciones (event) {
    this.mantenimiento.intervenciones = event.intervenciones;
    this.saveSeccion();
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
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  answer(event) {
    if (event === '1') {
      this.showOnYes = true;
    } else {
      this.showOnYes = false;
    }
  }



  nuevaActaFunc() {
    this.nuevaActa = true;
    this.formsBuilder();
    if (this.mantenimiento.intervenciones === null || this.mantenimiento.intervenciones.length === 0) {
      this.mantenimiento.intervenciones = [];
      this.crearDeDiagnosticoAintervencionEncabezado();
    } else {
      // Definir update
      if (this.mantenimiento.intervenciones[0].activo === true) {
        this.crearDeDiagnosticoAintervencionEncabezado();
      }
    }
  }

  formsBuilder() {
    this.formularioDatosBasicos = this.formBuilder.group({
      ctrlDatosBasicos: [null, Validators.compose([Validators.required])]
    });

    this.formularioRegistroFallas = this.formBuilder.group({
      ctrlRegistroFallas: [null, Validators.compose([Validators.required])]
    });

    if (this.showOnYes) {

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
    // Pendiente definir como calcular tipoEjecucion
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
    intervencionEncabezado.nroActa = this.addLeftPaddingZeros(this.mantenimiento.intervenciones.length + 1);
    // inicializa fallas
    intervencionEncabezado.fallas = [];
    // inicializa fotos
    intervencionEncabezado.fotos = [];
    // Se pasa la intervencion al mantenimiento
    this.mantenimiento.intervenciones.unshift(intervencionEncabezado);
  }

  actualizarIntervencionEncabezado(intervencionEncabezadoModificado: Intervencion) {
    intervencionEncabezadoModificado.requiereActualizacionDiag = this.showOnYes;
    this.mantenimiento.intervenciones[0] = intervencionEncabezadoModificado;
  }

  crearDeFallasAintervencionFallas(): void {
    if (this.mantenimiento.intervenciones[0].fallas.length === 0) {
      let numnero = 0;


      if (this.mantenimiento.diagnostico !== null ){
        if (this.mantenimiento.diagnostico.fallas !== null) {
          this.mantenimiento.diagnostico.fallas.forEach(falla => {
            const item = new IntervencionFalla();
            const intervEncabezado = new IntervencionEncabezado();
            intervEncabezado.id = this.mantenimiento.intervenciones[0].id;
            item.intervencionEncabezado = intervEncabezado;
            const diagnosticoFalla = new DiagnosticoFallaModel();
            diagnosticoFalla.id = falla.id;
            item.diagnosticoFalla = diagnosticoFalla;
            item.numero = ++numnero;
            item.ancho = falla.ancho;
            item.areaFalla = falla.area;
            item.longitud = falla.longitud;
            item.tipoFalla = falla.tipoFalla;
            item.tipoSuperficie = falla.tipoSuperficie;
            item.tipoIntervencion = falla.tipoIntervencion;
            this.mantenimiento.intervenciones[0].fallas.push(item);
          });
         }
      }
    }
  }

  setFotosIntervencion() {
    if (this.mantenimiento.intervenciones[0].fotos.length === 0) {
      let numnero = 0;
      for (const diagnosticoFoto of this.mantenimiento.diagnostico.fotos) {
        const intervencionFoto = new IntervencionFoto();
        intervencionFoto.fechaRegistro = diagnosticoFoto.fechaRegistro;
        intervencionFoto.numeroFoto = ++numnero;
        intervencionFoto.archivo = diagnosticoFoto.archivo;
        const intervencionEncabezado = new IntervencionEncabezado();
        intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
        intervencionFoto.intervencionEncabezado = intervencionEncabezado;
        this.mantenimiento.intervenciones[0].fotos.push(intervencionFoto);
      }
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
          this.currentAction = 'list';
          this.back.emit({ currentAction: 'list' });
        }
      }
    );
  }

  // executeTransition(event): void {
  //   this.data.mantenimiento = this.mantenimiento;
  //   this.data.mantenimiento.intervenciones[0].activo = true;
  //   this.saveTransicion.emit(this.data);
  // }

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

  addLeftPaddingZeros(numero: number): string {
    let numeroAux = numero.toString();
    while (numeroAux.length < 4) {
      numeroAux = '0' + numeroAux;
    }
    return numeroAux;
  }

}
