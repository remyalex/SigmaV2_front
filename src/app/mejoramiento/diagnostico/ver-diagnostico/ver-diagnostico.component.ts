import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CONST_WORKFLOW_DIAGNOSTICO } from 'src/app/workflow/forms/diagnostico/shared/diagnostico.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiagnosticoFactorModel } from '../models/diagnostico.factor.model';
import { MatTableDataSource, MatSnackBar, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialog } from '@angular/material';
import { DiagnosticoFotoModel } from '../models/diagnostico.foto.model';
import { DiagnosticoUnidadMuestraModel } from '../models/diagnostico.unidadMuestreo.model';
import { DiagnosticoFallaModel } from '../models/diagnostico.falla.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { DiagnosticoPriorizacionModel } from '../models/diagnostico.priorizacion.model';
import { DiagnosticoModel } from '../models/diagnostico.model';
import { DiagnosticoEncabezadoModel } from '../models/diagnostico.encabezado.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { MapService } from 'src/app/shared/services/map.service';

/** Componente encargado de gestionar la visualización
 * de datos del formulario de diagnóstico */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-ver-diagnostico',
  templateUrl: './ver-diagnostico.component.html',
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ]
})
export class VerDiagnosticoComponent implements OnInit {

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Bandera que permite establecer si el comportamiento del
   * acordeón de los formularios es tipo lineal o no lo es */
  @Input() isLinear: Boolean = true;
  /** Bandera que permite identificar si el formulario se encuentra siendo procesado */
  loading = false;
  /** Mantenimiento en el cual se realizará el diagnóstico */
  @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  /** Bandera de ingreso que permite identificar si el boton atrás se debe presentar o no */
  @Input() mostrarButtonsBackCancelar: Boolean = true;
  /** Formulario origen */
  @Input() formularioOrigen: String = '';

  /** Columnas a presentar en la grilla de otros factores del formulario */
  columnasTablaFactores = ['tipoFactor'];
  /** Columnas a presentar en la grilla de fotos del formulario */
  columnasTablaFotos = ['consecutivoFoto', 'nombreFoto', 'fotos'];
  /** Columnas a presentar en la grilla de muestreos del formulario */
  columnasTablaMuestreos = ['id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci'];
  /** Columnas a presentar en la grilla de fallas del formulario */
  columnasTablaFallas = ['tipoFalla', 'severidadFalla', 'tipoIntervencion', 'longitudFalla', 'anchoFalla', 'areaFalla'];

  /** Variable usada para agrupar los elementos de la sección
   * de encabezado del formulario */
  formularioEncabezado: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de priorización del formulario */
  formularioPriorizacion: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de otros factores del formulario */
  formularioOtrosFactores: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de unidades de muestreos del formulario */
  formularioMuestreos: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de fallas del formulario */
  formularioFallas: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de fotos del formulario */
  formularioFotos: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de actividades del formulario */
  formularioActividades: FormGroup;
  /** Variable usada para agrupar los elementos de la sección
   * de transiciones del formulario */
  formularioTransicion: FormGroup;

  /** constante de valor True */
  valueTrue = true;
  /** constante de valor Falso */
  valueFalse = false;
  /** constante de valor nulo por defecto */
  valorDefault = null;

  /**
   * Bandera usada para identificar si el formulario
   * debe o no presentar la sección de fallas al usuario
   **/
  public visibilidadFallas = false;

  /**
   * Bandera usada para identificar si el formulario
   * debe o no presentar la sección de muestras al usuario
   **/
  public visibilidadMuestreo = false;

  /** Bandera que permite identificar si el formulario se
   * encuentra en modo de edición o no */
  public moduloEdicion = false;

  /** Fuente de datos usada para gestionar los otros factores en el formulario */
  factoresDatasource: MatTableDataSource<DiagnosticoFactorModel>;
  /** Fuente de datos usada para gestionar las fotos en el formulario */
  fotosDatasource: MatTableDataSource<DiagnosticoFotoModel>;
  /** Fuente de datos usada para gestionar las unidades de muestreos en el formulario */
  muestreosDatasource: MatTableDataSource<DiagnosticoUnidadMuestraModel>;
  /** Fuente de datos usada para gestionar las fallas en el formulario */
  fallasDatasource: MatTableDataSource<DiagnosticoFallaModel>;

  /** Url de la cual se gestiona el mapa */
  private urlImagenMapa: string;
  /** Variable usada para suscribir al evento de cambios en el mapa */
  private subscribeToUrlMap: any;

  /** Bandera que permite identificar si se encuentra
   * procesando archivo de acta de diagnóstico */
  downLoadFile = false;

  private myInput = null;

  /**
   * Indice que permite identificar cual es la sección activa
   * del acordeón.
   */
  public currentStep = 0;

  anchoPkDecimales: number;
  areaPKDecimales: number;


  /**
  * Método encargado de construir una instancia de componente
  *
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param router Componente usado para recibir parametros por URL
  * @param mantenimientoService Componente de servicio usado para gestión de mantenimientos
  * @param workflowService Componente de servicio usado para gestión de workflow
  * @param mapService Componente de servicio usado para gestionar del mapa
  */
  constructor(
    private formBuilder: FormBuilder,
    private mantenimientoService: MantenimientoService,
    private snackBar: MatSnackBar,
    private workflowService: WorkflowService,
    private dialog: MatDialog,
    private router: Router,
    private mapService: MapService
  ) {

    this.formularioTransicion = formBuilder.group({
      'transicion': [null, Validators.compose([Validators.required])],
    });

    this.formularioEncabezado = this.formBuilder.group({
      'id': [null],
      'pk': [{ value: null, disabled: true }],
      'localidadNombre': [{ value: null, disabled: true }],
      'barrioNombre': [{ value: null, disabled: true }],
      'civ': [{ value: null, disabled: true }],
      'nomZona': [{ value: null, disabled: true }],
      'ejeVial': [{ value: null, disabled: true }],
      'desde': [{ value: null, disabled: true }],
      'hasta': [{ value: null, disabled: true }],
      'uplaNombre': [{ value: null, disabled: true }],
      'tieneRutasTransporte': [{ value: null, disabled: true }],
      'seccionVial': [{ value: null, disabled: true }],
      'solicitante': [{ value: null, disabled: true }],
      'usoVia': [{ value: null, disabled: true }],
      'tipoMalla': [{ value: null, disabled: true }],
      'transitabilidad': [{ value: null, disabled: true }],
      'programa': [{ value: null, disabled: true }],
      'tipoSuperficie': [{ value: null, disabled: true }],
      'tipoIntervencionTotal': [{ value: null, disabled: true }],
      'calzadaAncho': [{ value: null, disabled: true }],
      'calzadaArea': [{ value: null, disabled: true }],
      'solicitudFecha': [{ value: null, disabled: true }],
      'fechaVisitaTecnica': [{ value: null, disabled: true }],
      'indicePriorizacion': [{ value: null, disabled: true }],
      'calificacionPci': [{ value: null, disabled: true }],
      'origen': [{ value: null, disabled: true }],
    });

    this.formularioPriorizacion = this.formBuilder.group({
      'aporteCumplimiento': [{ value: null, disabled: true }],
      'coordinacionInterinstitucional': [{ value: null, disabled: true }],
      'tipoIntervencion': [{ value: null, disabled: true }],
      'impactoSocial': [{ value: null, disabled: true }],
      'observaciones': [{ value: null, disabled: true }],
      'PriorizacionId': [{ value: null, disabled: true }],
    });

    this.formularioOtrosFactores = this.formBuilder.group({
      'cantidadFactores': [{ value: null, disabled: true }],
      'encabezadoId': [{ value: null, disabled: true }],
    });

    this.formularioMuestreos = this.formBuilder.group({
      'cantidadMuestras': [{ value: null, disabled: true }],
      'encabezadoId': [{ value: null, disabled: true }],
    });

    this.formularioFallas = this.formBuilder.group({
      'cantidadFallas': [{ value: null, disabled: true }],
      'encabezadoId': [{ value: null, disabled: true }],
    });

    this.formularioFotos = this.formBuilder.group({
      'fotos': [{ value: null, disabled: true }],
    });

    this.factoresDatasource = new MatTableDataSource<DiagnosticoFactorModel>();
    this.fotosDatasource = new MatTableDataSource<DiagnosticoFotoModel>();
    this.muestreosDatasource = new MatTableDataSource<DiagnosticoUnidadMuestraModel>();
    this.fallasDatasource = new MatTableDataSource<DiagnosticoFallaModel>();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.subscribeToUrlMap) {
      this.subscribeToUrlMap.unsubscribe();
    }

    this.subscribeToUrlMap = this.mapService.getVisor().imageUrlParameters$.subscribe(url => {
      this.urlImagenMapa = url;
      this.mantenimiento.posicionesBox = this.mapService.extraerPosicionesBoxImagenMapa(this.mantenimiento.posicionesBox, url);
    });

    this.loading = true;
    //    this.mantenimientoService.detailByPk(this.mantenimiento.pk).subscribe(data => {
    this.mantenimientoService.mantenimientoById(this.mantenimiento.id).subscribe(data => {
      this.mantenimiento = data;
      if (this.mantenimiento.diagnostico) {
        if (!this.mantenimiento.diagnostico.priorizacion) {
          this.mantenimiento.diagnostico.priorizacion = new DiagnosticoPriorizacionModel();
        }
      }

      this.anchoPkDecimales = parseFloat(parseFloat(this.mantenimiento.ancho + '').toFixed(2));
      this.areaPKDecimales = parseFloat(parseFloat(this.mantenimiento.area + '').toFixed(2));

      this.work(this.mantenimiento);
    }, error => {
      this.snackBar.open(this.constants.mantenimientoSinDiagnostico, 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
      this.loading = false;
    });
  }


  public onStepChange(event: any) {
    if (event && event.selectedStep &&
      event.selectedStep.stepLabel && event.selectedStep.stepLabel.template &&
      event.selectedStep.stepLabel.template._def &&
      event.selectedStep.stepLabel.template._def.element &&
      event.selectedStep.stepLabel.template._def.element.template &&
      event.selectedStep.stepLabel.template._def.element.template.nodes.length &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text &&
      event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {

      switch (event.selectedStep.stepLabel.template._def.element.template.nodes[0].text.prefix) {
        case 'Encabezado':
          this.myInput = `EncabezadoMat`;
          break;
        case 'Unidades de muestreo':
          this.myInput = `MuestreosMat`;
          break;
        case 'Fallas':
          this.myInput = `FallasMat`;
          break;
        case 'Otros factores':
          this.myInput = `OtrosFactoresMat`;
          break;
        case 'Fotos':
          this.myInput = `FotosMat`;
          break;
        case 'Modelo de priorización':
          this.myInput = `PriorizacionMat`;
          break;
        default:
          this.myInput = null;
      }
    } else { this.myInput = null; }
  }

  setFocus() {
    if (this.myInput !== null) {
      const targetElem = document.getElementById(this.myInput);
      targetElem.focus();
    }
  }




  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo PDF
   */
  exportarPDF() {

    this.downLoadFile = true;
    if (this.formularioOrigen === '') {

      this.mantenimientoService.exportarPDF(this.mantenimiento.id, this.urlImagenMapa, 'reporteVisitaDiagnostico').subscribe(data => {
        const body = data;
        const type = body.headers.get('Content-Type');
        const a = document.createElement('a');
        document.body.appendChild(a);
        const blob = new Blob([body.body], { type: type });
        const url = window.URL.createObjectURL(blob);
        let nombreArchivo = '';
        a.href = url;
        nombreArchivo = 'actaVisitaTecnica_';
        a.download = nombreArchivo + this.mantenimiento.id + '.pdf';
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 0);
        this.downLoadFile = false;
      },
        error => {
          console.log('Error: ' + error);
          this.downLoadFile = false;
        }
      );
    } else {

      this.mantenimientoService.exportarPDFFormularioOrigen(
        this.mantenimiento.id, this.urlImagenMapa, 'reporteVisitaDiagnostico',
        this.formularioOrigen).subscribe(data => {
          const body = data;
          const type = body.headers.get('Content-Type');
          const a = document.createElement('a');
          document.body.appendChild(a);
          const blob = new Blob([body.body], { type: type });
          const url = window.URL.createObjectURL(blob);
          let nombreArchivo = '';
          a.href = url;
          nombreArchivo = 'actaVisitaTecnica_';
          a.download = nombreArchivo + this.mantenimiento.id + '.pdf';
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 0);
          this.downLoadFile = false;
        },
          error => {
            console.log('Error: ' + error);
            this.downLoadFile = false;
          });

    }
  }

  /**
   * Método encargado de gestionar la acción del usuario
   * sobre el boton de acciones individuales del pk presentado en la grilla
   *
   * @param mantenimiento Objeto de tipo manteniento con la información del
   * registro seleccionado en la grilla
   **/
  work(mantenimiento: WorkflowMantenimientoModel) {
    this.workflowService.work(mantenimiento.id, mantenimiento.actividadActual.id).subscribe((data) => {
      this.loading = false;
      this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
      this.factoresDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.factores : [];
      if (typeof this.fotosDatasource === 'undefined') {
        this.fotosDatasource = new MatTableDataSource<DiagnosticoFotoModel>();
      }
      this.fotosDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.fotos : [];
      this.muestreosDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.muestreos : [];
      this.fallasDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.fallas : [];

      this.habilitarSeccionesXtipoSuperficie();

      if (this.mantenimiento.diagnostico == null) {
        this.mantenimiento.diagnostico = new DiagnosticoModel();
      }

      if (this.mantenimiento.diagnostico.encabezado == null) {
        this.mantenimiento.diagnostico.encabezado = new DiagnosticoEncabezadoModel();
      }

      if (this.mantenimiento.diagnostico.priorizacion == null) {
        this.mantenimiento.diagnostico.priorizacion = new DiagnosticoPriorizacionModel();
      }

      if (this.mantenimiento.diagnostico.factores == null) {
        this.mantenimiento.diagnostico.factores = [];
      } else {
        this.factoresDatasource.data = this.mantenimiento.diagnostico.factores;
      }

      if (this.mantenimiento.diagnostico.muestreos == null) {
        this.mantenimiento.diagnostico.muestreos = [];
      } else {
        this.muestreosDatasource.data = this.mantenimiento.diagnostico.muestreos;
      }

      if (this.mantenimiento.diagnostico.fallas == null) {
        this.mantenimiento.diagnostico.fallas = [];
      } else {
        this.fallasDatasource.data = this.mantenimiento.diagnostico.fallas;
      }
    },
      error => {
        this.loading = false;
      });
  }

  /**
   * Método encargado de habilitar o deshabilitar las
   * secciones del formulario según el tipo de superficie seleccionado
   **/
  habilitarSeccionesXtipoSuperficie(): void {
    if (this.mantenimiento != null && this.mantenimiento.diagnostico != null && this.mantenimiento.diagnostico.encabezado != null
      && this.mantenimiento.tipoSuperficie != null) {
      switch (this.mantenimiento.tipoSuperficie.descripcion) {

        case 'RÍGIDO':
          this.columnasTablaMuestreos = [
            'id', 'ancho', 'area', 'numeroLosas', 'abscisaInicial', 'abscisaFinal', 'pci'
          ];
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = true;
          this.columnasTablaFallas = [
            'unidadMuestreoFalla', 'tipoFalla', 'severidadFalla', 'tipoIntervencion', 'longitudFalla', 'anchoFalla', 'areaFalla'
          ];
          break;
        case 'FLEXIBLE':
        case 'ADOQUÍN CONCRETO':
        case 'ADOQUÍN ARCILLA':
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = true;
          this.columnasTablaMuestreos = [
            'id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci'
          ];
          this.columnasTablaFallas = ['unidadMuestreoFalla', 'tipoFalla', 'severidadFalla', 'tipoIntervencion',
            'longitudFalla', 'anchoFalla', 'areaFalla'];
          break;

        case 'MIXTOS':
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = false;
          this.columnasTablaFallas = ['tipoFalla', 'severidadFalla', 'tipoIntervencion',
            'longitudFalla', 'anchoFalla', 'areaFalla'];
          break;

        default:
          this.visibilidadFallas = false;
          this.visibilidadMuestreo = false;
          this.columnasTablaFallas = ['unidadMuestreoFalla', 'tipoFalla', 'severidadFalla', 'tipoIntervencion',
            'longitudFalla', 'anchoFalla', 'areaFalla'];
          break;
      }
    }
  }

  /** Método encargado de devolver a la pagina principal el componente */
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
          this.mapService.getVisor().visible = true;
          this.back.emit({ currentAction: 'list' });
        }
      }
    );
  }

}
