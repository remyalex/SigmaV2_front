import { Subscription } from 'rxjs';
import { ListasService } from './../../../../administracion/listas/services/listas.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatSort, MatDialogConfig, MatDialog, MatStepper, MatTableDataSource, MatPaginator, Sort } from '@angular/material';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../shared/diagnostico.constants';
import { CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { VisitaModel, VisitaEquipocalendarioModel, VisitaPersonacalendarioModel } from 'src/app/workflow/models/visita.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { CONST_ADMINISTRACION_EQUIPO } from 'src/app/administracion/equipo/equipo.constant';
import { EquipocalendarioDatasource } from 'src/app/administracion/equipocalendario/services/equipocalendario.datasource';
import { PersonacalendarioDatasource } from 'src/app/administracion/personacalendario/services/personacalendario.datasource';
import { PersonacalendarioService } from 'src/app/administracion/personacalendario/services/personacalendario.service';
import { EquipocalendarioService } from 'src/app/administracion/equipocalendario/services/equipocalendario.service';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from 'src/app/administracion/equipocalendario/equipocalendario.constant';
import { EquipocalendarioCalendarsCriteria } from 'src/app/administracion/equipocalendario/models/equipocalendario-criteria.model';
import { Equipocalendario } from 'src/app/administracion/equipocalendario/models/equipocalendario.model';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from 'src/app/administracion/personacalendario/personacalendario.constant';
import { PersonacalendarioCalendarsCriteria, PersonacalendarioCriteria } from 'src/app/administracion/personacalendario/models/personacalendario-criteria.model';
import { Personacalendario } from 'src/app/administracion/personacalendario/models/personacalendario.model';
import { environment } from 'src/environments/environment';
import { VisitaService } from 'src/app/workflow/services/visita.service';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import * as _moment from 'moment';
/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { DetailEquipoComponent } from '../shared/detail-equipo/detail-equipo.component';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { RutaEstimada } from 'src/app/shared/models/ruta-estimada.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Equipodisponibilidad } from 'src/app/administracion/equipodisponibilidad/models/equipodisponibilidad.model';

/** Componente encargado de gestionar el proceso de programación de visita */
@Component({
  selector: 'app-programar-visita-diagnostico',
  templateUrl: './programar-visita-diagnostico.component.html'
})
export class ProgramarVisitaDiagnosticoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Bandera usada para indicar que se encuentra creando una nueva visita */
  newVisita = true;
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Constantes de equipo a usar en el componente */
  constantsEquipo = CONST_ADMINISTRACION_EQUIPO;
  /** Constantes de calendarios de equipos a usar en el componente */
  constantsEquipoCalendario = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Constantes de personas de calendario a usar en el componente */
  constantspersonaCalendario = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Bandera que permite identificar si el acordeón
   * se presenta de forma secuencial al usuario */
  isLinear = true;
  /** Bandera que permite identificar si el botón a trabajar se presenta en el mapa */
  botonTrabajarMapa = false;
  /** Bandera que permite saber si los pks seleccionados son masivos */
  seleccionMasivaMapa = true;
  /** Objeto del mantenimiento que se procesará en el componente */
  visita: VisitaModel = new VisitaModel();
  /** Estado actual del mantenimiento */
  estadoMantenimiento: ListaItem;
  /** Variable usada para agrupar los campos de mantenimiento en el formulario */
  mantenimientoFormGroup: FormGroup;
  /** Formulario de equipo usado en el componente */
  equipoFormGroup: FormGroup;
  /** Formulario de persona usado en el componente */
  personaFormGroup: FormGroup;
  /**  Fuente de conjunto de datos de calendarios del equipo
   * para manejo de grilla del componente */
  dataSourceCalendarioEquipo: EquipocalendarioDatasource;
  /**  Fuente de conjunto de datos del calendario de personas
   * para manejo de grilla del componente */
  dataSourceCalendarioPersona: PersonacalendarioDatasource;
  /** Bandera usada para identificar si se ha seleccionado
   * la selección masiva de pks */
  masiveChecked = false;

  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSourceCalendarioPersonaLocal: MatTableDataSource<Personacalendario>;
  /** Paginador de la a grilla de personas*/
  @ViewChild('paginatorPersonaCalendario') paginatorPersonaCalendario: MatPaginator;
  /** Ordenador de la la grilla de personas*/
  @ViewChild('sortPersonaCalendario') sortPersonaCalendario: MatSort;
  /** Lista de calendarios seleccionados de la persona */
  _calendarioPersonas: Personacalendario[] = [];
  /** Lista de ordenamiento de calendarios seleccionados de la persona */
  _calendarioPersonasSorted: Personacalendario[] = [];
  /** Objeto para criterio por el cual se realizará la búsqueda de equipos calendarios */
  criterialEquipoCalendario: EquipocalendarioCalendarsCriteria = new EquipocalendarioCalendarsCriteria();
  /** Objeto para criterio por el cual se realizará la búsqueda de personas calendarios */
  criterialPersonaCalendario: PersonacalendarioCalendarsCriteria = new PersonacalendarioCalendarsCriteria();
  /** Listado de calendarios seleccionados por el usuario para equipos*/
  listaEquipoCalendario: any[] = [];
  /** Listado de calendarios seleccionados por el usuario para personas*/
  listaPersonaCalendario: any[] = [];
  /** Fecha de programación de la visita */
  fechaPersona: any = {};
  /** Personas responsables de la realización de la visita técnica */
  responsables: any = [];
  /** Bandera que permite identificar si se encuentra cargando el campo de responsable*/
  loadingResponsable = false;
  /** Variable usada para gestionar las peticiones del responsable */
  petitionResponsable: any;
  // petitionResponsableCalendarios: Subscription;
  activarRuteoBool = true;
  /** Bandera que indica si se debe ordenar el calendario por equipo */
  orderEquipoCalendarioActivated = false;
  /** Bandera que indica si se debe ordenar el calendario por persona */
  orderPersonaCalendarioActivated = false;
  /** Bandera que permite identificar si el componente se encuentra recargando */
  isReload = false;
  /** Ruta en la cual se realizará la visita */
  rutaVisitaPk = '';
  /** Texto de la ruta calculada */
  rutaTextoCalculada = '';
  /** Tiempo que dura la ruta en la que se realizaará la visita */
  tiempoRuta: any;
  /** Datos de mantenimientos involucrados en la ruta */
  mantenimientoDataContent = [];
  /** Criterios por los cuales se realizar la ubicación de pks en el mapa */
  criteriaMap: GridMantenimientoCriteria;
  /** Listado de ids de mantenimientos que se programarán en la visita */
  mantenimientosIdsString: Array<string> = [];
  /** Ultima fecha seleccionada de la visita */
  ultimaFechaSeleccionada: string;
  /** Ordenamiento de calendarios por equipos */
  @ViewChild('sortEquipoCalendario') sortEquipoCalendario: MatSort;
  /** Variable usada para gestionar el steepper del componente */
  @ViewChild('stepper') stepper: MatStepper;
  /** Variable usada para hacer uso del evento asociado al stepper del componente */
  eventStepper: any;
  /** Listado de colores de opciones de pks a presentar en el mapa */
  opciones = [
    { color: '#009688', name: 'Verde' },
    { color: '#343434', name: 'Otro' }
  ];
  /** Variable para encapsular la información del equipo */
  equipoInfo = {
    placa: this.constantsEquipo.placa,
    movil: this.constantsEquipo.movil,
    numeroInterno: this.constantsEquipo.numeroInterno,
  };
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'select', 'fechaSolicitudProgramacion', 'pk', 'origen', 'estadoMantenimiento', 'localidad.nombre', 'zona', 'cuadrante'
  ];
  /** Definición de las columnas presentadas en la grilla de equipos*/
  columnsEquipo = [
    'select', 'inicio', 'fechaDia', 'numeroMovil', 'horario'
  ];
  /** Definición de las columnas presentadas en la grilla de personas*/
  columnsPersona = [
    'select', 'fecha', 'dia', 'responsable', 'horario'
  ];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    pk: 'pk',
    acciones: 'Acciones'
  }];
  /** Lista de ids de los equipos seleccionados por el usuario */
  listaIdsUniqueChecksEquipoCalendario: number[] = [];
  /** Bandera que indica si el listado de equipos seleccionados a sido modificado */
  equipoHasChanged = true;
  /** Bandera que indica si la carga de los equipos calendarios ha sido cancelada */
  canceledLoadEquipoCalendario = false;
  /** Variable estado  */
  estadoVisitaDiagnostico: any;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones de mantenimientos
   * @param commonService Servicio usado en el componente para gestionar las peticiones
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param visitaService Servicio usado en el componente para gestionar las peticiones de visitas
   * @param personacalendarioServicio  Servicio usado en el componente para gestionar las peticiones de personas calendarios
   * @param equipocalendarioServicio  Servicio usado en el componente para gestionar las peticiones de equipos calendarios
   * @param tokenStorageService Componente usado para obtener información del token del usuario
   * @param listaService  Servicio usado en el componente para gestionar las peticiones de listas
   * @param mapService Componente usado para gestionar información del mapa
   */
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    private visitaService: VisitaService,
    private personacalendarioServicio: PersonacalendarioService,
    private equipocalendarioServicio: EquipocalendarioService,
    private listaService: ListasService,
    private dialog: MatDialog,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService,
      excelService, utilitiesServices, snackBar, tokenStorageService, mapService);
    this.dataSourceCalendarioPersonaLocal = new MatTableDataSource([]);
    this.criteriaMap = new GridMantenimientoCriteria();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    this.visita['fechaMinima'] = this.utilitiesServices.convertDateToString(new Date());
    this.loadEstado();
    this.initDataSource();
    this.createForms();
    this.initOtherDataSource();
    this.loadEquipoCalendarios();
    this.estadoVisita();
    this.tiempoRuta = '';

    this.criteriaMap.actividadActualId = '11';
    this.criteriaMap.responsable = new UsuarioInfo();
    this.criteriaMap.responsable.id = +this.tokenStorageService.getId();
    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;
    this.mapService.getVisor().ruteoLimpiar();
    this.mapService.getVisor().setMapFilterForce(this.criteriaMap.getMapQuery());
    const _this = this;
    setTimeout(function() {
      _this.mapService.getVisor().agregarControlesSeleccionMultiple();
    }, 6000);

    this.mapService.getVisor().mostrarRuteo();
    this.mapService.getVisor().definirEscalasVisualizacion(100000);

    this.mapService.getVisor().rutaEstimada$.subscribe((ruta: RutaEstimada) => {
      if (ruta) {
        this.setRuta(ruta.recorrido);
        this.changeTiempoRuta(ruta.tiempo);
      }
    });

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
    this.setMapaSteper();
  }

  /**
   * M+etpdp encargado de indicar si el pk seleccionado se encuentra seleccionado
   *
   * @param pk Número del pk del cual se desea saber si está seleccionado
  */
  mantenimientoIsSelected(pk: number): Boolean {
    return this.mantenimientosIds.includes(pk);
  }

  /**
   * Método encargado de gestionar el evento de selección de un mantenimiento en la grilla
   *
   * @param mantenimiento Objeto tipo mantenimiento con la información del pk
   * @param event Evento realizado por el usuario de selección en la grilla
  */
  async toggleChecks(mantenimiento: WorkflowMantenimientoModel, event: any) {
    this.listaPksSelect = await this.removeDuplicates(this.listaPksSelect, 'pk');
    if (event.checked) {
      this.listaPksSelect.push(mantenimiento);
    } else {
      this.listaPksSelect.splice(this.listaPksSelect.findIndex(m => m.id === mantenimiento.id), 1);
      await this.mapService.getVisor().ruteoLimpiarCentroides();
    }

    let totalElementos = 0;
    await this.dataSource.totalElements$.subscribe((total) => {
      totalElementos = total;
    });

    if (this.listaPksSelect.length === totalElementos) {
      this.masiveChecked = true;
    } else {
      this.masiveChecked = false;
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
      this.mapService.getVisor().ruteoLimpiar();
    }
  }

  /**
   * Método encargado de gestionar el evento de selección para todos los mantenimientos en la grilla
   *
   * @param event Evento realizado por el usuario de selección en la grilla
   */
  async masterToggle(event) {
    if (!event.checked) {
      this.masiveChecked = false;
      this.clearMantenimientosSelected();
    } else {
      this.clearMantenimientosSelected();
      this.masiveChecked = true;
      this.setMantenimientosSelected(this.dataSource.mantenimientosData);
    }

    this.mantenimientosIds = [];
    this.mantenimientosIdsString = [];
    this.listaPksSelect.forEach(element => {
      this.mantenimientosIds.push(element['id']);
      this.mantenimientosIdsString.push(element['pk'].toString());
    });

    await this.mapService.getVisor().setPKSeleccionados(this.mantenimientosIdsString);

    if (this.listaPksSelect.length === 0) {
      this.mapService.getVisor().setPKSeleccionados([]);
      this.mapService.getVisor().ruteoLimpiar();
    }
  }

  /** Método encargado de limpiar la selección de mantenimientos
   * realizados previamente por el usuario.*/
  clearMantenimientosSelected() {
    this.masiveChecked = false;
    for (const mantenimientoDataSource of this.dataSource.mantenimientosData) {
      this.listaPksSelect.splice(this.listaPksSelect.findIndex(mtto => mtto.pk === mantenimientoDataSource.pk), 1);
    }
  }

  /**
   * Método encargado de marcar como seleccionados los mantenimientos
   * indicados en el listado de entrada
   *
   * @param _mantenimientos Listado de mantenimientos a marcar como seleccionados
   */
  public setMantenimientosSelected(_mantenimientos: WorkflowMantenimientoModel[]) {
    this.listaPksSelect = [];
    _mantenimientos.forEach(element => {
      this.listaPksSelect.push(element);
    });
  }

  /**
   * Método encargado de inicializar la fuente de datos de los calendarios
   * de personas y equipos.
   */
  initOtherDataSource() {
    this.dataSourceCalendarioEquipo = new EquipocalendarioDatasource(this.equipocalendarioServicio);
    this.dataSourceCalendarioPersona = new PersonacalendarioDatasource(this.personacalendarioServicio);
  }

  /**
   * Método encargado de mantener actualizada la información de los calendarios
   * de las personas según listado presentado
   */
  updateDataSourcePersona() {
    this.dataSourceCalendarioPersonaLocal.data = this._calendarioPersonas;
    this.dataSourceCalendarioPersonaLocal.paginator = this.paginatorPersonaCalendario;
    this.dataSourceCalendarioPersonaLocal.sort = this.sortPersonaCalendario;
  }
  /**
   * Método encargado de obtener la cantidad de personas seleccionadas
   * por el usuario en la grilla
   */
  getCantidadPersonas() {
    return this._calendarioPersonas.length;
  }

  /**
   * Método encargado de ordenar el listado de datos según criterio de ordenamiento
   *
   * @param sort Criterio de datos por el cual se va a realizar el ordenamiento de la
   * información
  */
  sortData(sort: Sort) {
    const data = this._calendarioPersonas.slice();
    if (!sort.active || sort.direction === '') {
      // this.sortedData = data;
      return;
    }
    const _this_1 = this;
    this._calendarioPersonas = this._calendarioPersonas.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fecha': return _this_1.compare(a.inicio, b.inicio, isAsc);
        case 'dia':
          const x = _this_1.utilitiesServices.getWeekDay(a.inicio) + ' ' + _this_1.constants.al +
            this.utilitiesServices.getWeekDay(a.fin);
          const y = _this_1.utilitiesServices.getWeekDay(b.inicio) + ' ' + _this_1.constants.al +
            this.utilitiesServices.getWeekDay(b.fin);
          return _this_1.compare(x, y, isAsc);
        case 'horario': return this.compare(
          _this_1.utilitiesServices.convertDateToString(a.inicio, 'HH:mm') + _this_1.constants.hasta +
          _this_1.utilitiesServices.convertDateToString(a.fin, 'HH:mm'),
          _this_1.utilitiesServices.convertDateToString(b.inicio, 'HH:mm') + _this_1.constants.hasta +
          _this_1.utilitiesServices.convertDateToString(b.fin, 'HH:mm'),
          isAsc);
        default: return 0;
      }
    });
  }

  /**
   * Método encargado de comparar dos elementos numericos y retornar
   * si son iguales, mayores o menores.
   *
   * @param a Valor a comparar
   * @param b Segundo valor a comparar
   * @param isAsc Criterio si indica si se comparará ascendentemente o descendente
  */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /** Método encargado de gestionar el evento de subscripción del calendario de equipo */
  subscribeSoortEquipoCalendario(): void {
    this.sortEquipoCalendario.sortChange.subscribe(() => {
      this.criterialEquipoCalendario.sortBy = this.sortEquipoCalendario.active;
      this.criterialEquipoCalendario.sortOrder = this.sortEquipoCalendario.direction || 'asc';
      this.loadEquipoCalendarios();
    });
  }

  /** Método encargado de realizar la carga de daros de los calendarios de equipos segun
   * el equipo indicado por la visita */
  loadEquipoCalendarios() {
    if (this.visita.equipo.id) {
      this.criterialEquipoCalendario.equipo = this.visita.equipo.id;
      this.criterialEquipoCalendario.inicio = this.utilitiesServices.convertDateToString(this.visita.fecha, 'YYYY-MM-DD');
      this.dataSourceCalendarioEquipo.loadDataCalendars(this.criterialEquipoCalendario);

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

  /** Método encargado de realizar la carga de daros de los calendarios de las personas segun
   * la persona indicada por la visita */
  loadPersonaCalendarios() {
    if (this.visita.responsable !== undefined && this.visita.responsable.id) {
      this.criterialPersonaCalendario.persona = this.visita.responsable.id;
      this.criterialPersonaCalendario.inicio = this.fechaPersona.minima;
      this.criterialPersonaCalendario.fin = this.fechaPersona.maxima;
      const path =
        // tslint:disable-next-line: max-line-length
        `/api/administracion/personacalendario/persona/${this.visita.responsable.id}/inicio/${this.fechaPersona.minima}/fin/${this.fechaPersona.maxima}/calendars`;
      const personacalendarioCriteria = new PersonacalendarioCriteria();
      this.dataSourceCalendarioPersona.loadData(personacalendarioCriteria, path);

      // this.petitionResponsableCalendarios = this.dataSourceCalendarioPersona.loading$.subscribe(response => {
      this.dataSourceCalendarioPersona.loading$.subscribe(response => {
        if (!response && this.canceledLoadEquipoCalendario === false) {

          this.dataSourceCalendarioPersona.personacalendarioSubject.value.map((data: Personacalendario) => {
            if (!data.disponible) {
              data.select = true;
            }
            this.listaPersonaCalendario.map((item) => {
              if (data.id === item.personaCalendario.id) {
                data.select = true;
              }
            });
            this._calendarioPersonas = this.dataSourceCalendarioPersona.personacalendarioSubject.value;
            this.updateDataSourcePersona();
          });
        } else {
          this._calendarioPersonas = [];
          this.dataSourceCalendarioPersona.personacalendarioSubject.next([]);
          this.updateDataSourcePersona();
        }
      });
    } else {
      this.dataSourceCalendarioPersona.personacalendarioSubject.next([]);
      this._calendarioPersonas = [];
      this.updateDataSourcePersona();
    }
  }

  /** Método encargado de la carga de estados del mantenimiento por los pks */
  loadEstado() {
    this.commonService.
      getListaItemByNombreListaAndValorItem('ESTADO_MANTENIMIENTO', this.constants.estadosPk.pendiente_programacion)
      .subscribe((item) => {
        this.estadoMantenimiento = item;
        this.loadData();
      });
  }

  /**
   * Método encargado de construir y agrupar los elementos de los formularios
   * de personas, equipos y el general de pk en la funcionalidad
   */
  createForms() {
    this.mantenimientoFormGroup = this.formBuilder.group({
      mantenimientos: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])],
      fecha: [null, Validators.compose([Validators.required])],
    });
    this.equipoFormGroup = this.formBuilder.group({
      equipo: [null, Validators.compose([Validators.required])],
      equipoCalendarios: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.personaFormGroup = this.formBuilder.group({
      responsable: [null, Validators.compose([Validators.required])],
      personaCalendarios: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.forms.push(this.mantenimientoFormGroup);
    this.forms.push(this.equipoFormGroup);
    this.forms.push(this.personaFormGroup);
  }

  /** Método encargado de gestionar el cambio de pagina de la lista de calendarios de
   * los equipos.
   *
   * @param event Evento que indica el cambio realizado en por el usuario
   */
  changePageEquipoCalendario(event) {
    this.criterialEquipoCalendario.page = event.pageIndex;
    this.criterialEquipoCalendario.size = event.pageSize;
    this.loadEquipoCalendarios();
  }

  /** Método encargado de gestionar el cambio de pagina de la lista de calendarios de
   * las personas.
   *
   * @param event Evento que indica el cambio realizado en por el usuario
   */
  changePagePersonaCalendario(event) {
    this.criterialPersonaCalendario.page = event.pageIndex;
    this.criterialPersonaCalendario.size = event.pageSize;
    this.loadEquipoCalendarios();
  }

  /** Método encargado de gestionar el cambio del equipo seleccionado.
   *
   * @param event Evento que indica el cambio realizado en por el usuario
   */
  changeEquipoCalendarioSelect(equipoCalendario, event) {
    if (event.checked) {
      const calendario = new VisitaEquipocalendarioModel();
      calendario.equipoCalendario = this.getEquipoCalendarioFromDataGrid(equipoCalendario);
      this.listaEquipoCalendario.push(calendario);
      this.listaIdsUniqueChecksEquipoCalendario.push(Number(event.source._uniqueId.split('-')[2]));
    } else {
      for (const key in this.listaEquipoCalendario) {
        if (this.listaEquipoCalendario[key].equipoCalendario.id === equipoCalendario.id) {
          this.listaEquipoCalendario.splice(+key, 1);
          this.listaIdsUniqueChecksEquipoCalendario.splice(+key, 1);
        }
      }
    }
    this.canceledLoadEquipoCalendario = !this.getValidationChecksConsecutives();
    if (this.canceledLoadEquipoCalendario === true) {
      this.listaPersonaCalendario = [];
      this.visita.responsable = new Persona();
      this.responsables = [];
      this.petitionResponsable.unsubscribe();
      // this.petitionResponsableCalendarios.unsubscribe();
    }

    if (this.listaEquipoCalendario.length <= 0) {
      this.visita.calendariosEquipo = null;
    } else {
      this.visita.calendariosEquipo = this.listaEquipoCalendario;
    }

    this.fechaPersona = this.setDateMaxMin(this.listaEquipoCalendario, 'inicio', 'fin');
    this.equipoHasChanged = true;
  }

  /**
   * Método encargado de gestionar los datos de calendarios de los equipos
   *
   * @param data Conjunto de Datos a asignar al modelo de los calendarios de
   * los equipos.
   */
  getEquipoCalendarioFromDataGrid(data: any): any {

    let equipoCalendario = new Equipocalendario();
    //var equipoCalendario = null;
    //let equipoCalendario : any;
    //equipoCalendario = data;    
    equipoCalendario.id = data.id;
    equipoCalendario.activo = data.activo;
    equipoCalendario.inicio = data.inicio;
    equipoCalendario.fin = data.fin;
    equipoCalendario.tipoAsignacion = null;
    equipoCalendario.disponible = true;
    equipoCalendario.disponibilidad = new Equipodisponibilidad();
    // const equipoCalendario as  Equipocalendario();
    equipoCalendario.disponibilidad.id = data.disponibilidadId;
    equipoCalendario.disponibilidad.desde = data.disponibilidadDesde;
    equipoCalendario.disponibilidad.hasta = data.disponibilidadHasta;
    equipoCalendario.disponibilidad.intervalo = data.disponibilidadIntervalo;
    equipoCalendario.disponibilidad.activo = data.disponibilidadActivo;
    // equipoCalendario.disponibilidad.tipoAsignacion = new ListaItem();
    // equipoCalendario.disponibilidad.tipoAsignacion = null;

    equipoCalendario.disponibilidad.turno = new ListaItem();
    equipoCalendario.disponibilidad.turno.id = data.dispTurnoId;
    equipoCalendario.disponibilidad.turno.valor = data.dispTurnoValor;
    equipoCalendario.disponibilidad.turno.descripcion = data.dispTurnoDescripcion;
    equipoCalendario.disponibilidad.turno.activo = data.dispTurnoActivo;
    // if (typeof  equipoCalendario.select !== 'undefined') {
    //   delete equipoCalendario.select;
    // }
    return equipoCalendario;
  }

  /**
   * Método encargado de validar que las opciones seleccionadas de equipo calendario
   * sean consecutivas.
   */
  getValidationChecksConsecutives(): boolean {
    if (this.listaIdsUniqueChecksEquipoCalendario.length <= 1) {
      return true;
    }
    const listaAux = this.listaIdsUniqueChecksEquipoCalendario.sort();
    let last = listaAux[0];
    for (let i = 1; i < listaAux.length; i++) {
      if (listaAux[i] - last > 1) {
        return false;
      }
      last = listaAux[i];
    }
    return true;
  }

  /**
   * Método encargado de asignar la fecha maxima y mínima del calendario disponible 
   *
   * @param attrMayor Elemento maximo permitido
   * @param attrMenor Elemento mínimo permitido
   * @param elements Elementos a mantener en el listado según selección
  */
  setDateMaxMin(elements = [], attrMenor = 'inicio', attrMayor = 'fin'): object {
    let object = {};

    let fechaMaxima = '';
    let fechaMinima = '';

    if (elements.length > 0) {
      elements.map(data => {
        if (!fechaMinima && !fechaMaxima) {
          fechaMinima = data.equipoCalendario[attrMenor];
          fechaMaxima = data.equipoCalendario[attrMayor];
        }
        if (fechaMinima > data.equipoCalendario[attrMenor]) {
          fechaMinima = data.equipoCalendario[attrMenor];
        }
        if (fechaMaxima < data.equipoCalendario[attrMayor]) {
          fechaMaxima = data.equipoCalendario[attrMayor];
        }
      });
    }

    object = { maxima: fechaMaxima, minima: fechaMinima };

    return object;
  }

  /** Método encargado de obtener el listado de las personas responsables
   * permitidas para la visita */
  listResponsables() {
    this.listaPersonaCalendario = [];
    this.visita.responsable = new Persona();
    this.loadingResponsable = true;
    let path = environment.backend;
    const inicio = this.fechaPersona.minima;
    const fin = this.fechaPersona.maxima;
    if (inicio && fin) {
      if (this.petitionResponsable) {
        this.petitionResponsable.unsubscribe();
      }
      path += `${this.constants.path_administracion_persona_visitaprogramada}/inicio/${inicio}/fin/${fin}`;
      this.petitionResponsable = this.visitaService.listResponsables(path).subscribe(data => {
        this.equipoHasChanged = false;
        this.responsables = data;
        this.loadingResponsable = false;
      }, error => {
        this.loadingResponsable = false;
        this.responsables = [];
      });
    } else {
      this.loadingResponsable = false;
      this.responsables = [];
    }
  }

  estadoVisita() {
    this.listaService.listByNombreItem('ESTADO_VISITA', 'Programar visita diagnostico').subscribe(data => {
      this.estadoVisitaDiagnostico = data;
    });
  }

  /**
   * Método encargado de gestionar el cambio de selección de calendarios para personas
   * @param personaCalendario Objeto de persona calendario con la cual se interactuará
   * @param event Evento realizado por el usuario de los calendarios seleccionados para la visita
   */
  changePersonaCalendarioSelect(personaCalendario, event) {
    if (event.checked) {
      const calenadrio = new VisitaPersonacalendarioModel();
      calenadrio.personaCalendario = personaCalendario;
      this.listaPersonaCalendario.push(calenadrio);
    } else {
      for (const key in this.listaPersonaCalendario) {
        if (this.listaPersonaCalendario[key].personaCalendario.id === personaCalendario.id) {
          this.listaPersonaCalendario.splice(+key, 1);
        }
      }
    }
    if (this.listaPersonaCalendario.length <= 0) {
      this.visita.calendariosPersona = null;
    } else {
      this.visita.calendariosPersona = this.listaPersonaCalendario;
    }

  }

  /**
   * Método encargado de realizar el cambio de fecha indicado por el usuario y limpiar
   * la selección de todos los calendarios, personas y equipos seleccioandos
   */
  cambiaFecha() {
    this.listaEquipoCalendario = [];
    this.listaIdsUniqueChecksEquipoCalendario = [];
    this.listaPersonaCalendario = [];
    this.equipoFormGroup.controls.equipoCalendarios.reset();

    this.loadEquipoCalendarios();
    this.loadPersonaCalendarios();
  }

  /**
   * Método encargado de actualizar la información de los mantenimientos
   * seleccionados por el usuario a la visita
   */
  cambioMantenimientos() {
    this.visita.mantenimientos = this.listaPksSelect;
  }

  /**
   * Método encargado de actualizar la información de los equipos
   * seleccionados por el usuario a la visita
   */
  cambioEquipo() {
    this.listaEquipoCalendario = [];
    this.listaIdsUniqueChecksEquipoCalendario = [];
    this.listaPersonaCalendario = [];
    this.loadEquipoCalendarios();
  }

  /**
   * Método encargado de actualizar la información de las personas
   * seleccionados por el usuario a la visita
   */
  cambioPersona() {
    this.listaPersonaCalendario = [];
    this.loadPersonaCalendarios();
  }

  /** Método encargado de limpiar los datos del formulario de consulta */
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
    this.tiempoRuta = '';
    this.visita.rutaMapa = '';
    this.rutaTextoCalculada = '';
    this.mapService.getVisor().ruteoLimpiar();
  }

  /** Sobre escritura del método de selección de pks cuando el usuario selecciona
   * un mantenimiento
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   **/
  select(mantenimiento) { }

  /**
   * Método encargado de realizar solicitud de almacenamiento al servicio
   *
   * @param section Sección de la cual se va a actualizar la información
   * @parm form Grupo de campos que serán usados en el formulario
  */
  save(section: string, form: FormGroup): void {
    this.processing = true;
    let esValido: boolean;
    if (form == null) {
      esValido = true;
    } else {
      esValido = this.validate(form);
    }

    if (esValido) {
      this.visita.estadoVisita = this.estadoVisitaDiagnostico;
      this.utilitiesServices.scrollToTop();
      this.visitaService.create(this.visita).subscribe(
        data => {
          this.snackBar.open(this.constants.successSave, 'X', {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
          this.processing = false;
          this.newVisita = false;
          this./** Método encargado de inicializar el componente al ser creada nueva instancia */
            new();
          this.activarRuteoBool = true;
          this.tiempoRuta = '';
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

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new() {
    this.processing = true;
    this.visita = new VisitaModel();
    this.mantenimientoFormGroup.reset();

    this.listaEquipoCalendario = [];
    this.listaIdsUniqueChecksEquipoCalendario = [];
    this.listaPersonaCalendario = [];
    this.listaPksSelect = [];
    this.fechaPersona = {};
    this.responsables = [];
    this.ultimaFechaSeleccionada = '';
    this.orderEquipoCalendarioActivated = false;
    this.workflowService.get(this.data.actividad.proceso.url, this.data.actividad.url).subscribe((data) => {
      this.data = data;
      this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
      this.lastAction = this.currentAction;
      this.currentAction = 'create';
      this.processing = false;
      this.newVisita = true;

      this.mapService.getVisor().ruteoLimpiar();
      this.isReload = true;
      this.ngOnInit();
      this.mapService.getVisor().mostrarRuteo();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Método encargado de gestionar el cambio de selección de ruta indicada
   * por el usuario
   *
   * @param timeNoFormat Formado en el cual se encuentra la fecha para procesamiento
   */
  changeTiempoRuta(timeNoFormat) {
    if (typeof timeNoFormat === 'number') {
      const tiempoR: any = timeNoFormat;
      const HorasRuta = moment.duration(tiempoR, 'hours').hours();
      const MinutosRuta = moment.duration(tiempoR, 'hours').minutes();
      const DiasRuta = moment.duration(tiempoR, 'hours').days();
      if (tiempoR > 24) {
        this.tiempoRuta = DiasRuta + ' dias, ' + HorasRuta + ' horas, ' + MinutosRuta + ' minutos';
      } else {
        this.tiempoRuta = HorasRuta + ' horas, ' + MinutosRuta + ' minutos';
      }
    } else {
      this.tiempoRuta = '';
      this.visita.rutaMapa = null;
      this.rutaTextoCalculada = '';
      this.loadEstado();
      this.initDataSource();
    }
  }

  /**
   * Método encargado de seleccionar el cambio de ruta indicada
   * por el usuario
   *
   * @param routeMapString Cadena de texto de los pks que incuyen la ruta
   */
  setRuta(routeMapString) {
    if (routeMapString) {
      this.rutaTextoCalculada = routeMapString;
      this.visita.rutaMapa = this.rutaTextoCalculada;
    } else {
      this.visita.rutaMapa = null;
    }
  }

  /**
   * Método encargado de gestionar el cambio de rutas de los pks para el componente
   *
   * @param event Evento de selección del usuario
   */
  onStepChange(event: any): void {
    this.eventStepper = event;
    this.setMapaSteper();
    const fechaConsulta = this.utilitiesServices.getFechaServerFormat_aaaaMMddNoSeparator(this.visita.fecha);
    if (event.selectedIndex === 1 && this.ultimaFechaSeleccionada !== this.visita.fecha) {
      if (!this.orderEquipoCalendarioActivated) {
        this.subscribeSoortEquipoCalendario();
        this.orderEquipoCalendarioActivated = true;
      }
      this.processing = true;
      this.listaService.getFirstItemByValor(fechaConsulta).subscribe(fechaItem => {
        this.processing = false;
        this.stepper.selectedIndex = 0;
        this.setMapaSteper();
        this.snackBar.open(this.constants.errorFechaDiaNoHabil, 'X', {
          duration: 10000,
          panelClass: ['warning-snackbar']
        });
      }, error => {
        this.processing = false;
        if (error.status === 404) {
          this.ultimaFechaSeleccionada = this.visita.fecha;
        } else {
          this.snackBar.open(
            this.constants.error500, 'X', {
            duration: 6000,
            panelClass: ['error-snackbar']
          }
          );
        }
      });
    }

    if (this.eventStepper.selectedIndex === 2 &&
      (this.eventStepper.previouslySelectedIndex === 1 || this.eventStepper.previouslySelectedIndex === 0)) {
      this.canceledLoadEquipoCalendario = !this.getValidationChecksConsecutives();
      if (this.canceledLoadEquipoCalendario === false && this.equipoHasChanged === true) {
        if (!this.orderPersonaCalendarioActivated) {
          // this.subscribeSoortPersonaCalendario();
          this.updateDataSourcePersona();
          this.orderPersonaCalendarioActivated = true;
        }
        this.listResponsables();
      } else {
        console.log('Error: Unicamente se permite seleccionar registros de disponibilidad continuos');
      }
    }

  }

  /**
   * Método encargado de asignar la actualización de la ruta indicada por el usuario
   * en el mapa.
   */
  setMapaSteper(): void {
    if (this.eventStepper === undefined) {
      this.mapService.getVisor().mostrarRuteo();
    } else {
      if (this.eventStepper.selectedIndex === 0 &&
        (this.eventStepper.previouslySelectedIndex === 1 || this.eventStepper.previouslySelectedIndex === 2)) {
        this.mapService.getVisor().mostrarRuteo();
        this.mapService.getVisor().mostrarControlesSeleccionMultiple();
      } else {
        this.mapService.getVisor().ocultarRuteo();
        this.mapService.getVisor().ocultarControlesSeleccionMultiple();
        this.rutaVisitaPk = this.rutaTextoCalculada;
      }
    }
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.tiempoRuta = '';
    this.mapService.getVisor().ruteoLimpiar();
    this.mapService.getVisor().ocultarRuteo();
    this.mapService.getVisor().inRouting = false;
    this.mapService.disconectGrid();
  }

  /** Método encargado de mostrar la información del equipo en un modal*/
  showEquipo(equipo: Equipo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(DetailEquipoComponent, dialogConfig);
  }

  /**
   * Método encargado de localizar el mantenimiento indicado en el mapa
   *
   * @param mantenimiento Objeto de tipo mantenimiento a localizar
  */
  localizarMantenimientoMapa(mantenimiento) {
    this.mapService.getVisor().localizar(mantenimiento);
  }

  /**
   * Método encargado de cargar los datos de pks según pk indicado
   *
   * @param pk Pk a filtrar
  */
  public setPkFiltro(pk: any) {
    this.criteria.pk = pk;
    this.loadData();
  }
}
