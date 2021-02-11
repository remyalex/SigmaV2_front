import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { Permiso } from './../../../../administracion/permisos/models/permiso.model';
// tslint:disable-next-line: max-line-length
import { VisitaModel, VisitaEquipocalendarioModel, VisitaPersonacalendarioModel } from 'src/app/workflow/models/visita.model';
import { Condicion } from './../../../../mejoramiento/historial-mantenimiento/models/modelsForQuery.model';
import { MapService } from './../../../../shared/services/map.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Condiciones } from 'src/app/administracion/transicioncondiciones/models/condiciones.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../shared/diagnostico.constants';
import { EquipocalendarioCalendarsCriteria } from 'src/app/administracion/equipocalendario/models/equipocalendario-criteria.model';
import { EquipocalendarioDatasource } from 'src/app/administracion/equipocalendario/services/equipocalendario.datasource';
import { Equipocalendario } from 'src/app/administracion/equipocalendario/models/equipocalendario.model';
import { PersonacalendarioCalendarsCriteria, PersonacalendarioCriteria } from 'src/app/administracion/personacalendario/models/personacalendario-criteria.model';
import { PersonacalendarioDatasource } from 'src/app/administracion/personacalendario/services/personacalendario.datasource';
import { Personacalendario } from 'src/app/administracion/personacalendario/models/personacalendario.model';
import { CONST_ADMINISTRACION_EQUIPO } from 'src/app/administracion/equipo/equipo.constant';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from 'src/app/administracion/equipocalendario/equipocalendario.constant';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { DetailEquipoComponent } from '../shared/detail-equipo/detail-equipo.component';
import { EquipocalendarioService } from 'src/app/administracion/equipocalendario/services/equipocalendario.service';
import { PersonacalendarioService } from 'src/app/administracion/personacalendario/services/personacalendario.service';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { environment } from 'src/environments/environment';
import { VisitaService } from 'src/app/workflow/services/visita.service';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from 'src/app/administracion/personacalendario/personacalendario.constant';
import { CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { Equipodisponibilidad } from 'src/app/administracion/equipodisponibilidad/models/equipodisponibilidad.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { ListaItemsService } from 'src/app/administracion/listas-items/services/listas-items.service';

/** Componente encargado de gestionar los consolidados de visitas técnicas */
@Component({
  selector: 'app-consolidado-visita-tecnica',
  templateUrl: './consolidado-visita-tecnica.component.html'
})
export class ConsolidadoVisitaTecnicaComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Bandera que permite identificar si el acordeón
   * se presenta de forma secuencial al usuario */
  isLinear = true;

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de mantenimiento seleccionados por el usuario en la grilla*/
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];

  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'fechaProgramacionVisita', // Fecha de la programación de visita
    'numeroMovilVisitaTecnica', // Número de movil asignado a la visita',
    'responsableVisitaTecnica', // Nombre del responsable de la visita o quien usa vehiculo.
    'origen',
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'fechaProgramacionVisita',
    'origen'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'route', label: 'Mostrar ruta', icono: 'directions_car', color: 'primary' }
  ];

  /** Variable usada para enviar a la funcionalidad de programar visita técnica
   * de acciones de aforos a ejecutar para el mantenimiento en este componente */
  accionesConsolidado: GridAccion[] = [
    { nombre: 'work', label: 'Programar Otros', icono: 'call_made', color: 'primary' },
  ];

  /** Variable usada para almacenar los filtros precargados que se
   * ejecutaran en la grilla al inicializar el componente de sigma grilla */

  preloadFilters: KeyValuePair[] = [
    {
      key: 'fechaProgramacionVisitaDesde',
      value: this.utilitiesServices.getFechaServerFormat_ddMMaaaa(this.getFechaSiguiente())
    },
    {
      key: 'fechaProgramacionVisitaHasta',
      value: this.utilitiesServices.getFechaServerFormat_ddMMaaaa(this.getFechaSiguiente())
    }
  ];

  /** PROGRAMAR OTROS: VARIABLES - OBJETOS */
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Constantes de equipo a usar en el componente */
  constantsEquipo = CONST_ADMINISTRACION_EQUIPO;
  /** Constantes de calendarios de equipos a usar en el componente */
  constantsEquipoCalendario = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Constantes de personas de calendario a usar en el componente */
  constantspersonaCalendario = CONST_ADMINISTRACION_PERSONACALENDARIO;
  /** Formulario contenedor del componente */
  forms: FormGroup[] = [];
  /** Formulario de equipo usado en el componente */
  equipoFormGroup: FormGroup;
  /** Formulario de equipo usado en el componente */
  responsableFormGroup: FormGroup;
  /** Formulario de equipo usado en el componente */
  origenFormGroup: FormGroup;
  /** Objeto del mantenimiento que se procesará en el componente */
  visitaPo: VisitaModel = new VisitaModel();
  /** Objeto para criterio por el cual se realizará la búsqueda de equipos calendarios */
  criterialEquipoCalendario: EquipocalendarioCalendarsCriteria = new EquipocalendarioCalendarsCriteria();
  /**  Fuente de conjunto de datos de calendarios del equipo
   * para manejo de grilla del componente */
  dataSourceCalendarioEquipo: EquipocalendarioDatasource;
  /** Listado de calendarios seleccionados por el usuario para equipos*/
  listaEquipoCalendario: any[] = [];
  /** Objeto para criterio por el cual se realizará la búsqueda de personas calendarios */
  criterialPersonaCalendario: PersonacalendarioCalendarsCriteria = new PersonacalendarioCalendarsCriteria();
  /** Listado de calendarios seleccionados por el usuario para personas*/
  listaPersonaCalendario: any[] = [];
  /**  Fuente de conjunto de datos del calendario de personas
   * para manejo de grilla del componente */
  dataSourceCalendarioPersona: PersonacalendarioDatasource;
  /** Fecha de programación de la visita */
  fechaPersona: any = {};
  /** Lista de calendarios seleccionados de la persona */
  _calendarioPersonas: Personacalendario[] = [];
  /** Bandera que indica si la carga de los equipos calendarios ha sido cancelada */
  canceledLoadEquipoCalendario = false;
  /** Paginador de la a grilla de personas*/
  @ViewChild('paginatorPersonaCalendario') paginatorPersonaCalendario: MatPaginator;
  /** Ordenador de la la grilla de personas*/
  @ViewChild('sortPersonaCalendario') sortPersonaCalendario: MatSort;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSourceCalendarioPersonaLocal: MatTableDataSource<Personacalendario>;
  /** Lista de ids de los equipos seleccionados por el usuario */
  listaIdsUniqueChecksEquipoCalendario: number[] = [];
  /** Variable para encapsular la información del equipo */
  equipoInfo = {
    placa: this.constantsEquipo.placa,
    movil: this.constantsEquipo.movil,
    numeroInterno: this.constantsEquipo.numeroInterno,
  };

  /** Definición de las columnas presentadas en la grilla de equipos*/
  columnsEquipo = [
    'inicio', 'fechaDia', 'numeroMovil', 'horario', 'select'
  ];
  /** Personas responsables de la realización de la visita técnica */
  responsables: any = [];
  /** Lista origen de la visita */
  listaOrigen: any = [];
  /** Bandera que permite identificar si se encuentra cargando el campo de responsable*/
  loadingResponsable = false;
  /** Bandera que permite identificar si se encuentra cargando el origen*/
  loadingOrigen = false;
  /** Variable usada para gestionar las peticiones del responsable */
  petitionResponsable: any;
  /** Bandera que indica si el listado de equipos seleccionados a sido modificado */
  equipoHasChanged = true;
  /** Definición de las columnas presentadas en la grilla de personas*/
  columnsPersona = [
    'fecha', 'dia', 'responsable', 'horario', 'select'
  ];
  /** Variable usada para hacer uso del evento asociado al stepper del componente */
  eventStepper: any;
  /** Variable estado  */
  estadoVisitaPo: any;


  /**
 * Método encargado de construir una instancia de componente
 *
 * @param servicio Servicio usado en el componente para gestionar las peticiones
 * @param snackBar Componente usado para abrir un recuadro modal
 * @param utilitiesServices Componente de utilidades de peticiones a servicios
 * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
 * @param commonService Componente usado para invocar los servicios de mantenimiento
 * @param workflowService Componente usado para invocar los servicios de workflow
 * @param tokenStorageService Componente usado para obtener información del token del usuario
 * @param mapService Componente usado para gestionar información del mapa
 * @param formBuilder Componente usado para gestionar los elementos del formulario
 * @param personacalendarioServicio  Servicio usado en el componente para gestionar las peticiones de personas calendarios
 * @param equipocalendarioServicio  Servicio usado en el componente para gestionar las peticiones de equipos calendarios
 * @param visitaService Servicio usado en el componente para gestionar las peticiones de visitas
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
    private dialog: MatDialog,
    mapService: MapService,
    private router: Router,
    private equipocalendarioServicio: EquipocalendarioService,
    private personacalendarioServicio: PersonacalendarioService,
    private visitaService: VisitaService,
    private listaServicio: ListasService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mantenimientosSeleccionados = [];

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.defaultFilters = [
      { 'key': 'permisoId', 'value': '3' }
    ];

    this.commonService.getCondicionByNombre('Consolidado visitas técnicas programadas').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }


  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event: any) {
    switch (event.accion) {
      case 'route':
        this.mostrarRuta(event.mantenimiento);
        break;
      case 'work':
        this.programarOtros();
        break;
    }
  }

  /**
   * Método encargado de redireccionar a la funcionaliadad de programaión de visita
   * relacionados con el mantenimiento indicado
   */
  public programarOtros() {
    this.createForms();
    this.initOtherDataSource();
    this.loadEquipoCalendarios();
    this.listOrigen();
    this.estadoVisita();
    this.visitaPo['fechaMinima'] = this.utilitiesServices.convertDateToString(new Date());
    this.currentAction = 'work';
  }

  /**
   * Método encargado de redireccionar a la programación de visita técnica
   */
  programarVisitaTecnica() {
    console.log(this.mantenimientosSeleccionados);
    this.processing = true;
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
    for (const mantenimiento of this.mantenimientosSeleccionados) {
      const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
      mantenimientoActividad.mantenimiento = mantenimiento;
      mantenimientoActividad.actividad = this.data.actividad;
      mantenimientoActividad.observaciones = this.data.observaciones;
      mantenimientoActividad.transicion = new WorkflowTransicionModel();
      mantenimientoActividad.transicion.actividadInicial = this.data.actividad;
      mantenimientoActividad.transicion.activo = true;
      mantenimientoActividad.transicion.id = 55;
      mantenimientoActividad.usuarioAsignado = new UsuarioInfo();
      mantenimientoActividad.usuarioAsignado.id = +this.tokenStorageService.getId();
      mantenimientoActividad.transicion.nombre = 'Enviar a programación de visita técnica (otros)';
      mantenimientoActividad.transicion.esMasiva = false;
      mantenimientoActividad.transicion.actividadFinal = new WorkflowActividadModel();
      mantenimientoActividad.transicion.actividadFinal = new WorkflowActividadModel();
      mantenimientoActividad.transicion.actividadFinal.descripcion = 'Enviar a programación de visita técnica (otros)';
      mantenimientoActividad.transicion.actividadFinal.id = 11;
      mantenimientoActividad.transicion.actividadFinal.nombre = 'Programar visita diagnóstico';
      mantenimientoActividad.transicion.actividadFinal.url = 'programar-visita-diagnostico';
      mantenimientosActividad.push(mantenimientoActividad);
    }

    this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
      this.utilitiesServices.scrollToTop();
      this.processing = false;
      let ruta = '/workflow/planificacion/programar-visita-diagnostico';
      this.router.navigate([ruta]);
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
      this.processing = false;
    });
  }

  /**
   * Método encargado de obtener la fecha del dia siguiente
   */
  getFechaSiguiente() {
    const date: Date = new Date();
    date.setDate((new Date()).getDate() + 1);
    return date;
  }

  /**
   * Método encargado de mostrar la ruta de la visita técnica
   *
   * @param mantenimiento Mantenimiento en el cual se realizará
   * el punto de inicio de la ruta
   **/
  mostrarRuta(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().limpiar();
    if (mantenimiento.visitas !== null && mantenimiento.visitas.length > 0) {
      const visita: VisitaModel = mantenimiento.visitas[0];
      if (visita.rutaMapa !== null && visita.rutaMapa !== undefined) {
        this.mapService.getVisor().dibujarRutaJson(visita.rutaMapa);
      } else {
        this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
      }
    } else {
      this.snackBar.open('No hay una ruta para el mantenimiento seleccionado', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /****************************************** PROGRAMAR OTROS *******************************************/

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          this.goHome();
        }
      }
    );
  }

  /**
   * Método encargado de inicializar la fuente de datos de los calendarios
   * de personas y equipos.
   */
  initOtherDataSource() {
    this.dataSourceCalendarioEquipo = new EquipocalendarioDatasource(this.equipocalendarioServicio);
    this.dataSourceCalendarioPersona = new PersonacalendarioDatasource(this.personacalendarioServicio);
    this.dataSourceCalendarioPersonaLocal = new MatTableDataSource([]);
  }

  /**
   * Método encargado de gestionar el cambio de rutas de los pks para el componente
   *
   * @param event Evento de selección del usuario
   */
  onStepChange(event: any): void {
    this.eventStepper = event;
    const fechaConsulta = this.utilitiesServices.getFechaServerFormat_aaaaMMddNoSeparator(this.visitaPo.fecha);
    if (this.eventStepper.selectedIndex === 1 && this.equipoHasChanged === true) {
      this.listResponsables();
    }

  }

  /** Método encargado de crear los formularios de Programar Otros */
  createForms() {
    this.equipoFormGroup = this.formBuilder.group({
      fecha: [null, Validators.compose([Validators.required])],
      equipo: [null, Validators.compose([Validators.required])],
      equipoCalendarios: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.responsableFormGroup = this.formBuilder.group({
      responsable: [null, Validators.compose([Validators.required])],
      personaCalendarios: [null, Validators.compose([Validators.required, CountMinElementsValidator(1)])]
    });

    this.origenFormGroup = this.formBuilder.group({
      inputOrigen: [null, Validators.compose([Validators.required])]
    });

    this.forms.push(this.equipoFormGroup);
    this.forms.push(this.responsableFormGroup);
    this.forms.push(this.origenFormGroup);
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
   * Método encargado de actualizar la información de los equipos
   * seleccionados por el usuario a la visita
   */
  cambioEquipo() {
    this.listaEquipoCalendario = [];
    this.listaIdsUniqueChecksEquipoCalendario = [];
    this.listaPersonaCalendario = [];
    this.loadEquipoCalendarios();
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

  /** Método encargado de realizar la carga de daros de los calendarios de equipos segun
   * el equipo indicado por la visita */
  loadEquipoCalendarios() {
    if (this.visitaPo.equipo.id) {
      this.criterialEquipoCalendario.equipo = this.visitaPo.equipo.id;
      this.criterialEquipoCalendario.inicio = this.utilitiesServices.convertDateToString(this.visitaPo.fecha, 'YYYY-MM-DD');
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
    if (this.visitaPo.responsable !== undefined && this.visitaPo.responsable.id) {
      this.criterialPersonaCalendario.persona = this.visitaPo.responsable.id;
      this.criterialPersonaCalendario.inicio = this.fechaPersona.minima;
      this.criterialPersonaCalendario.fin = this.fechaPersona.maxima;
      const path =
        // tslint:disable-next-line: max-line-length
        `/api/administracion/personacalendario/persona/${this.visitaPo.responsable.id}/inicio/${this.fechaPersona.minima}/fin/${this.fechaPersona.maxima}/calendars`;
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

  /**
   * Método encargado de mantener actualizada la información de los calendarios
   * de las personas según listado presentado
   */
  updateDataSourcePersona() {
    this.dataSourceCalendarioPersonaLocal.data = this._calendarioPersonas;
    this.dataSourceCalendarioPersonaLocal.paginator = this.paginatorPersonaCalendario;
    this.dataSourceCalendarioPersonaLocal.sort = this.sortPersonaCalendario;
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
      this.visitaPo.responsable = new Persona();
      this.responsables = [];
      this.petitionResponsable.unsubscribe();
      // this.petitionResponsableCalendarios.unsubscribe();
    }

    if (this.listaEquipoCalendario.length <= 0) {
      this.visitaPo.calendariosEquipo = null;
    } else {
      this.visitaPo.calendariosEquipo = this.listaEquipoCalendario;
    }

    this.fechaPersona = this.setDateMaxMin(this.listaEquipoCalendario, 'inicio', 'fin');
    this.equipoHasChanged = true;
  }

  cambioPersona() {
    this.listaPersonaCalendario = [];
    this.loadPersonaCalendarios();
  }

  /** Método encargado de obtener el listado de las personas responsables
   * permitidas para la visita */
  listResponsables() {
    this.listaPersonaCalendario = [];
    this.visitaPo.responsable = new Persona();
    this.loadingResponsable = true;
    let path = environment.backend;
    const inicio = this.fechaPersona.minima;
    const fin = this.fechaPersona.maxima;
    if (inicio && fin) {
      if (this.petitionResponsable) {
        this.petitionResponsable.unsubscribe();
      }
      path += `${this.constants.path_administracion_personas_disponibles_usu_interno}/inicio/${inicio}/fin/${fin}`;
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

  /**
   * Método encargado de obtener la lista de origenes
   */
  estadoVisita() {
    this.listaServicio.listByNombreItem('ESTADO_VISITA', 'Programar otros').subscribe(data => {
      this.estadoVisitaPo = data;
    });
  }

  /**
   * Método encargado de obtener la lista de origenes
   */
  listOrigen() {
    this.loadingOrigen = true;
    this.listaServicio.listByNombre('ORIGEN_PROGRAMACION_VISITA').subscribe(data => {
      this.listaOrigen = data;
      this.loadingOrigen = false;
    });
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

  /**
     * Método encargado de obtener la cantidad de personas seleccionadas
     * por el usuario en la grilla
     */
  getCantidadPersonas() {
    return this._calendarioPersonas.length;
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
      this.visitaPo.calendariosPersona = null;
    } else {
      this.visitaPo.calendariosPersona = this.listaPersonaCalendario;
    }

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

  /**
   * Método encargado de realizar solicitud de almacenamiento al servicio
   *
   * @param section Sección de la cual se va a actualizar la información
   * @parm form de campos que serán usados en el formulario
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
      this.visitaPo.estadoVisita = this.estadoVisitaPo;
      this.utilitiesServices.scrollToTop();
      this.visitaService.create(this.visitaPo).subscribe(
        data => {
          this.snackBar.open(this.constants.successSave, 'X', {
            duration: 10000,
            panelClass: ['success-snackbar']
          });
          this.processing = false;
          //this.new();
          this.goHome();
          //let ruta = '/workflow/planificacion/programar-visita-diagnostico';
          //this.router.navigate([ruta]);
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
    }
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new() {
    this.processing = true;
    this.visitaPo = new VisitaModel();
    this.equipoFormGroup.reset();
    this.responsableFormGroup.reset();
    this.origenFormGroup.reset();

    this.listaEquipoCalendario = [];
    this.listaIdsUniqueChecksEquipoCalendario = [];
    this.listaPersonaCalendario = [];
    this.listaPksSelect = [];
    this.fechaPersona = {};
    this.responsables = [];
    this.workflowService.get(this.data.actividad.proceso.url, this.data.actividad.url).subscribe((data) => {
      this.data = data;
      this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
      this.lastAction = this.currentAction;
      this.currentAction = 'work';
      this.processing = false;
      this.programarOtros();
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

}
