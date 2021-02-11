import { Cuadrante } from './../../../administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { Upla } from './../../../administracion/ubicaciones/upla/models/upla.model';
import { Barrio } from './../../../administracion/ubicaciones/barrio/models/barrio.model';
import { Localidad } from './../../../administracion/ubicaciones/localidad/models/localidad.model';
import { Zona } from './../../../administracion/ubicaciones/zona/models/zona.model';
import { VisitaVerificacionModel } from './../../../workflow/models/visita.verificacion';
import { Component, OnInit, AfterViewChecked, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../../workflow/forms/diagnostico/shared/diagnostico.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { IntervencionService } from 'src/app/workflow/forms/intervencion/services/intervencion.service';
import { MantenimientoTotalModel } from 'src/app/workflow/forms/intervencion/models/MantenimientoTotal';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { VisitaVerificacionService } from '../../services/visitaVerificacion.service';
import { VisitaVerificacionMantenimientoModel } from 'src/app/workflow/models/visita.verificacionMantenimiento';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-verificar-programacion',
  templateUrl: './verificar-programacion.component.html'
})
export class VerificarProgramacionComponent extends BaseComponent implements OnInit, AfterViewChecked {

  @Input() data: WorkflowMantenimientoActividadModel = new WorkflowMantenimientoActividadModel();
  @Input() condicion: WorkflowCondicionModel;
  @Input() usuarioLogueado: UsuarioInfo;
  @Input() permiso: String;
  @Input() isLinearDiagnostico: Boolean = true;
  @Output() cerrar = new EventEmitter();
  @Output() setupEventForm = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  public formCriteria: FormGroup;
  public editEnabled = false;
  public saveEdit = false;
  public btnAsignarEnabled = false;
  public btCancelEditDisabled = false;
  public btnSaveEditDisabled = false;
  public visitaVerificacion: VisitaVerificacionModel = new VisitaVerificacionModel();
  public listVisitaVerificacionMantenimientos: Array<VisitaVerificacionMantenimientoModel> = [];
  public loadingNumeroVisitasProgramadasSinRealizar = false;
  public mantenimientoTotalesVisitas: MantenimientoTotalModel = new MantenimientoTotalModel();
  public disabledCirteriaVerificar = false;
  public disableChecked = false;
  public SelectAllDisabled = false;
  public saveAllActivity = false;
  public newVisita = true;
  public fechaActualSistema = '';
  public columns = [
    'select', 'pk', 'civ', 'zona', 'fechaProgramacion', 'fechaInicioVisita', 'fechaFinVisita', 'directorObra', 'acciones'
  ];
  public mantenimientosModificadosUsuario: WorkflowMantenimientoModel[];
  public mantenimientoDiagnostico: WorkflowMantenimientoModel;
  public mantenimientoRevisarDiseno: WorkflowMantenimientoModel;
  public mantenimientoVistaConjunta: WorkflowMantenimientoModel;
  public mantenimientoDisenoApique: WorkflowMantenimientoModel;
  public criteriaMap: GridMantenimientoCriteria = new GridMantenimientoCriteria();
  public responseUp = null;
  // array usuado para seleccionar los PKs en el mapa
  mantenimientosSeleccionados: WorkflowMantenimientoModel[] = [];
  mantenimientoDisabledEdit = false;
  allDirectoresObra: Usuario[] = [];
  directoresObra: Usuario[] = [];
  masiveChecked = false;
  cloneMantenimiento: WorkflowMantenimientoModel[];

  /** Listado de zonas a las que pertenecen los pks seleccionados */
  zonas: Zona[] = [];
  /** Listado de todas las localidades */
  localidadesAll: Localidad[] = [];
  /** Listado de todos los barrios */
  barriosAll: Barrio[] = [];
  /** Variable par conservar el listado de las localidades segun zona */
  localidades: Localidad[] = [];
  /** Variable par conservar el listado de las barrios segun localidad */
  barrios: Barrio[] = [];
  /** Variable par conservar el listado de uplas */
  uplas: Upla[] = [];
  /** Listado de todos los cuadrantes */
  cuadrantesAll: Cuadrante[] = [];
  /** Listado de todas las uplas */
  uplasAll: Upla[] = [];


  // estadoPkPorEjecutar: ListaItem;


  private FieldMatch = [
    { source: 'ACTIVIDAD', target: 'ACTIVIDAD' },
    { source: 'ACTIVIDAD_AGRUPADA', target: 'ACTIVIDAD_AGRUPADA' },
    { source: 'ANCHO', target: 'ANCHOCALZADA' },
    { source: 'AREA', target: 'AREACALZADA' },
    { source: 'CIV', target: 'CIV' },
    { source: 'DESDE', target: 'DESDE' },
    { source: 'EJE_VIAL', target: 'EJE_VIAL' },
    { source: 'FECHA_REGISTRO_IDU', target: 'FECHAREGISTROIDU' },
    { source: 'FECHA_TERMINACION', target: 'FECHA_TERMINACION' },
    { source: 'FECHA_VISITA_TECNICA', target: 'FECHA_VISITA_TECNICA' },
    { source: 'HASTA', target: 'HASTA' },
    { source: 'LONGITUD', target: 'LONGITUDHORIZONTAL' },
    { source: 'PCI', target: 'PCI' },
    { source: 'PK', target: 'PK_ID_CALZADA' },
    { source: 'SOLICITUD_RADICADO_ENTRADA', target: 'NUMERO_RADICADO_ENTRADA' },
    { source: 'ACTIVIDAD_ACTUAL_ID', target: 'ACTIVIDAD_MANTENIMIENTO_ID' },
    { source: 'BARRIO_ID', target: 'ID_BARRIO' },
    { source: 'CUADRANTE_ID', target: 'ID_CUADRANTE' },
    { source: 'ESTADO_MANTENIMIENTO_ID', target: 'ESTADO_MANTENIMIENTO_ID' },
    { source: 'ESTADO_PK_VALOR', target: 'VALOR_ESTADO_PK' },
    { source: 'LOCALIDAD_ID', target: 'ID_LOCALIDAD' },
    { source: 'RESPONSABLE_ID', target: 'RESPONSABLE_MANTENIMIENTO_ID' },
    { source: 'RESPONSABLE_VISITA_TECNICA', target: 'RESPONSABLE_VISITA' },
    { source: 'SECTOR_ID', target: 'ID_BARRIO' },
    { source: 'TIPO_MALLA_ID', target: 'ID_TIPO_MALLA' },
    { source: 'TIPO_SECCION_VIAL_ID', target: 'ID_TIPO_SECCION_VIAL' },
    { source: 'TIPO_SUPERFICIE_ID', target: 'ID_TIPO_SUPERFICIE' },
    { source: 'UPLA_ID', target: 'ID_UPLA' },
    { source: 'ZONA_ID', target: 'ID_ZONA' },
    { source: 'ID', target: 'ID_MANTENIMIENTO_VIAL' },
    { source: 'TIENE_RESPONSABLE_ASIGNADO', target: 'TIENE_RESPONSABLE_ASIGNADO' },
    { source: 'TIENE_VEHICULO_ASIGNADO', target: 'TIENE_VEHICULO_ASIGNADO' },
    { source: 'TIENE_RUTA', target: 'TIENE_RUTA' },
    { source: 'TIENE_VISITA', target: 'TIENE_VISITA' },
    { source: 'ORIGEN_ID', target: 'ORIGEN_ID' },
    { source: 'RESPONSABLE_ID', target: 'RESPONSABLE_MANTENIMIENTO_ID' },
    { source: 'TIPO_ELEMENTO_ID', target: 'TIPO_ELEMENTO_ID' },
    { source: 'INGENIERO_DISENIO_ID', target: 'INGENIERO_DISENIO_ID' },
    { source: 'ESTADO_PMT_ID', target: 'ESTADO_PMT_ID' },
    { source: 'ACT_ACTUAL_GESTION_SOCIAL_ID', target: 'ACT_ACTUAL_GESTION_SOCIAL_ID' },
    { source: 'ACT_ACTUAL_GESTION_AMBIEN_ID', target: 'ACT_ACTUAL_GESTION_AMBIEN_ID' },
    { source: 'ACT_ACTUAL_GESTION_SST_ID', target: 'ACT_ACTUAL_GESTION_SST_ID' },
    { source: 'ACT_GEST_AMB_SUB_ID', target: 'ACT_GEST_AMB_SUB_ID' },
    { source: 'RESIDENTE_AMBIENTAL_ID', target: 'RESIDENTE_AMBIENTAL_ID' },
    { source: 'RESIDENTE_SOCIAL_ID', target: 'RESIDENTE_SOCIAL_ID' },
    { source: 'RESIDENTE_SST_ID', target: 'RESIDENTE_SST_ID' },
    { source: 'DIRECTOR_OBRA_ID', target: 'DIRECTOR_OBRA_ID' },
    { source: 'TIENE_SOLICITUD_ENSAYO', target: 'TIENE_SOLICITUD_ENSAYO' },
    { source: 'TIENE_SOLICITUD_APIQUE', target: 'TIENE_SOLICITUD_APIQUE' },
    { source: 'TIENE_SOLICITUD_AFORO', target: 'TIENE_SOLICITUD_AFORO' }
  ];

  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
    formBuilder: FormBuilder,
    private intervencionService: IntervencionService,
    private visitaVerificacionService: VisitaVerificacionService,
    private dialog: MatDialog,
    private listasService: ListasService,
    private profileService: ProfileService,
    private _servicioGeneral: DataGenericService,
    public  utilitiesService: UtilitiesService
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.mantenimientosModificadosUsuario = [];
    this.createForm();
    this.createFormCriteria();
  }

  createForm() {
    this.form = this.formBuilder.group({
      directorObra: [null, [Validators.required]],
      mantenimientos: [null, [Validators.required]],
      fechas: this.formBuilder.array([])
    });
  }

  createFormCriteria() {
    this.formCriteria = this.formBuilder.group({
      zona: [null, []],
      tipoIntervencion: [null, []]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.fechaActualSistema = this.utilitiesServices.convertDateToString(new Date(), 'DD/MM/YYYY');
    this.initDataSource();
    this.loadDataProgramacion();
    this.getAllDirectoresObra();
    this.btnAsignarEnabled = true;
    this.SelectAllDisabled = true;
    this.btnSaveEditDisabled = true;
    this.btCancelEditDisabled = true;
    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;
    this.filtarMapa();
    this.processingFiltersToShow();

    this.mapService.getVisor().filtrarUbicaciones$.subscribe(ubicacion => {
      if (ubicacion) {
        this.filtrarMedianteMapa(ubicacion);
      }
    });

    this.dataSource.matenimientosDataContent$.subscribe((item: WorkflowMantenimientoModel[]) => {
      if (this.dataSource.mantenimientosData !== undefined) {
        const control = this.form.controls.fechas as FormArray;
        control.controls = [];
        let i = 0;
        if (typeof(this.visitaVerificacion) !== 'undefined'
          && typeof(this.visitaVerificacion.directorObra) !== 'undefined'
          && this.visitaVerificacion.directorObra !== null) {
          this.btnAsignarEnabled = false;
          this.SelectAllDisabled = false;
          this.btCancelEditDisabled = false;
          this.btnSaveEditDisabled = false;
        } else {
          this.btnAsignarEnabled = true;
          this.SelectAllDisabled = true;
          this.btCancelEditDisabled = true;
          this.btnSaveEditDisabled = true;
        }

        this.cloneMantenimiento = JSON.parse(JSON.stringify(this.dataSource.mantenimientosData));

        while (i < this.dataSource.mantenimientosData.length) {

          let startDay = [''];
          let endDay = [''];

          const mantenimientoPersistido: WorkflowMantenimientoModel =
            this.obtenerMantenimientoEditado(this.dataSource.mantenimientosData[i].id);
          if (mantenimientoPersistido !== null) {
            const mantenimientoAnterior: WorkflowMantenimientoModel =
            this.obtenerMantenimientoActual(this.dataSource.mantenimientosData[i].id);
            if (mantenimientoAnterior != null) {
              if (this.saveAllActivity !== true) {
                mantenimientoAnterior['editFechas'] = true;
              } else {
                mantenimientoAnterior['editFechas'] = false;
              }
              mantenimientoAnterior.directorObra = this.visitaVerificacion.directorObra;
              this.dataSource.mantenimientosData[i] = mantenimientoAnterior;
              startDay = [mantenimientoAnterior.fechaInicioVisita];
              endDay = [mantenimientoAnterior.fechaFinVisita];
            } else {
              this.dataSource.mantenimientosData[i] = mantenimientoPersistido;
              if (this.saveAllActivity !== true) {
                mantenimientoAnterior['editFechas'] = true;
              } else {
                mantenimientoAnterior['editFechas'] = false;
              }
              startDay = [mantenimientoPersistido.fechaInicioVisita];
              endDay = [mantenimientoPersistido.fechaFinVisita];
            }
          } else {
            const fechaInicio = this.dataSource.mantenimientosData[i].fechaInicioVisita;
            const fechaFin = this.dataSource.mantenimientosData[i].fechaFinVisita;
            startDay = [fechaInicio];
            endDay = [fechaFin];
          }

          control.push(
            this.formBuilder.group({
              startdate: startDay,
              enddate: endDay
            })
          );
          i++;
        }
      }
    });

    this.mapService.getVisor().filtrarPk$.subscribe((pkFiltro: string) => {
      if (pkFiltro) {
        this.setPkFiltro(pkFiltro);
      }
    });

  }


  obtenerMantenimientoEditado(MantenimientoId: number) {
    let mantenimient = null;
    this.mantenimientosModificadosUsuario.forEach(element => {
      if ( MantenimientoId === element.id) {
        mantenimient = element;
      }
    });
    return mantenimient;
  }

  obtenerMantenimientoActual(MantenimientoId: number) {
    let mantenimient = null;
    JSON.parse(JSON.stringify(this.cloneMantenimiento)).forEach(element => {
      if ( MantenimientoId === element.id) {
        mantenimient = element;
      }
    });
    return mantenimient;
  }

  /** Método ecncargado de gestionar los pks a mostrar al usuario */
  processingFiltersToShow() {

    // Obtiene la lista de zonas
    this._servicioGeneral.cacheList(this.constants.path_administracion_zonas);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_zonas))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.zonas = data.content;
      });
  }

  filtrarMedianteMapa(filtro: any) {
    this.criteria.zona = undefined;
    switch (filtro.ubicacion) {
      case 'Zonas':
        const zona = this.zonas.find(z => z.nombre === filtro.nombre);
          this.criteria.zona = new ListaItem();
          this.criteria.zona.id = zona.id;
        break;
    }
    if (this.dataSource) {
      this.dataSource.loadData(this.criteria);
    }
  }

  initRange() {
    return this.formBuilder.group({
      startdate: [''],
      enddate: ['']
    });
  }

  getAllDirectoresObra() {
    this._servicioGeneral.cacheList(this.constants.path_administracion_usuario_director_obra);
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === this.constants.path_administracion_usuario_director_obra))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombres.localeCompare(b.nombres));
        this.allDirectoresObra = data.content;
      });
  }

  defaultCriteria(): void {
    this.criteria.actividadActualId = '' + this.data.actividad.id;
    this.criteria.responsableId = this.usuarioLogueado.id.toString();
  }

  limpiar() {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.mapService.getVisor().limpiar();
    this.criteria.page = 0;
    this.paginator.pageIndex = 0;
    this.loadDataProgramacion();
    this.mantenimientosModificadosUsuario = [];
    this.listVisitaVerificacionMantenimientos = [];
    this.visitaVerificacion.visitaVerificacionMantenimientos = [];
    this.mantenimientosSeleccionados = [];
    this.directoresObra = [];
    this.visitaVerificacion.directorObra = null;
    this.masiveChecked = false;
    this.filtarMapa();
  }

  searchData() {
    this.listVisitaVerificacionMantenimientos = [];
    this.visitaVerificacion.visitaVerificacionMantenimientos = [];
    this.mantenimientosSeleccionados = [];
    this.mantenimientosModificadosUsuario = [];
    this.masiveChecked = false;
    this.search();
    if (this.criteria.zona) {
      this.cambioZona();
    } else {
      this.directoresObra = [];
    }
    this.filtarMapa();
  }


  filtarMapa() {
    this.mapService.getVisor().limpiar();
    const sql = this.getMapFilter();
    this.mapService.getVisor().setMapFilter(sql);
    this.mapService.getVisor().zoomQuerylocalizar(this.getMapFilter());
  }

  public setPkFiltro(pk: any) {
    this.criteria.pk = pk;
    this.search();
  }


  cambioZona() {
    this.visitaVerificacion.directorObra = null;
    this.directoresObra = [];
    for (const director of this.allDirectoresObra) {
      if (director.zona && this.criteria.zona.id === director.zona.id) {
        if (!this.directoresObra.includes(director)) {
          this.directoresObra.push(director);
        }
      }
    }
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadDataProgramacion();
  }

  buscarVisitasProgramadasSinRealizar(usuario: UsuarioInfo) {
    if (usuario) {
      this.loadingNumeroVisitasProgramadasSinRealizar = true;

      this.intervencionService.buscarTotalMantenimientos(usuario).subscribe((item: MantenimientoTotalModel) => {
        this.mantenimientoTotalesVisitas = item;
        this.loadingNumeroVisitasProgramadasSinRealizar = false;
      }, error => {
        this.loadingNumeroVisitasProgramadasSinRealizar = false;
      });
    }
  }

  onSubmitAsignar() {
    this.markAndValidateAllInputs(this.form);
    let valid = this.validarfechas();
    this.btnAsignarEnabled = true;
    if (valid) {
      valid = this.form.controls.directorObra.valid && this.form.controls.mantenimientos.valid;
      if (!valid) {
        if (this.form.get('mantenimientos').invalid) {
          this.snackBar.open('Debe seleccionar al menos un PK', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          this.btnAsignarEnabled = false;
          return;
        }

        if (this.form.get('directorObra').invalid) {
          this.snackBar.open('Debe seleccionar el Director de obra', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          this.btnAsignarEnabled = false;
          return;
        }
      }
    }

    if (valid === true) {
      this.registrarVisita();
    }

    this.btnAsignarEnabled = false;

  }

  onSubmitEditar() {
    this.markAndValidateAllInputs(this.form);
    let valid = this.validarfechas();
    this.btnAsignarEnabled = true;
    if (valid) {
      valid = this.form.controls.directorObra.valid && this.form.controls.mantenimientos.valid;
      if (!valid) {
        if (this.form.get('mantenimientos').invalid) {
          this.snackBar.open('Debe seleccionar al menos un PK', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          this.btnAsignarEnabled = false;
          return;
        }

        if (this.form.get('directorObra').invalid) {
          this.snackBar.open('Debe seleccionar el Director de obra', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
          this.btnAsignarEnabled = false;
          return;
        }
      }
    }

    if (valid === true) {
      this.actualizarvisita();
    }

    this.btnAsignarEnabled = false;

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

  registrarVisita() {
    this.registrarVisitaVerificacion();
  }

  actualizarvisita(){
    this.actualizarVisitaVerificacion();
  }

  persistirInformacionEditada(item: WorkflowMantenimientoModel) {
    let actualizado = false;
    this.mantenimientosModificadosUsuario.forEach(element => {
      if (element.id === item.id) {
        element = JSON.parse(JSON.stringify(item));
        actualizado = true;
      }
    });
    if (!actualizado) {
      this.mantenimientosModificadosUsuario.push(item);
    }
  }

  validarfechas(): boolean {
    for (const item of this.listVisitaVerificacionMantenimientos) {
      if (!item.mantenimiento.fechaInicioVisita) {
        this.snackBar.open(`La fecha de inicio de la visita relacionado al PK ${item.mantenimiento.pk} no puede estar vacio`, 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        return false;
      }
      if (!item.mantenimiento.fechaFinVisita) {
        this.snackBar.open(`La fecha de fin de la visita relacionado al PK ${item.mantenimiento.pk} no puede estar vacio`, 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        return false;
      }
    }
    return true;
  }


  selectAll(event: any) {
    if (event.checked) {
      this.masiveChecked = true;
      this.dataSource.mantenimientosData.map(mantenimiento => {

        if (!this.reviewMantenimientoSeleccionable(mantenimiento)) {

          const visitaVerificacionMantenimiento: VisitaVerificacionMantenimientoModel = new VisitaVerificacionMantenimientoModel();
          visitaVerificacionMantenimiento.mantenimiento = mantenimiento;
          this.adicionarVisitaVerificacion(visitaVerificacionMantenimiento);
          this.persistirInformacionEditada(mantenimiento);

          if (typeof mantenimiento['fechaMinima'] === 'undefined') {
            mantenimiento['fechaMinima'] = this.utilitiesServices
              .convertDateToString(this.utilitiesServices.addDays(new Date(), 1), 'DD/MM/YYYY');
          }
          mantenimiento.select = true;
          if (mantenimiento.fechaInicioVisita || mantenimiento.fechaFinVisita) {
            mantenimiento['editFechas'] = false;
            mantenimiento['habilitarInput'] = true;
          } else {
            mantenimiento['editFechas'] = true;
            mantenimiento['habilitarInput'] = false;
          }

          const posicion = this.mantenimientosSeleccionados.findIndex(m => m.pk === mantenimiento.pk);
          if (posicion === -1 ) {
            this.mantenimientosSeleccionados.push(mantenimiento);
          }

        }
      });
    } else {
      this.masiveChecked = false;
      this.dataSource.mantenimientosData.map(mantenimiento => {
        mantenimiento['editFechas'] = false;
        mantenimiento['habilitarInput'] = false;
        mantenimiento.select = false;
      });
      for (const mant of this.dataSource.mantenimientosData) {

        const anteriorMtnto = this.obtenerMantenimientoActual(mant.id);
        if (anteriorMtnto != null) {
          mant['directorObra'] = anteriorMtnto.directorObra;
          mant.fechaInicioVisita = anteriorMtnto.fechaInicioVisita;
          mant.fechaFinVisita = anteriorMtnto.fechaFinVisita;
          mant.directorObra = anteriorMtnto.directorObra;
        } else {
          mant['directorObra'] = null;
          mant.fechaInicioVisita = null;
          mant.fechaFinVisita = null;
          mant.directorObra = null;
        }

        const posicion = this.mantenimientosSeleccionados.findIndex(m => m.pk === mant.pk);
        if (posicion >= 0) {
          this.mantenimientosSeleccionados.splice(posicion, 1);
        }

        let posicionList = this.listVisitaVerificacionMantenimientos.findIndex(v => v.mantenimiento.pk === mant.pk);
        if (posicionList >= 0) {
          this.listVisitaVerificacionMantenimientos.splice(posicionList, 1);
        }

        posicionList = this.mantenimientosModificadosUsuario.findIndex(v => v.pk === mant.pk);
        if (posicionList >= 0) {
          this.mantenimientosModificadosUsuario.splice(posicionList, 1);
        }

      }
    }
    this.setDirectorMantenimientos();
    this.visitaVerificacion.visitaVerificacionMantenimientos = this.listVisitaVerificacionMantenimientos;
    this.mapService.getVisor().seleccionarMantenimientos(this.mantenimientosSeleccionados);
    console.log(this.mantenimientosSeleccionados);
  }

  reviewSelectionMantenimiento(mantenimiento: WorkflowMantenimientoModel): boolean {
    let finded = false;
    const mant = this.mantenimientosSeleccionados.find(m => m.pk === mantenimiento.pk);
    if (mant) {
      finded = true;
    }
    return finded;
  }

  reviewMantenimientoSeleccionable(mantenimiento: WorkflowMantenimientoModel): boolean {
    let finded = true;
    const cantidadMtnmtos = mantenimiento.visitaVerificacionMantenimientos.length;
    if (this.btnAsignarEnabled === false && this.saveEdit === false && cantidadMtnmtos === 0) {
      finded = false;
    }
    if ( this.saveEdit === true && cantidadMtnmtos > 0) {
      finded = false;
    }
    if (finded === true) {
      this.disableChecked = true;
    }
    // Indica true si esta bloqueado para el usuario
    return finded;
  }

  mantenimientosChecked(mantenimiento: WorkflowMantenimientoModel, event) {
    let visitaVerificacionMantenimiento: VisitaVerificacionMantenimientoModel = new VisitaVerificacionMantenimientoModel();
    if (event.checked) {
      if (this.editEnabled === false && mantenimiento.visitaVerificacionMantenimientos.length > 0) {
        event.checked = false;
        this.snackBar.open(`El Pk seleccionado ya tiene una visita asignada`, 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        return false;
      }
      if (this.editEnabled === true && mantenimiento.visitaVerificacionMantenimientos.length > 0) {
        visitaVerificacionMantenimiento = JSON.parse(JSON.stringify(
            mantenimiento.visitaVerificacionMantenimientos
            [mantenimiento.visitaVerificacionMantenimientos.length - 1]
        ));

      }
      visitaVerificacionMantenimiento.mantenimiento = mantenimiento;
      this.adicionarVisitaVerificacion(visitaVerificacionMantenimiento);
      if (typeof mantenimiento['fechaMinima'] === 'undefined') {
          mantenimiento['fechaMinima'] = this.utilitiesServices.convertDateToString(
            this.utilitiesServices.addDays(new Date(), 1), 'DD/MM/YYYY'
          );
      }
      if (mantenimiento.fechaInicioVisita || mantenimiento.fechaFinVisita) {
        mantenimiento['editFechas'] = false;
        mantenimiento['habilitarInput'] = true;
      } else {
        mantenimiento['editFechas'] = true;
        mantenimiento['habilitarInput'] = false;
      }

      // Selecciona los pks en el mapa
      this.persistirInformacionEditada(mantenimiento);
      const posicion = this.mantenimientosSeleccionados.findIndex(m => m.pk === mantenimiento.pk);
          if (posicion === -1 ) {
            this.mantenimientosSeleccionados.push(mantenimiento);
          }
      this.mapService.getVisor().seleccionarMantenimientos(this.mantenimientosSeleccionados);
      if (this.dataSource.mantenimientosData.length === this.mantenimientosSeleccionados.length) {
        this.masiveChecked = true;
      }
    } else {
      this.masiveChecked = false;

      const anteriorMtnto = this.obtenerMantenimientoActual(mantenimiento.id);
      if (anteriorMtnto != null) {
        mantenimiento['directorObra'] = anteriorMtnto.directorObra;
        mantenimiento.fechaInicioVisita = anteriorMtnto.fechaInicioVisita;
        mantenimiento.fechaFinVisita = anteriorMtnto.fechaFinVisita;
        mantenimiento.directorObra = anteriorMtnto.directorObra;
      } else {
        mantenimiento['directorObra'] = null;
        mantenimiento.fechaInicioVisita = null;
        mantenimiento.fechaFinVisita = null;
        mantenimiento.directorObra = null;
      }

      this.listVisitaVerificacionMantenimientos.splice(this.listaPksSelect.findIndex(m => m.mantenimiento.id === mantenimiento.id), 1);

      this.mantenimientosModificadosUsuario.splice(this.listaPksSelect.findIndex(m => m.mantenimiento.id === mantenimiento.id), 1);

      mantenimiento['editFechas'] = false;
      mantenimiento['habilitarInput'] = false;

      // Retira el mantenimiento y selecciona los pks restantes en el mapa
      const index: number =
        // tslint:disable-next-line: radix
        this.mantenimientosSeleccionados.findIndex(m => parseInt(m.pk.toString()) === parseInt(mantenimiento.pk.toString()));
      this.mantenimientosSeleccionados.splice(index, 1);
      this.mapService.getVisor().seleccionarMantenimientos(this.mantenimientosSeleccionados);
    }

    this.visitaVerificacion.visitaVerificacionMantenimientos = this.listVisitaVerificacionMantenimientos;
    this.setDirectorMantenimientos();
  }

  adicionarVisitaVerificacion(visitaVerificacionMantenimiento: VisitaVerificacionMantenimientoModel) {
    let actualizado = false;
    for (let index = 0; index < this.listVisitaVerificacionMantenimientos.length; index++) {
      const element = this.listVisitaVerificacionMantenimientos[index];
      if (element.mantenimiento.id === visitaVerificacionMantenimiento.mantenimiento.id ) {
        this.listVisitaVerificacionMantenimientos[index] = visitaVerificacionMantenimiento;
        actualizado = true;
      }
    }
    if (actualizado === false) {
      this.listVisitaVerificacionMantenimientos.push(visitaVerificacionMantenimiento);
    }
  }

  viewCheckedRow(mantenimiento: WorkflowMantenimientoModel): Boolean {
    this.mantenimientoDisabledEdit = false;

    if (mantenimiento.visitaVerificacionMantenimientos && mantenimiento.visitaVerificacionMantenimientos.length > 0) {
      this.mantenimientoDisabledEdit = true;
    }

    return this.mantenimientoDisabledEdit;
  }

  cambiarDirectorObra(event) {
    if (event.value !== undefined) {
      this.btnAsignarEnabled = false;
      this.SelectAllDisabled = false;
      this.btCancelEditDisabled = false;
      this.btnSaveEditDisabled = false;
    } else {
      this.btnAsignarEnabled = true;
      this.SelectAllDisabled = true;
      this.btCancelEditDisabled = true;
      this.btnSaveEditDisabled = true;
    }
    this.buscarVisitasProgramadasSinRealizar(this.visitaVerificacion.directorObra);
    if (this.mantenimiento) {
      this.mantenimiento.directorObra = event;
    }
    this.setDirectorMantenimientos();
  }

  setDirectorMantenimientos() {
    if (!this.dataSource.mantenimientosData) {
      return null;
    }

    if (this.listVisitaVerificacionMantenimientos.length <= 0) {
      return null;
    }

    this.dataSource.mantenimientosData.map((mantenimiento: WorkflowMantenimientoModel) => {
      this.listVisitaVerificacionMantenimientos.map((item: VisitaVerificacionMantenimientoModel) => {
        if (item.mantenimiento.pk === mantenimiento.pk) {
          if (this.visitaVerificacion.directorObra) {
            item.mantenimiento.directorObra = this.visitaVerificacion.directorObra;
            mantenimiento.directorObra = this.visitaVerificacion.directorObra;
          }
        }
      });
    });
  }

  restaurarMantenimientos(btnEdit: Boolean, editFechas: Boolean) {

    this.mantenimientosSeleccionados = [];
    this.mantenimientosModificadosUsuario = [];

    if (!this.dataSource.mantenimientosData) {
      return;
    }

    if (this.listVisitaVerificacionMantenimientos.length <= 0) {
      return;
    }

    if (this.cloneMantenimiento.length <= 0) {
      return;
    }

    this.listVisitaVerificacionMantenimientos.map(item => {
      const anteriorMtnto = this.obtenerMantenimientoActual(item.mantenimiento.id);
      item['directorObra'] = anteriorMtnto.directorObra;
      item.mantenimiento.fechaInicioVisita = anteriorMtnto.fechaInicioVisita;
      item.mantenimiento.fechaFinVisita = anteriorMtnto.fechaFinVisita;
      item.mantenimiento.directorObra = anteriorMtnto.directorObra;
      item.mantenimiento['habilitarInput'] = btnEdit;
      item.mantenimiento['editFechas'] = editFechas;
    });

    this.listVisitaVerificacionMantenimientos = [];
    this.visitaVerificacion.visitaVerificacionMantenimientos = [];

    this.mapService.getVisor().seleccionarMantenimientos(this.mantenimientosSeleccionados);
  }

  habilitarCampos() {
    this.form.get('directorObra').enable();
    this.listVisitaVerificacionMantenimientos.map(item => {
      item.mantenimiento['habilitarInput'] = true;
      item.mantenimiento['editFechas'] = false;
    });
    this.disabledCirteriaVerificar = false;
    this.saveEdit = true;
    this.disableChecked = false;
  }


  habilitarCamposEdit(mantenimiento: WorkflowMantenimientoModel) {
    mantenimiento['editFechas'] = true;
    mantenimiento['habilitarInput'] = false;
  }

  habilitarEditar() {
    this.disabledCirteriaVerificar = true;
    this.editEnabled = true;
    this.saveEdit = true;
    this.btnAsignarEnabled = false;
    this.disableChecked = true;
    this.restaurarMantenimientos(false, false);
    this.searchData();
  }

  cancelEdit() {
    this.disabledCirteriaVerificar = false;
    this.saveEdit = false;
    this.editEnabled = false;
    this.btnAsignarEnabled = false;
    this.restaurarMantenimientos(false, false);
    this.searchData();
  }

  guardarTodo(): void {
    this.saveAllActivity = true;
  }

  closeGuardarTodo() {
    this.saveAllActivity = false;
  }

  public executeMasiveTransition(event: any): void {
    const mantenimientos = this.listVisitaVerificacionMantenimientos.map(item => {
      return item.mantenimiento;
    });
    this.applyMasiveTransitionTo(mantenimientos);
  }

  public registrarVisitaVerificacion(): void {

    this.processing = true;

    if (!this.visitaVerificacion.id) {
      const visitaVerificacionTemp: VisitaVerificacionModel =  JSON.parse(JSON.stringify(this.visitaVerificacion));
      this.visitaVerificacionService.create(visitaVerificacionTemp).subscribe(data => {
        this.guardarMantenimientos(data);
      }, error => {
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        this.processing = false;
      });
    }
  }

  public guardarMantenimientos(visitaVerificacion: VisitaVerificacionModel) {

    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];

    const mantenimientos = this.listVisitaVerificacionMantenimientos.map(item => {
      return item.mantenimiento;
    });

    for (const mantenimiento of mantenimientos) {
      const mantenimientoActividad = new WorkflowMantenimientoActividadModel();

      mantenimiento.estadoPk.id = 647230;
      mantenimiento.estadoProgramacionPk.id = 323682;
      visitaVerificacion.visitaVerificacionMantenimientos.forEach(element => {
        const visitaVerif = new VisitaVerificacionMantenimientoModel();
        visitaVerif.visitaVerifiacion = JSON.parse(JSON.stringify(visitaVerificacion));
        visitaVerif.mantenimiento =  JSON.parse(JSON.stringify(mantenimiento));
        visitaVerif.id = element.id;
        visitaVerif.consecutivo = element.consecutivo;
        mantenimiento.visitaVerificacionMantenimientos.push( visitaVerif );
      });

      mantenimientoActividad.mantenimiento = mantenimiento;
      mantenimientoActividad.actividad = this.data.actividad;
      mantenimientoActividad.observaciones = this.data.observaciones;
     // mantenimientoActividad.transicion = this.data.transicion;
      mantenimientoActividad.usuarioAsignado = this.data.usuarioAsignado;
      mantenimientosActividad.push(mantenimientoActividad);
    }

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.listVisitaVerificacionMantenimientos.map(item => {
        if (item.mantenimiento) {
          item.mantenimiento['habilitarInput'] = false;
          item.mantenimiento['editFechas'] = false;
          item.mantenimiento['disableChecked'] = true;
        }
        return item.mantenimiento;
      });

      if (this.dataSource.mantenimientosData) {
        this.dataSource.mantenimientosData.map(item => {
          if (item.mantenimiento) {
            item.mantenimiento['habilitarInput'] = false;
            item.mantenimiento['editFechas'] = false;
            item.mantenimiento['disableChecked'] = true;
          }
          return item.mantenimiento;
        });
      }

      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });

      this.buscarVisitasProgramadasSinRealizar(this.visitaVerificacion.directorObra);
      this.editEnabled = true;
      this.processing = false;
      this.saveEdit = false;
      this.guardarTodo();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });

  }

  public actualizarVisitaVerificacion(): void {

    this.listVisitaVerificacionMantenimientos.map(item => {
      if (item.mantenimiento) {
        item.mantenimiento['habilitarInput'] = false;
        item.mantenimiento['editFechas'] = false;
        item.mantenimiento['disableChecked'] = true;
      }
      return item.mantenimiento;
    });

    if (this.dataSource.mantenimientosData) {
      this.dataSource.mantenimientosData.map(item => {
        if (item.mantenimiento) {
          item.mantenimiento['habilitarInput'] = false;
          item.mantenimiento['editFechas'] = false;
          item.mantenimiento['disableChecked'] = true;
        }
        return item.mantenimiento;
      });
    }

    this.snackBar.open(this.constants.successSave, 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });

    this.editEnabled = true;
    this.saveEdit = false;
    this.guardarTodo();
  }

  public applyMasiveTransitionTo(mantenimientos: WorkflowMantenimientoModel[]) {
    this.processing = true;
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    for (const mantenimiento of mantenimientos) {
      const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
      mantenimientoActividad.mantenimiento = mantenimiento;
      mantenimientoActividad.actividad = this.data.actividad;
      mantenimientoActividad.observaciones = this.data.observaciones;
      mantenimientoActividad.transicion = this.data.transicion;
      mantenimientoActividad.usuarioAsignado = this.data.usuarioAsignado;
      mantenimientosActividad.push(mantenimientoActividad);
    }

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.snackBar.open(this.constants.successSave, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.processing = false;
      this.cancelEdit();
      // this.cerrar.emit();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });
  }

  diagnosticar(mantenimiento: WorkflowMantenimientoModel) {
    this.mantenimientoDiagnostico = mantenimiento;
    this.utilitiesServices.scrollToTop();
    this.currentAction = this.constants.currentAction.detalleDiagnosticar;
  }

  revisarDiseno(mantenimiento: WorkflowMantenimientoModel) {
    if (mantenimiento.disenio) {
      this.mantenimientoRevisarDiseno = mantenimiento;
      this.utilitiesServices.scrollToTop();
      this.currentAction = this.constants.currentAction.revisarDiseno;
      this.setupEventForm.emit({ hiddenClose: true });
    } else {
      this.snackBar.open('Mantenimiento no tiene definido un diseño', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  vistaConjunta(mantenimiento: WorkflowMantenimientoModel) {
    if (mantenimiento.disenio) {
      this.mantenimientoVistaConjunta = mantenimiento;
      this.utilitiesServices.scrollToTop();
      this.currentAction = this.constants.currentAction.vistaConjunta;
      this.setupEventForm.emit({ hiddenClose: true });
    } else {
      this.snackBar.open('Mantenimiento no tiene definido un diseño', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


  disenoApique(mantenimiento: WorkflowMantenimientoModel) {
    if (mantenimiento.predisenio) {
      this.mantenimientoDisenoApique = mantenimiento;
      this.utilitiesServices.scrollToTop();
      this.currentAction = this.constants.currentAction.disenoApique;
    } else {
      this.snackBar.open('Mantenimiento no tiene definido un Diseño - Apique', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  closeAccion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: this.constants.deseaSalir
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          if (location.pathname.split('/').length > 3) {
            this.currentAction = this.constants.currentAction.list;
            this.ngOnInit();
          }
        }
      }
    );
  }

  backRevisarDiseno() {
    this.currentAction = this.constants.currentAction.list;
    this.clear();
  }

  backRevisarDisenio() {
    this.currentAction = this.constants.currentAction.list;
    this.setupEventForm.emit({ hiddenClose: false });
    this.clear();
  }

  backDisenoApique() {
    this.currentAction = this.constants.currentAction.list;
    this.clear();
  }

  /** Método encargado de obtener los filtros por los
   * cuales se realiza la selección de pks en el mapa */
  public getMapFilter(): string {
    let sql = '';
    if (this.condicion) {
      sql = this.getQueryCondicion(this.condicion);
    }

    if (this.criteriaMap) {
      if (this.criteriaMap.getMapQuery().length > 0) {
        if (sql.length > 0) {
          sql = this.criteriaMap.getMapQuery() + ' AND (' + sql + ')';
        } else {
          sql = this.criteriaMap.getMapQuery();
        }
      }
    }

    if (sql !== '') {
      // tslint:disable-next-line: max-line-length
      sql = sql + ' AND (' + this.getFieldResponsableForMap() + ' = ' + this.usuarioLogueado.id + ' OR ' + this.getFieldResponsableForMap() + ' IS NULL )';
    } else {
      sql = this.getFieldResponsableForMap() + '=' + this.usuarioLogueado.id;
    }

    if (sql.endsWith('AND ( ( (')) {
      sql = sql.replace('AND ( ( (', '');
    }
    return sql;
  }

  public getFieldResponsableForMap() {
    const field = this.FieldMatch.find(x => x.source === 'RESPONSABLE_ID');
    return field.target;
  }

  public getQueryCondicion(condicion: WorkflowCondicionModel): string {

    let sql = '';
    let isInicialTerm = true;

    condicion.terminos.forEach(termino => {
      const field = this.FieldMatch.find(x => x.source === termino.atributo);
      if (field || termino.operadorLogico === 'AND (' || termino.operadorLogico === 'OR (' || termino.operadorLogico === ')'
        || termino.operadorLogico === 'AND NOT (' || termino.operadorLogico === 'OR NOT ('
      ) {

        if (termino.operadorLogico.includes('(') || termino.operadorLogico.includes(')')) {
          if (isInicialTerm) {
            if (termino.operadorLogico.includes('(')) {
              if (termino.operadorLogico.includes('NOT')) {
                sql += ' NOT (';
              } else {
                sql += ' (';
              }
            }
          } else {
            sql += ' ' + termino.operadorLogico;
          }
          if (termino.operadorLogico.includes('(')) {
            isInicialTerm = true;
          }
        } else {
          if (!isInicialTerm) {
            sql += ' ' + termino.operadorLogico;
          }
          isInicialTerm = false;
          sql += ' ' + field.target;
          if (termino.operador.includes('NULL')) {
            sql += ' IS ' + termino.operador;
          } else {
            sql += ' ' + termino.operador;
            sql += ' \'' + termino.valor + '\' ';
          }
        }
      }
    });

    return sql;
  }

  validateSelectedAll() {
    if (this.dataSource.mantenimientosData) {
      this.masiveChecked = true;
      for (const mant of this.dataSource.mantenimientosData) {
        const seleccionable = this.reviewMantenimientoSeleccionable(mant) === false;
        const seleccionado = this.reviewSelectionMantenimiento(mant);
        if (seleccionable === true && seleccionado === false) {
          this.masiveChecked = false;
          break;
        }
      }
    } else {
      this.masiveChecked = false;
    }
    return this.masiveChecked;
  }

  onChangeFechaVisita(mantenimiento: any) {
    if ( typeof(mantenimiento) !== 'undefined' ) {
      this.persistirInformacionEditada(mantenimiento);
    }
  }

  subscribePaginationAndSoort(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadDataProgramacion();
      this.masiveChecked = false;
    });
    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadDataProgramacion();
      this.masiveChecked = false;
    });
  }

}
