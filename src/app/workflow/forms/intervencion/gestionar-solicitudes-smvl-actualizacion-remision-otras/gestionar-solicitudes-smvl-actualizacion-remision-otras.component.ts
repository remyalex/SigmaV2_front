import { CONST_GESTIONAR_SOLICITUDES_ACTUALIZACION_REMISION_OTRAS } from './gestionar-solicitudes-actualizacion-remision-otras-constants';
import { GridMantenimientosComponent } from './../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { GridAccion } from './../../../../shared/component/grid-mantenimientos/model/grid-accion.model';
import { KeyValuePair } from './../../../../shared/models/key-value-pair.model';
import { MapService } from 'src/app/shared/services/map.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { Component, OnInit } from '@angular/core';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import * as _moment from 'moment';
import { SolicitudSmvlGasa } from '../../../models/solicitud-smvl-gasa';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';


@Component({
  selector: 'app-gestionar-solicitudes-smvl-actualizacion-remision-otras',
  templateUrl: './gestionar-solicitudes-smvl-actualizacion-remision-otras.component.html'
})

export class GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent extends
  BaseComponent implements OnInit, AfterViewChecked, FormComponent {

  @ViewChild('grid') gridSMVL: GridMantenimientosComponent;
  @ViewChild('grid2') gridSMVL2: GridMantenimientosComponent;
 /** Constantes a usar en el componente */
  constants = CONST_GESTIONAR_SOLICITUDES_ACTUALIZACION_REMISION_OTRAS;
  transicionSMVL = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'tipoIntervencion',
    'radicadoIntervencion',
    'responsable',
  ];

  columnsSmvl = [
    'pk',
    'zona',
    'localidad',
    'radicadoIntervencion',
    'fechaInicioVisita',
    'fechaFinVisita',
    'fechaVisitaTecnica',
    'directorDeObra',
    'estadoProgramacionPk',
    'requiereActualizacionDiagnostico',
    'numeroActaIntervencion',
    'fechaSolicitudSmvl',
    'numeroRadicadoSmvl'
  ];

  filtersTransicionesSmvl = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'radicadoIntervencion',
    'listaChequeoSmvl'
  ];

  filtersSmvl = [
    'zona',
    'listaChequeoSmvl',
  ];


  accionesMasivasGridUno: GridAccion[] = [
    {
      nombre: 'enviarSolicitud',
      label: 'Enviar Solicitud',
      icono: 'create',
      color: 'primary'
    }
  ];

  accionGuardarTodo: GridAccion[] = [
    {
      nombre: 'solicitudSmvl',
      label: 'Enviar Solicitud',
      icono: 'create',
      color: 'primary'
    },
    {
      nombre: 'Cancelar',
      label: 'Cancelar',
      icono: 'cancel',
      color: 'warn'
    },
    {
      nombre: 'GuardarTodo',
      label: 'Guardar Todo',
      icono: 'save',
      color: 'primary'
    }
  ];

  accionesMasivasSmvl: GridAccion[] = [
    {
      nombre: 'solicitudSmvl',
      label: 'Enviar Solicitud',
      icono: 'create',
      color: 'primary'
    },
    {
      nombre: 'Cancelar',
      label: 'Cancelar',
      icono: 'cancel',
      color: 'warn'
    }
  ];

  accionesVerDetalles: GridAccion[] = [
    { nombre: 'VerDiagnosticoMejoramiento', label: 'Ver Visita de diagnóstico', icono: 'visibility', color: 'primary' },
    { nombre: 'VerDiagnosticoIntervencion', label: 'Ver Visita de intervención', icono: 'build', color: 'primary' },
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [];
  mantenimientosSeleccionados: Array<WorkflowMantenimientoModel>;

  grid: GridMantenimientosComponent;
  zona: ListaItem;
  listaChequeoSMVL: ListaItem;
  fechaRadicadoSMVL: string;
  numeroRadicadoSMVL: string;
  numeroRadicadoConsultado: SolicitudSmvlGasa;
  listaSolicitudesSmvlGasa: SolicitudSmvlGasa[];
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  showTransitionComponent = false;

  // Constructor del componente
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    this.showTransitionComponent = false;
    this.mapService.getVisor().visible = true;
    this.fechaRadicadoSMVL = this.utilitiesServices.getFechaServerFormat_ddMMaaaa(new Date());

    this.defaultFilters = [
      { key: 'actividadId', value: String(this.data.actividad.id) },
      { key: 'actividadActualId', value: String(this.data.actividad.id) }
    ];

    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {

      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.commonService.getCondicionByNombre('PK_PENDIENTE_GESTIONAR_ACTUALIZACION_DIAGNOSTICO_SMVL').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  ejecutarDetalles(event) {
    switch (event.accion) {
      case 'VerDiagnosticoMejoramiento':
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.currentAction = this.constants.verDiagnosticoMejoramiento;
        break;
      case 'VerDiagnosticoIntervencion':
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.currentAction = this.constants.VerDiagnosticoIntervencion;
        break;
    }
  }



  enviarSolicitud(event) {

    this.numeroRadicadoConsultado = new SolicitudSmvlGasa();
    const _this  = this;
    this.commonService.getNumeroRadicadoSolicitudActualizacionDiagSmvlGasa().subscribe(_numRadicado => {
      this.numeroRadicadoConsultado = _numRadicado;

      if (this.numeroRadicadoConsultado.numeroRadicadoSmvl === null) {
        this.numeroRadicadoSMVL = _this.utilitiesServices
        .convertDateToString(_this.utilitiesServices.getFechaClientFormatFix(this.fechaRadicadoSMVL), 'DDMMYYYY');
        this.numeroRadicadoSMVL = this.numeroRadicadoSMVL + '-0001';
      } else {
        if (typeof this.numeroRadicadoConsultado !== 'undefined') {
          const element = _numRadicado.numeroRadicadoSmvl.split('-');
          this.numeroRadicadoSMVL = _numRadicado.numeroRadicadoSmvl;
        }

      }
      this.currentAction = 'solicitudSmvl';
      setTimeout(function() {
        _this.gridSMVL2.search();
      }, 200);
    });
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'solicitudSmvl':
        this.asignarSolicitudSmvl(event.mantenimientos);
        this.currentAction = 'solicitudSmvl';
        break;
      case 'Cancelar':
        this.cancelar();
        this.onBack();
        break;
      case 'GuardarTodo':
        this.guardarTodo();
        break;
    }
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    this.currentAction = 'list';
    this.search();
  }

  cancelar() {
    this.showTransitionComponent = false;

    if (typeof this.mantenimientosSeleccionados !== 'undefined'){
      for (let i = 0; i <= this.mantenimientosSeleccionados.length - 1; i++) {
        this.mantenimientosSeleccionados[i].solicitudesSmvlGasa =  null;
        this.saveMantenimientoGridSL(this.mantenimientosSeleccionados);
      }
    }
  }

  guardarTodo() {
    this.showTransitionComponent = true;
  }

  asignarSolicitudSmvl(mantenimiento: WorkflowMantenimientoModel[]) {
    debugger;
    let i: number;
    this.mantenimientosSeleccionados = [];
    this.accionesMasivasSmvl = [];
    this.accionesMasivasSmvl = this.accionGuardarTodo;

    for (i = 0; i <= mantenimiento.length - 1; i++) {
      let solicitudSmvlGasa = new SolicitudSmvlGasa();
      let fechatemp: string;
      fechatemp = this.utilitiesServices.getFechaServerFormatLite_ddMMaaaa(new Date());
      solicitudSmvlGasa.fechaSolicitudSmvl = this.utilitiesServices.getFechaServerFormat_ddMMaaaa(new Date());

      if (this.numeroRadicadoConsultado.numeroRadicadoSmvl === null) {
        solicitudSmvlGasa.numeroRadicadoSmvl = fechatemp + '-0001';
        this.numeroRadicadoSMVL = fechatemp + '-0001';
        solicitudSmvlGasa.consecutivo = 1;
      } else {
        solicitudSmvlGasa.numeroRadicadoSmvl = this.numeroRadicadoConsultado.numeroRadicadoSmvl;
        this.numeroRadicadoSMVL = this.numeroRadicadoConsultado.numeroRadicadoSmvl;
        const element = this.numeroRadicadoConsultado.numeroRadicadoSmvl.split('-');
        solicitudSmvlGasa.consecutivo = parseInt(element[1], 10);
      }

      solicitudSmvlGasa.listaChequeo = this.listaChequeoSMVL;
      let mantenimientoObj = new WorkflowMantenimientoModel();
      mantenimientoObj.id = mantenimiento[i].id;
      mantenimientoObj.fechaVisitaTecnica = null;
      this.mantenimientosSeleccionados.push(mantenimiento[i]);
      solicitudSmvlGasa.mantenimiento = mantenimientoObj;
      this.mantenimientosSeleccionados[i].solicitudesSmvlGasa.push(solicitudSmvlGasa);
    }

    this.data.transicion = null;
    this.saveMantenimientoGridSL(this.mantenimientosSeleccionados);
    this.gridSMVL.search();
  }


}
