import { ListaItem } from './../../../administracion/listas-items/models/listas-items.model';
import { Tipointervencion } from './../../../administracion/tipointervencion/models/tipointervencion.model';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CONST_WORKFLOW_DIAGNOSTICO } from 'src/app/workflow/forms/diagnostico/shared/diagnostico.constants';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DiagnosticoFactorModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.factor.model';
import { DiagnosticoUnidadMuestraModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.unidadMuestreo.model';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { DiagnosticoFotoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.foto.model';
import { CountMaxElementsValidator, CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { DiagnosticoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DiagnosticoPriorizacionModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.priorizacion.model';
import { FactoresComponent } from 'src/app/workflow/forms/diagnostico/shared/factores/factores.component';
import { FotosComponent } from 'src/app/workflow/forms/diagnostico/shared/fotos/fotos.component';
import { FactoresEditComponent } from 'src/app/workflow/forms/diagnostico/shared/factoresEdit/factoresEdit.component';
import { MuestreosComponent } from 'src/app/workflow/forms/diagnostico/shared/muestreos/muestreos.component';
import { MuestreosEditComponent } from 'src/app/workflow/forms/diagnostico/shared/muestreosEdit/muestreosEdit.component';
import { FallasComponent } from 'src/app/workflow/forms/diagnostico/shared/fallas/fallas.component';
import { FallasEditComponent } from 'src/app/workflow/forms/diagnostico/shared/fallasEdit/fallasEdit.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Router } from '@angular/router';
import { MapService } from 'src/app/shared/services/map.service';
import { DiagnosticoEncabezadoModel } from '../models/diagnostico.encabezado.model';

/** Componente encargado de gestionar la edición de datos del formulario de diagnóstico */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-diagnostico-editar',
  templateUrl: './editar-diagnostico.component.html'
})
export class EditarDiagnosticoComponent implements OnInit {

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param router Componente usado para recibir parametros por URL
   * @param mantenimientoServices Componente de servicio usado para gestión de mantenimientos
   * @param workflowService Componente de servicio usado para gestión de workflow
   * @param mapService Componente de servicio usado para gestionar del mapa
   */
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService,
    private mantenimientoServices: MantenimientoService,
    private workflowService: WorkflowService,
    private snackBar: MatSnackBar,
    private router: Router,
    private mapService: MapService
  ) {
  }

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;

  /**
   * Variable usada para recibir en la invocación del componente
   * la actividad del mantenimiento
   **/
  @Input() data: WorkflowMantenimientoActividadModel;

  /** Mantenimiento en el cual se realizará el diagnóstico */
  @Input() mantenimiento: WorkflowMantenimientoModel;

  /** Mantenmiento actualizado que devuelve el componente */
  @Output() mantenimientoSalida = new EventEmitter();

  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;
  /**
   * Bandera usada para identificar si el formulario
   * debe o no presentar la sección de fallas al usuario
   **/
  visibilidadFallas: Boolean = false;
  /**
   * Bandera usada para identificar si el formulario
   * debe o no presentar la sección de muestras al usuario
   **/
  visibilidadMuestreo: Boolean = false;
  /** Clón del objeto que se va a modificar información */
  clone: WorkflowMantenimientoModel;
  /**
   * Array de las unidades de muestras actualizadas
   * en el formulario por parte del usuario.
   **/
  muestreosActualizados: Array<any>;

  /** Variable usada para agrupar los elementos del formulario */
  forms: FormGroup[] = [];
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

  // Datasources
  /** Fuente de datos usada para gestionar los otros factores en el formulario */
  factoresDatasource: MatTableDataSource<DiagnosticoFactorModel> = new MatTableDataSource<DiagnosticoFactorModel>();
  /** Fuente de datos usada para gestionar las fotos en el formulario */
  fotosDatasource: MatTableDataSource<DiagnosticoFotoModel> = new MatTableDataSource<DiagnosticoFotoModel>();
  /** Fuente de datos usada para gestionar las unidades de muestreos en el formulario */
  muestreosDatasource: MatTableDataSource<DiagnosticoUnidadMuestraModel> = new MatTableDataSource<DiagnosticoUnidadMuestraModel>();
  /** Fuente de datos usada para gestionar las fallas en el formulario */
  fallasDatasource: MatTableDataSource<DiagnosticoFallaModel> = new MatTableDataSource<DiagnosticoFallaModel>();

  /** Columnas a presentar en la grilla de otros factores del formulario */
  columnasTablaFactores = ['tipoFactor', 'acciones'];
  /** Columnas a presentar en la grilla de fotos del formulario */
  columnasTablaFotos = ['consecutivoFoto', 'nombreFoto', 'fotos', 'acciones'];
  /** Columnas a presentar en la grilla de muestreos del formulario */
  columnasTablaMuestreos = ['id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci', 'acciones'];
  /** Columnas a presentar en la grilla de fallas del formulario */
  columnasTablaFallas = ['tipoFalla', 'severidadFalla', 'longitudFalla', 'anchoFalla', 'areaFalla', 'acciones'];

  /** Cantidad máxima de fotos permitidas */
  maxFotos = 6;
  /** Cantidad mínima de fotos permitidas */
  minFotos = 2;

  /** Url de la cual se gestiona el mapa */
  private urlImagenMapa: string;
  /** Variable usada para suscribir al evento de cambios en el mapa */
  private subscribeToUrlMap: any;
  /** Path del cual se obtendrá el listado de tipos de
   * intervención segun tipo Superficie */
  public pathTipoIntervencion: string;
  /** Bandera que permite controlar si se presentará o
   * no el tipo de intervención en el encabezado */
  public presentarTipoIntervencion = true;
  /** Bandera que permite identificar si el componente
   * ya se encuentra inicializado */
  public inicializando = true;

  /**
   * Indice que permite identificar cual es la sección activa
   * del acordeón.
   */
  public currentStep = 0;

  /** Tiempo de latencia de carga del acordeón */
  public tiempoLatencia = 5;

  /** Bandera que permite identificar si se encuentra
   * procesando archivo de acta de diagnóstico */
  downLoadFile = false;

  private myInput = null;

  anchoPkDecimales: number;
  areaPKDecimales: number;

  /**
   * Método encargado de inicializar el componente y
   * cada una de las secciones del diagnóstico
   **/
  ngOnInit() {

    if (this.subscribeToUrlMap) {
      this.subscribeToUrlMap.unsubscribe();
    }

    this.subscribeToUrlMap = this.mapService.getVisor().imageUrlParameters$.subscribe(url => {
      this.urlImagenMapa = url;
      this.mantenimiento.posicionesBox = this.mapService.extraerPosicionesBoxImagenMapa(this.mantenimiento.posicionesBox, url);
    });

    this.mapService.getVisor().updateImageUrlParameters(this.mantenimiento.pk);

    console.log('iniciado el editar-diagnostico');

    this.muestreosActualizados = new Array<any>();
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
    this.mantenimientoSalida.emit({ mantenimiento: JSON.stringify(this.clone) });

    this.factoresDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.factores : [];
    this.fotosDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.fotos : [];
    this.muestreosDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.muestreos : [];
    this.fallasDatasource.data = this.mantenimiento.diagnostico ? this.mantenimiento.diagnostico.fallas : [];

    this.formularioEncabezado = this.formBuilder.group({
      id: [null],
      pk: [{ value: null, disabled: true }],
      localidadNombre: [{ value: null, disabled: true }],
      barrioNombre: [{ value: null, disabled: true }],
      civ: [{ value: null, disabled: true }],
      nomZona: [{ value: null, disabled: true }],
      ejeVial: [null, Validators.compose([Validators.required])],
      desde: [null, Validators.compose([Validators.required])],
      hasta: [null, Validators.compose([Validators.required])],
      uplaNombre: [{ value: null, disabled: true }],
      tieneRutasTransporte: [null, Validators.compose([Validators.required])],
      seccionVial: [{ value: null, disabled: true }],
      solicitante: [{ value: null, disabled: true }],
      usoVia: [null, Validators.compose([Validators.required])],
      tipoMalla: [{ value: null, disabled: true }],
      transitabilidad: [null, Validators.compose([Validators.required])],
      programa: [null],
      tipoSuperficie: [null, Validators.compose([Validators.required])],
      tipoIntervencionTotal: [null],
      calzadaAncho: [{ value: null, disabled: true }],
      calzadaArea: [{ value: null, disabled: true }],
      solicitudFecha: [{ value: null, disabled: true }],
      indicePriorizacion: [{ value: null, disabled: true }],
      calificacionPci: [{ value: null, disabled: true }],
      encabezadoId: [null, Validators.required],
      fechaVisitaTecnica: [{ value: null, disabled: true }],
      origen: [{ value: null, disabled: true }],
    });

    this.formularioPriorizacion = this.formBuilder.group({
      aporteCumplimiento: [null, Validators.compose([Validators.required])],
      coordinacionInterinstitucional: [
        null,
        Validators.compose([Validators.required])
      ],
      tipoIntervencion: [null, Validators.compose([Validators.required])],
      impactoSocial: [null, Validators.compose([Validators.required])],
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(700)])],
      PriorizacionId: [null, Validators.compose([Validators.min(1)])]
    });

    this.formularioOtrosFactores = this.formBuilder.group({
      encabezadoId: [null, Validators.compose([Validators.min(1)])]
    });

    this.formularioMuestreos = this.formBuilder.group({
      cantidadMuestras: [null, Validators.compose([Validators.min(1)])],
      encabezadoId: [null, Validators.compose([Validators.min(1)])]
    });

    this.formularioFallas = this.formBuilder.group({
      cantidadFallas: [null, Validators.compose([Validators.min(1)])],
      encabezadoId: [null, Validators.compose([Validators.min(1)])]
    });

    this.formularioFotos = this.formBuilder.group({
      fotos: [
        null,
        Validators.compose([
          Validators.required,
          CountMaxElementsValidator(this.maxFotos),
          CountMinElementsValidator(this.minFotos)
        ])
      ]
    });

    this.formularioActividades = this.formBuilder.group({});

    this.forms.push(this.formularioEncabezado);
    this.forms.push(this.formularioPriorizacion);
    this.forms.push(this.formularioOtrosFactores);
    this.forms.push(this.formularioMuestreos);
    this.forms.push(this.formularioFallas);
    this.forms.push(this.formularioFotos);
    this.forms.push(this.formularioActividades);

    this.habilitarSeccionesXtipoSuperficie();
    this.downLoadFile = false;

    this.anchoPkDecimales = parseFloat(parseFloat(this.mantenimiento.ancho + '').toFixed(2));
    this.areaPKDecimales = parseFloat(parseFloat(this.mantenimiento.area + '').toFixed(2));

  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un factor.
   */
  addFactor(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      factores: this.mantenimiento.diagnostico.factores,
      datasource: this.factoresDatasource
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FactoresComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de una nueva foto.
   */
  addFotos(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      fotos: this.mantenimiento.diagnostico.fotos,
      datasource: this.fotosDatasource,
      foto: new DiagnosticoFotoModel()
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FotosComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la edición de un factor.
   *
   * @param factor Objeto con los valores actualizados que se modificarán
   */
  editarFactor(factor: DiagnosticoFactorModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      factores: this.mantenimiento.diagnostico.factores,
      datasource: this.factoresDatasource,
      factor: factor
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FactoresEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la edición de una foto.
   *
   * @param foto Objeto con los valores actualizados que se modificarán
   */
  editarFoto(foto: DiagnosticoFotoModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      fotos: this.mantenimiento.diagnostico.fotos,
      datasource: this.fotosDatasource,
      foto: foto
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FotosComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de una nueva unidad de muestreo.
   */
  addUnidadMuestreo(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      datasource: this.muestreosDatasource
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(MuestreosComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la edición de una unidad de muestreo.
   *
   * @param unidad Objeto con los valores actualizados que se modificarán
   * @param index Indice de la posición del item a modificar
   */
  editarMuestreo(unidad: DiagnosticoUnidadMuestraModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      datasource: this.muestreosDatasource,
      muestreo: unidad,
      index: index,
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(MuestreosEditComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.mantenimiento.diagnostico.fallas = val.fallas;
        this.fallasDatasource.data = this.mantenimiento.diagnostico.fallas;
      }
    });
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un nuevo registro de falla.
   */
  addFalla(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      datasource: this.fallasDatasource,
      muestras: this.mantenimiento.diagnostico.muestreos
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FallasComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(falla => {
      if (falla) {
        this.data.mantenimiento.diagnostico.fallas.push(falla);
        this.muestreosDatasource.data.forEach(muestra => {
          if (muestra.id === falla.unidadMuestreo.id) {
            muestra.registrosDependientes = true;
          }
        });
      }
    });
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la edición un registro de falla.
   *
   * @param falla Objeto con los valores actualizados que se modificarán
   * @param index Indice de la posición del item a modificar
   */
  editarFalla(falla: DiagnosticoFallaModel, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mantenimiento: this.mantenimiento,
      datasource: this.fallasDatasource,
      muestras: this.data.mantenimiento.diagnostico.muestreos,
      falla: falla,
      index: index,
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FallasEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado de eliminación
   * de un registro de otros factores
   *
   * @param index Indice de la posición del item a eliminar
   */
  removeFactor(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.constants.confirmar;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mantenimiento.diagnostico.factores.splice(index, 1);
        this.factoresDatasource.data = this.mantenimiento.diagnostico.factores;
      }
    });
  }

  /**
   * Método encargado de realizar el llamado de eliminación
   * de un registro de foto
   *
   * @param index Indice de la posición del item a eliminar
   */
  removeFoto(index: number) {
    this.mantenimiento.diagnostico.fotos.splice(index, 1);
    this.fotosDatasource.data = this.mantenimiento.diagnostico.fotos;
    this.formularioFotos
      .get('fotos')
      .setValue(this.mantenimiento.diagnostico.fotos);
  }

  /**
   * Método encargado de realizar el llamado de eliminación
   * de un registro de unidad de muestreo
   *
   * @param index Indice de la posición del item a eliminar
   */
  removeUnidadMuestreo(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.constants.confirmar;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mantenimiento.diagnostico.muestreos.splice(index, 1);
        this.muestreosDatasource.data = this.mantenimiento.diagnostico.muestreos;
      }
    });
  }

  /**
   * Método encargado de realizar el llamado de eliminación
   * de un registro de falla
   *
   * @param index Indice de la posición del item a eliminar
   */
  removeFalla(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.constants.confirmar;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        if (this.mantenimiento.diagnostico.fallas[index].unidadMuestreo == null) {
          this.mantenimiento.diagnostico.fallas.splice(index, 1);
          this.fallasDatasource.data = this.mantenimiento.diagnostico.fallas;
          return;
        }

        const IdMuestra = this.mantenimiento.diagnostico.fallas[index].unidadMuestreo.id;
        this.mantenimiento.diagnostico.fallas.splice(index, 1);
        this.fallasDatasource.data = this.mantenimiento.diagnostico.fallas;
        const cantidadesPendientes =
          this.mantenimiento.diagnostico.fallas.filter(m => m.unidadMuestreo.id === IdMuestra).length +
          this.data.mantenimiento.diagnostico.fallas.filter(m => m.unidadMuestreo.id === IdMuestra).length;

        this.muestreosDatasource.data.forEach(muestra => {
          if (muestra.id === IdMuestra) {
            muestra.registrosDependientes = cantidadesPendientes > 0 ? true : false;
          }
        });
      }

    });
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo PDF
   */
  exportarPDF() {

    this.downLoadFile = true;
    this.mantenimientoServices.exportarPDF(this.mantenimiento.id, this.urlImagenMapa, 'reporteVisitaDiagnostico').subscribe(data => {
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

  }

  /**
   * Método encargado de gestionar el guardado de todas las secciones del
   * formulario y finaliza enviando a la siguiente transición
   */
  saveAll(): void {
    this.processing = true;
    let esValido: boolean;
    esValido =
      this.validate(this.formularioEncabezado) &&
      this.validate(this.formularioFotos) &&
      this.validate(this.formularioPriorizacion);

    if (esValido) {
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.encabezado = this.mantenimiento.diagnostico.encabezado;
      this.data.mantenimiento.pk = this.mantenimiento.pk;
      this.data.mantenimiento.localidad = this.mantenimiento.localidad;
      this.data.mantenimiento.barrio = this.mantenimiento.barrio;
      this.data.mantenimiento.civ = this.mantenimiento.civ;
      this.data.mantenimiento.ejeVial = this.mantenimiento.ejeVial;
      this.data.mantenimiento.ancho = this.mantenimiento.ancho;
      this.data.mantenimiento.area = this.mantenimiento.area;
      this.data.mantenimiento.zona = this.mantenimiento.zona;
      this.data.mantenimiento.desde = this.mantenimiento.desde;
      this.data.mantenimiento.hasta = this.mantenimiento.hasta;
      this.data.mantenimiento.upla = this.mantenimiento.upla;
      this.data.mantenimiento.programa = this.mantenimiento.programa;
      this.data.mantenimiento.indicePriorizacion = this.mantenimiento.indicePriorizacion;
      this.data.mantenimiento.tipoSeccionVial = this.mantenimiento.tipoSeccionVial;
      this.data.mantenimiento.solicitudFecha = this.mantenimiento.solicitudFecha;
      this.data.mantenimiento.rutasTransporte = this.mantenimiento.rutasTransporte;
      this.data.mantenimiento.tipoMalla = this.mantenimiento.tipoMalla;
      this.data.mantenimiento.tipoSuperficie = this.mantenimiento.tipoSuperficie;
      this.data.mantenimiento.transitabilidad = this.mantenimiento.transitabilidad;
      this.data.mantenimiento.tipoUsoVia = this.mantenimiento.tipoUsoVia;
      this.data.mantenimiento.posicionesBox = this.mantenimiento.posicionesBox;
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.priorizacion = this.mantenimiento.diagnostico.priorizacion;
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.factores = this.mantenimiento.diagnostico.factores;
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.muestreos = this.mantenimiento.diagnostico.muestreos;
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.fallas = this.mantenimiento.diagnostico.fallas;
      if (this.data.mantenimiento.diagnostico == null) {
        this.data.mantenimiento.diagnostico = new DiagnosticoModel();
      }
      this.data.mantenimiento.diagnostico.fotos = this.mantenimiento.diagnostico.fotos;

      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
          this.clone = JSON.parse(JSON.stringify(data.mantenimiento));
          if (this.mantenimiento.diagnostico.priorizacion == null) {
            this.mantenimiento.diagnostico.priorizacion = new DiagnosticoPriorizacionModel();
          }
          if (this.mantenimiento.diagnostico.muestreos != null) {
            this.muestreosDatasource.data = this.mantenimiento.diagnostico.muestreos;
          }
          this.mantenimientoSalida.emit({ mantenimiento: JSON.stringify(this.clone) });
          this.processing = false;
          this.habilitarSeccionesXtipoSuperficie();
          this.snackBar.open(this.constants.successEdit, 'X', {
            duration: 6000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          this.processing = false;
          this.utilitiesServices.formErrorMessages(
            error,
            this.forms,
            this.snackBar
          );
        }
      );
    } else {
      this.processing = false;
    }

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
            'id', 'ancho', 'area', 'numeroLosas', 'abscisaInicial', 'abscisaFinal', 'pci', 'acciones'
          ];
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = true;
          this.columnasTablaFallas = [
            'unidadMuestreoFalla', 'tipoFalla', 'severidadFalla', 'longitudFalla', 'anchoFalla', 'areaFalla', 'acciones'
          ];
          break;
        case 'FLEXIBLE':
        case 'ADOQUÍN CONCRETO':
        case 'ADOQUÍN ARCILLA':
          this.columnasTablaMuestreos = [
            'id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci', 'acciones'
          ];
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = true;
          this.columnasTablaFallas = [
            'unidadMuestreoFalla', 'tipoFalla', 'severidadFalla', 'longitudFalla', 'anchoFalla', 'areaFalla', 'acciones'
          ];
          break;

        case 'MIXTOS':
          this.visibilidadFallas = true;
          this.visibilidadMuestreo = false;
          this.columnasTablaMuestreos = [
            'id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci', 'acciones'
          ];
          this.columnasTablaFallas = ['tipoFalla', 'severidadFalla',
            'longitudFalla', 'anchoFalla', 'areaFalla', 'acciones'];
          break;

        default:
          this.visibilidadFallas = false;
          this.visibilidadMuestreo = false;
          this.columnasTablaMuestreos = [
            'id', 'ancho', 'area', 'abscisaInicial', 'abscisaFinal', 'pci', 'acciones'
          ];
          this.columnasTablaFallas = ['unidadMuestreoFalla', 'tipoFalla', 'severidadFalla',
            'longitudFalla', 'anchoFalla', 'areaFalla', 'acciones'];
          break;
      }
    }
  }

  /**
   * Método encargado de realizar la validación de los campos de la sección de encabezado
   * del formulario.
   *
   * @param formularioEncabezado Form del conjunto de datos de encabezado
   */
  validarSeccionEncabezado(formularioEncabezado) {

    let cambioEncabezado: boolean = false;

    if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === undefined) {
      this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal = null;
    }

    if (this.data.mantenimiento.diagnostico === null) {
      this.data.mantenimiento.diagnostico = new DiagnosticoModel();
    }

    if (this.data.mantenimiento.diagnostico.encabezado === undefined) {
      this.data.mantenimiento.diagnostico.encabezado = new DiagnosticoEncabezadoModel();
    }

    if (this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === undefined) {
      this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal = null;
    }

    if (this.mantenimiento.tipoSuperficie == null || this.data.mantenimiento.tipoSuperficie == null ||
      this.mantenimiento.tipoSuperficie.descripcion !== this.data.mantenimiento.tipoSuperficie.descripcion) {
      cambioEncabezado = true;
    }

    if ((this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === null &&
      this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null) ||
      (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
        this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === null)) {
      cambioEncabezado = true;
    } else {
      if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
        this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
        this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion !==
        this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion) {
        cambioEncabezado = true;
      }
    }

    if (this.mantenimiento.diagnostico.encabezado.id === undefined ||
      this.mantenimiento.diagnostico.encabezado.id === null ||
      this.mantenimiento.diagnostico.encabezado.id === 0) {
      cambioEncabezado = false;
    }

    if (cambioEncabezado) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '40%';
      dialogConfig.data = {
        mensaje: 'La actualización de datos implica eliminar los registros de muestras y fallas. ¿Desea continuar?',
        titulo: 'Confirmar acción'
      };
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          this.saveSection('diagnostico_encabezado', formularioEncabezado);
        }
      });
    } else {
      this.saveSection('diagnostico_encabezado', formularioEncabezado);
    }

  }

  /**
   * Método encargado de realizar la validación y almacenamiento
   * de la sección indicada.
   *
   * @param formularioEncabezado Form del conjunto de datos de encabezado
   */
  saveSection(section: string, form: FormGroup): void {
    this.processing = true;
    let esValido: boolean;
    if (form == null) {
      esValido = true;
    } else {
      if (section === 'diagnostico_encabezado') {
        form.get('encabezadoId').clearValidators();
        form.get('encabezadoId').markAsTouched();
        form.get('encabezadoId').updateValueAndValidity();
      }
      esValido = this.validate(form);
    }

    if (esValido) {
      switch (section) {
        case 'diagnostico_encabezado':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.pk = this.mantenimiento.pk;
          this.data.mantenimiento.localidad = this.mantenimiento.localidad;
          this.data.mantenimiento.barrio = this.mantenimiento.barrio;
          this.data.mantenimiento.civ = this.mantenimiento.civ;
          this.data.mantenimiento.ejeVial = this.mantenimiento.ejeVial;
          this.data.mantenimiento.ancho = this.mantenimiento.ancho;
          this.data.mantenimiento.area = this.mantenimiento.area;
          this.data.mantenimiento.zona = this.mantenimiento.zona;
          this.data.mantenimiento.desde = this.mantenimiento.desde;
          this.data.mantenimiento.hasta = this.mantenimiento.hasta;
          this.data.mantenimiento.upla = this.mantenimiento.upla;
          this.data.mantenimiento.programa = this.mantenimiento.programa;
          this.data.mantenimiento.indicePriorizacion = this.mantenimiento.indicePriorizacion;
          this.data.mantenimiento.tipoSeccionVial = this.mantenimiento.tipoSeccionVial;
          this.data.mantenimiento.solicitudFecha = this.mantenimiento.solicitudFecha;
          this.data.mantenimiento.rutasTransporte = this.mantenimiento.rutasTransporte;
          this.data.mantenimiento.tipoMalla = this.mantenimiento.tipoMalla;
          this.data.mantenimiento.posicionesBox = this.mantenimiento.posicionesBox;
          if (this.mantenimiento.tipoSuperficie == null || this.data.mantenimiento.tipoSuperficie == null ||
            this.mantenimiento.tipoSuperficie.descripcion !== this.data.mantenimiento.tipoSuperficie.descripcion) {
            this.data.mantenimiento.diagnostico.muestreos = [];
            this.data.mantenimiento.diagnostico.fallas = [];
            this.muestreosDatasource.data = this.data.mantenimiento.diagnostico.muestreos;
            this.fallasDatasource.data = this.data.mantenimiento.diagnostico.fallas;
          }
          if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
            typeof (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.id) === 'undefined') {
            this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal = null;
          }
          if (this.data.mantenimiento.diagnostico.encabezado === undefined) {
            this.data.mantenimiento.diagnostico.encabezado = new DiagnosticoEncabezadoModel();
          }
          if (this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
            typeof (this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.id) === 'undefined') {
            this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal = null;
          }

          if ((this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === null &&
            this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null) ||
            (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
              this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal === null)) {
            this.data.mantenimiento.diagnostico.muestreos = [];
            this.data.mantenimiento.diagnostico.fallas = [];
            this.muestreosDatasource.data = this.data.mantenimiento.diagnostico.muestreos;
            this.fallasDatasource.data = this.data.mantenimiento.diagnostico.fallas;
          } else {
            if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
              this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null &&
              this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion !==
              this.data.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion) {
              this.data.mantenimiento.diagnostico.muestreos = [];
              this.data.mantenimiento.diagnostico.fallas = [];
              this.muestreosDatasource.data = this.data.mantenimiento.diagnostico.muestreos;
              this.fallasDatasource.data = this.data.mantenimiento.diagnostico.fallas;
            }
          }


          this.data.mantenimiento.diagnostico.encabezado = this.mantenimiento.diagnostico.encabezado;
          this.data.mantenimiento.tipoSuperficie = this.mantenimiento.tipoSuperficie;
          this.data.mantenimiento.transitabilidad = this.mantenimiento.transitabilidad;
          this.data.mantenimiento.tipoUsoVia = this.mantenimiento.tipoUsoVia;

          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          break;
        case 'diagnostico_priorizacion':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.diagnostico.priorizacion = this.mantenimiento.diagnostico.priorizacion;
          break;
        case 'diagnostico_otros_factores':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.diagnostico.factores = this.mantenimiento.diagnostico.factores;
          break;
        case 'diagnostico_unidades_muestreo':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.diagnostico.muestreos = this.mantenimiento.diagnostico.muestreos;
          this.data.mantenimiento.diagnostico.fallas = this.mantenimiento.diagnostico.fallas;
          break;
        case 'diagnostico_fallas':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.diagnostico.fallas = this.mantenimiento.diagnostico.fallas;
          break;
        case 'diagnostico_fotos':
          this.inicializando = true;
          if (this.data.mantenimiento.diagnostico == null) {
            this.data.mantenimiento.diagnostico = new DiagnosticoModel();
          }
          this.data.mantenimiento.diagnostico.fotos = this.mantenimiento.diagnostico.fotos;
          break;
      }
      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
          this.clone = JSON.parse(JSON.stringify(data.mantenimiento));
          if (this.mantenimiento.diagnostico.priorizacion == null) {
            this.mantenimiento.diagnostico.priorizacion = new DiagnosticoPriorizacionModel();
          }
          if (this.mantenimiento.diagnostico.muestreos != null) {
            this.muestreosDatasource.data = this.mantenimiento.diagnostico.muestreos;
          }
          this.mantenimientoSalida.emit({ mantenimiento: JSON.stringify(this.clone) });
          this.processing = false;
          this.habilitarSeccionesXtipoSuperficie();
          this.snackBar.open(this.constants.successEdit, 'X', {
            duration: 6000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          this.processing = false;
          this.utilitiesServices.formErrorMessages(
            error,
            this.forms,
            this.snackBar
          );
        }
      );
    } else {
      this.processing = false;
      if (section === 'diagnostico_encabezado') {
        form.get('encabezadoId').setValidators([Validators.required]);
        form.get('encabezadoId').markAsTouched();
        form.get('encabezadoId').updateValueAndValidity();
      }
    }
  }



  /**
   * Método encargado de validar los datos del formulario indicado
   * @param form Formulario del cual se va a realizar la validación
   */
  public validate(form: FormGroup): boolean {
    // tslint:disable-next-line: forin
    for (const inner in form.controls) {
      if (inner === 'id') {
        form.get(inner).clearValidators();
        form.get(inner).setErrors(null);
      }
      form.get(inner).markAsTouched();
      form.get(inner).updateValueAndValidity();
    }
    return form.valid;
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


  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    this.inicializando = false;
    this.cargaConTimeOuts();
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
        case 'Encabezado' :
          this.myInput = `EncabezadoMat`;
          break;
        case 'Unidades de muestreo' :
          this.myInput = `MuestreosMat`;
          break;
        case 'Fallas' :
          this.myInput = `FallasMat`;
          break;
        case 'Otros factores' :
          this.myInput = `OtrosFactoresMat`;
          break;
        case 'Fotos' :
          this.myInput = `FotosMat`;
          break;
        case 'Modelo de priorización' :
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

  cargaConTimeOuts() {
    this.currentStep = 0;
    if (!this.encabezadoValido()) { return; }
    setTimeout(() => {
      if (this.visibilidadMuestreo) { this.currentStep += 1; }
      if (!this.unidadesMuestreoValido()) { return; }
      setTimeout(() => {
        if ( this.visibilidadMuestreo ) { this.currentStep += 1; }
        if (!this.fallaValido()) { return; }
        setTimeout(() => {
          this.currentStep += 1;
          if (!this.otrosFactoresValido()) { return; }
          setTimeout(() => {
            this.currentStep += 1;
            if (!this.fotosValido()) { return; }
            setTimeout(() => {
              this.currentStep += 1;
              if (!this.PriorizacionValido()) { return; }
              setTimeout(() => {
                this.currentStep += 1;
              }, this.tiempoLatencia);
            }, this.tiempoLatencia);
          }, this.tiempoLatencia);
        }, this.tiempoLatencia);
      }, this.tiempoLatencia);
    }, this.tiempoLatencia);
  }

  encabezadoValido() {
    return this.formularioEncabezado.valid;
  }
  unidadesMuestreoValido() {
    return this.formularioMuestreos.valid;
  }
  fallaValido() {
    return this.formularioFallas.valid;
  }
  otrosFactoresValido() {
    return this.formularioFotos.valid;
  }
  fotosValido() {
    return this.formularioFotos.valid;
  }
  PriorizacionValido() {
    return this.formularioPriorizacion.valid;
  }


  /** Método encargado de gestionar la acción de cambio de tipo de superficie en el formulario */
  cambioTipoSuperficie(tipoSuperficie: ListaItem) {
    this.presentarTipoIntervencion = false;
    if (tipoSuperficie && typeof tipoSuperficie !== 'undefined' && typeof tipoSuperficie.id !== 'undefined') {
      this.mantenimiento.tipoSuperficie = tipoSuperficie;
      if (!this.inicializando) {
        this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal = null;
      }
      this.pathTipoIntervencion =
        this.constants.path_workflow_diagnostico_encabezado_tipo_intervencion.replace('{tipoSuperficie}', tipoSuperficie.id + '');
    }

    setTimeout(() => {
      this.presentarTipoIntervencion = true;
    }, 100);
  }


}
