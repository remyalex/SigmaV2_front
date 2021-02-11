import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatPaginator, MatSort, MatDialogConfig, MatDialog, MatStepper } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../diagnostico/shared/diagnostico.constants';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { VisitaPredisenoAsignarModel, VisitaPredisenoEquipocalendarioModel } from 'src/app/workflow/models/visita.prediseno.asignar.model';
import { CONST_ADMINISTRACION_EQUIPO } from 'src/app/administracion/equipo/equipo.constant';
import { EquipocalendarioDatasource } from 'src/app/administracion/equipocalendario/services/equipocalendario.datasource';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from 'src/app/administracion/equipocalendario/equipocalendario.constant';
import { EquipocalendarioService } from 'src/app/administracion/equipocalendario/services/equipocalendario.service';
import { EquipocalendarioCalendarsCriteria } from 'src/app/administracion/equipocalendario/models/equipocalendario-criteria.model';
import { Equipocalendario } from 'src/app/administracion/equipocalendario/models/equipocalendario.model';
import { VisitaPredisenoAsignarService } from 'src/app/workflow/services/visitaPredienoAsignacion.service';
import { environment } from 'src/environments/environment';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'app-programar-visita-asignar-vehiculo',
  templateUrl: './programar-visita-asignar-vehiculo.component.html'
})
export class ProgramarVisitaAsignarVehiculoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  constantsEquipo = CONST_ADMINISTRACION_EQUIPO;
  constantsEquipoCalendario = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  isLinear = true;
  mantenimientoFormGroup: FormGroup;
  trabajarFormGroup: FormGroup;
  formFilterIngenieroDisenio: FormGroup;
  visitaPrediseno: VisitaPredisenoAsignarModel = new VisitaPredisenoAsignarModel();
  criterialEquipoCalendario: EquipocalendarioCalendarsCriteria = new EquipocalendarioCalendarsCriteria();
  newVisita = true;
  // Variables relacionadas con el mapa
  mapCenter = [-74.1014, 4.6455];
  basemapType = 'osm';
  mapZoomLevel = 12;
  estadosPkMapa = ['NULL'];
  botonTrabajarMapa = false;
  seleccionMasivaMapa = false;
  estadoMantenimiento: ListaItem;
  dataSourceCalendarioEquipo: EquipocalendarioDatasource;
  listaEquipoCalendario: any[] = [];
  ingenieros: any = [];
  loadingIngeniero = false;
  petitionIngeniero: any;
  mantenimientoDataContent = [];
  mantenimientosIdsString: Array<string> = [];
  criteriaMap: GridMantenimientoCriteria;
  masiveChecked = false;
  selection = new SelectionModel<WorkflowMantenimientoModel>(true, []);

  /**  Elemento usado para la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginatorVehiculos: MatPaginator;

  /**  Elemento usado para el ordenamiento de la grilla */
  @ViewChild('sortVehiculos')  sortVehiculos: MatSort;

  eventStepper: any;

  responsableInfo = {
    nombres: this.constants.nombres,
    apellidos: this.constants.apellidos,
    usuario: this.constants.usuario,
  };

  equipoInfo = {
    placa: this.constantsEquipo.placa,
    movil: this.constantsEquipo.movil,
    numeroInterno: this.constantsEquipo.numeroInterno,
  };
  readyIngenieroForSearch = false;
  totalRegistros = 0;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'seleccion', 'pk', 'civ', 'origen', 'fecha', 'ejeVial',
    'fechaVisitaDisenio', 'diagnostico.encabezado.tipoIntervencionTotal.descripcion', 'localidad.nombre', 'zona', 'cuadrante'
  ];

  columnsEquipo = [
    'select', 'fecha', 'numeroMovil', 'inicio', 'fin'
  ];

  // Constructor del componente
  /**
   *
   * @param servicio servicio
   * @param commonService commonService
   * @param formBuilder formBuilder
   * @param workflowService workflowService
   * @param excelService excelService
   * @param utilitiesServices utilitiesServices
   * @param snackBar snackBar
   * @param tokenStorageService tokenStorageService
   * @param equipocalendarioServicio equipocalendarioServicio
   * @param visitaPredisenoAsignarService visitaPredisenoAsignarService
   * @param mapService mapService
   * @param dialog dialog
   */
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    private equipocalendarioServicio: EquipocalendarioService,
    private visitaPredisenoAsignarService: VisitaPredisenoAsignarService,
    mapService: MapService,
    private dialog: MatDialog,
  ) {

    // Invocación del constructor padre
    super(
      servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService
    );
    this.criteriaMap = new GridMantenimientoCriteria();
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  createForms() {
    const fechaMinima = new Date();
    const fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 90);
    this.visitaPrediseno.fechaMinima = this.utilitiesServices.convertDateToString(fechaMinima);
    this.visitaPrediseno.fechaMaxima = this.utilitiesServices.convertDateToString(fechaMaxima);
    this.mantenimientoFormGroup = this.formBuilder.group({
      mantenimientos: [null, Validators.compose([])],
    });
    this.trabajarFormGroup = this.formBuilder.group({
      fecha: [null, Validators.compose([Validators.required])],
      equipo: [null, Validators.compose([Validators.required])],
      equipoCalendarios: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.forms.push(this.mantenimientoFormGroup);
    this.forms.push(this.trabajarFormGroup);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    this.initDataSource();
    this.loadDataTable();
    this.listIngenierosDisenio();
    this.createForms();
    this.dataSourceCalendarioEquipo = new EquipocalendarioDatasource(this.equipocalendarioServicio);

    this.criteriaMap.actividadActualId = '43';
    this.criteriaMap.responsable = new UsuarioInfo();
    this.criteriaMap.responsable.id = +this.tokenStorageService.getId();
    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;

    this.mapService.getVisor().setMapFilterForce(this.criteriaMap.getMapQuery());
    this.mapService.getVisor().agregarControlesSeleccionMultiple();

    this.mantenimientosIds = [];

    this.mapService.getVisor().PKSeleccionados$.subscribe(async items => {
      let existsDataMantenim = false;
      this.listaPksSelect = [];
      this.mantenimientosIds = [];
      items.map(async item => {
        if (item) {
          this.mantenimientoDataContent.map(dataMantenimiento => {
            if (item.toString() === dataMantenimiento.pk.toString()) {
              existsDataMantenim = true;
              this.listaPksSelect.push(dataMantenimiento);
              this.mantenimientosIds.push(dataMantenimiento.id);
              this.mantenimientoIsSelected(dataMantenimiento.id);
            }
          });
        }
      });

      if (existsDataMantenim !== false) {
        this.listaPksSelect = await this.removeDuplicates(this.listaPksSelect, 'pk');
      }
    });

    this.dataSource.matenimientosDataContent$.subscribe(mantenimientoSubject => {
      mantenimientoSubject.map(dataMantenimiento => {
        if (dataMantenimiento) {
          this.mantenimientoDataContent.push(dataMantenimiento);
        }
      });
    });

    this.mapService.getVisor().filtrarPk$.subscribe((pkFiltro: string) => {
      if (pkFiltro) {
        this.setPkFiltro(pkFiltro);
      }
    });

  }

  // defaultCriteria() {
  //   this.criteria.responsableId = '';
  //   this.criteria.actividadActualId = this.data.actividad.id.toString();
  // }

  changeIngeniero(ingeniero: any) {
    this.readyIngenieroForSearch = false;
    this.dataSource.totalElements$.subscribe(data => {
      this.totalRegistros = data;
    });
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.listaPksSelect = [];
    this.readyIngenieroForSearch = true;
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadDataTable();
  }

  listIngenierosDisenio() {
    this.loadingIngeniero = true;
    let path = environment.backend;

    if (this.petitionIngeniero) {
      this.petitionIngeniero.unsubscribe();
    }

    path += `${this.constants.path_personas_con_usuarios_y_rol_ingeniero_disenio}`;
    this.petitionIngeniero = this.workflowService.listIngenierosDisenio(path).subscribe(data => {
      this.ingenieros = data;
      this.loadingIngeniero = false;
    }, () => {
      this.loadingIngeniero = false;
      this.ingenieros = [];
    });
  }

  ngAfterViewInit() {
    this.mapService.getVisor().visible = true;
    this.subscribePaginationAndSoort();
  }

  cambioMantenimientos() {
    this.visitaPrediseno.mantenimientos = this.listaPksSelect;
  }

  changeEquipoCalendarioSelect(equipoCalendario, event) {
    if (event.checked) {
      const calendario = new VisitaPredisenoEquipocalendarioModel();
      calendario.equipoCalendario = equipoCalendario;
      this.listaEquipoCalendario.push(calendario);
    } else {
      for (const key in this.listaEquipoCalendario) {
        if (this.listaEquipoCalendario[key].equipoCalendario.id === equipoCalendario.id) {
          this.listaEquipoCalendario.splice(+key, 1);
        }
      }
    }

    if (this.listaEquipoCalendario.length <= 0) {
      this.visitaPrediseno.calendariosEquipo = null;
    } else {
      this.visitaPrediseno.calendariosEquipo = this.listaEquipoCalendario;
    }
  }

  cambioEquipo() {
    this.listaEquipoCalendario = [];
    this.loadEquipoCalendarios();
  }

  /** Método encargado de gestionar el evento de subscripción del calendario de equipo */
  subscribeSoortEquipoCalendario(): void {
    this.sortVehiculos.sortChange.subscribe(() => {
      this.criterialEquipoCalendario.sortBy = this.sortVehiculos.active;
      this.criterialEquipoCalendario.sortOrder = this.sortVehiculos.direction || 'asc';
      this.loadEquipoCalendarios();
    });
  }

  loadEquipoCalendarios() {
    if (this.visitaPrediseno.equipo.id) {
      this.criterialEquipoCalendario.equipo = this.visitaPrediseno.equipo.id;
      this.criterialEquipoCalendario.inicio = this.utilitiesServices
        .convertDateToString(this.visitaPrediseno.fechaAsignacion + ' 07:00', 'DD-MM-YYYY HH:mm');
      this.criterialEquipoCalendario.fin = this.utilitiesServices
        .convertDateToString(this.visitaPrediseno.fechaAsignacion + ' 17:00', 'DD-MM-YYYY HH:mm');
      this.dataSourceCalendarioEquipo.loadDataCalendarsVisitasAsignacion(this.criterialEquipoCalendario);

      this.dataSourceCalendarioEquipo.loading$.subscribe(response => {
        if (!response) {
          this.dataSourceCalendarioEquipo.equipocalendarioSubject.value.map((data: Equipocalendario) => {
            if (!data.disponible) {
              data.select = true;
            }
            this.listaEquipoCalendario.map((item) => {
              if (data.id === item.equipoCalendario.id) {
                data.select = true;
              }
            });
          });
        }
      });
    }
  }

  changePageEquipoCalendario(event) {
    this.criterialEquipoCalendario.page = event.pageIndex;
    this.criterialEquipoCalendario.size = event.pageSize;
    this.loadEquipoCalendarios();
  }

  save(section: string, form: FormGroup): void {
    this.processing = true;
    let esValido: boolean;
    if (form == null) {
      esValido = true;
    } else {
      esValido = this.validate(form);
    }

    if (esValido) {
      console.log('form');
      console.log(form);
      this.utilitiesServices.scrollToTop();
      this.visitaPredisenoAsignarService.create(this.visitaPrediseno).subscribe(
        data => {
          this.snackBar.open(this.constants.successSave, 'X', {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
          this.processing = false;
          this.newVisita = false;
          /** Método encargado de inicializar el componente al ser creada nueva instancia */
          this.new();
        },
        error => {
          this.processing = false;
          this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
        });
    } else {
      this.snackBar.open(this.constants.errorForm, 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
      this.processing = false;
    }
  }

  onBack(stepper: MatStepper): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {          
          this.utilitiesServices.scrollToTop();
          this.newVisita = false;
          this.new();         
          stepper.previous();
        }
      }
    );
  }

  mantenimientoIsSelected(pk: number): Boolean {
    return this.mantenimientosIds.includes(pk);
  }

  loadDataMasterToggle(event) {
    this.mantenimientosIds = [];
    this.mantenimientosIdsString = [];
    this.masiveChecked = event.checked ? true : false;
    this.dataSource.mantenimientosData.forEach(async element => {
      const pkInteger = Number(element.id);
      if (this.masiveChecked) {
        this.mantenimientosIds.push(pkInteger);
      }
    });
    this.toggleChecksAll(this.dataSource.mantenimientosData, event);
  }

  async masterToggle(event) {
    if (!event.checked) {
      this.loadDataMasterToggle(event);
    } else {
      this.loadDataMasterToggle(event);
    }
  }

  async toggleChecks(mantenimiento: WorkflowMantenimientoModel, event: any) {
    this.listaPksSelect = await this.removeDuplicates(this.listaPksSelect, 'pk');
    if (event.checked) {
      this.listaPksSelect.push(mantenimiento);
    } else {
      this.listaPksSelect.splice(this.listaPksSelect.findIndex(m => m.id === mantenimiento.id), 1);
      // await this.mapService.getVisor().ruteoLimpiarCentroides();
    }

    this.listaPksSelect = this.listaPksSelect.reduce((item, current) => {
      const existe = item.find(x => x.pk === current.pk);
      if (!existe) {
        return item.concat([current]);
      } else {
        return item;
      }
    }, []);

    this.calcularKmsCarril();
    this.mantenimientosIds = [];
    this.mantenimientosIdsString = [];
    this.listaPksSelect.forEach(element => {
      this.mantenimientosIds.push(element['id']);
      this.mantenimientosIdsString.push(element['pk'].toString());
    });

    await this.mapService.getVisor().setPKSeleccionados(this.mantenimientosIdsString);

    if (this.listaPksSelect.length === 0) {
      this.mapService.getVisor().setPKSeleccionados([]);
      this.mantenimientosIds = [];
      this.listaPksSelect = [];
      this.masiveChecked = false;
      this.mapService.getVisor().limpiar();
    }

  }

  async toggleChecksAll(mantenimiento: WorkflowMantenimientoModel[], event: any) {
    if (event.checked) {
      this.listaPksSelect = [];
      this.listaPksSelect.push(mantenimiento);
    } else {
      this.mapService.getVisor().setPKSeleccionados([]);
      this.listaPksSelect = [];
      this.listaPksSelect[0] = [];
    }

    this.listaPksSelect = this.listaPksSelect[0].reduce((item, current) => {
      const existe = item.find(x => x.pk === current.pk);
      if (!existe) {
        return item.concat([current]);
      } else {
        return item;
      }
    }, []);

    this.calcularKmsCarril();
    this.mantenimientosIdsString = [];
    this.listaPksSelect.forEach(element => {
      this.mantenimientosIds.push(element['id']);
      this.mantenimientosIdsString.push(element['pk'].toString());
    });

    this.mapService.getVisor().setPKSeleccionados(this.mantenimientosIdsString);

    if (this.listaPksSelect.length === 0) {
      this.mapService.getVisor().setPKSeleccionados([]);
      this.mantenimientosIds = [];
      this.listaPksSelect = [];
      this.mapService.getVisor().limpiar();
    }

  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new() {
    this.processing = true;
    this.visitaPrediseno = new VisitaPredisenoAsignarModel();
    this.mantenimientoFormGroup.reset();

    this.listaEquipoCalendario = [];
    this.listaPksSelect = [];
    this.workflowService.get(this.data.actividad.proceso.url, this.data.actividad.url).subscribe((data) => {
      this.data = data;
      this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
      this.lastAction = this.currentAction;
      this.currentAction = 'create';
      this.processing = false;
      this.newVisita = true;
      this.ngOnInit();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  cambioFechaAsignacion() {
    if (!this.criteria.fechaAsignacion) {
      this.criteria.fechaAsignacionFin = null;
    } else {
      const fechaDfin = this.utilitiesServices.addDays(this.utilitiesServices.convertStringToDate(this.criteria.fechaAsignacion), 1);
      this.criteria.fechaAsignacionFin = this.utilitiesServices.convertDateToString(fechaDfin, 'DD-MM-YYYY');
    }
  }

  showAsignacionIngeniero() {
    if (this.criteria.ingenieroDisenioObject != null &&
      this.criteria.ingenieroDisenioObject.id > 0) {
      return true;
    }
    return false;
  }

  async limpiar() {
    this.mantenimientosIds = [];
    this.listaPksSelect = [];
    this.masiveChecked = false;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.criteria.page = 0;
    this.paginator.pageIndex = 0;
    this.loadData();
    this.mapService.getVisor().limpiar();
    this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    super.clear();
  }

  /** Método para localizar (ubicar) pk en el mapa */
  localizarMantenimientoMapa(mantenimiento) {
    this.mapService.getVisor().localizar(mantenimiento);
  }

  /** Método para filtrar por pk*/
  public setPkFiltro(pk: any) {
    this.criteria.pk = pk;
    this.loadData();
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.limpiar();
    this.mapService.getVisor().limpiar();
    this.mapService.disconectGrid();
  }

  onStepChange(event: any): void {
    this.eventStepper = event;
    if (event.selectedIndex === 1) {
        this.subscribeSoortEquipoCalendario();
      }
  }

}

