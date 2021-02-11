import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';


/** Componente encargado de gestionar la vinculación de un radicado  */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-vincular-radicado-peticionario',
  templateUrl: './vincular-radicado-peticionario.component.html'
})
export class VincularRadicadoPeticionarioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Columnas a presentar en la grilla de los pks sin gestión */
  columnsPkSinGestion = [
    'pk',
    'civ',
    'estadoPk',
    'kmCarrilImpacto',
    'zona',
    'localidad',
    'barrio'
  ];

  /** Filtros en las columnas a presentar en la grilla de los pks sin gestión */
  filtersPkSinGestion = [
    'pk',
    'civ',
    'estadoPk',
    'zona',
    'localidad',
    'barrio'
  ];

  /** Acciones para realizar en la acción de mantenimiento de la grilla de pks sin gestión */
  accionesPkSinGestion: GridAccion[] = [
    { nombre: 'vincular', label: 'radicado de entrada', icono: 'edit', color: 'primary' },
  ];

  /** Listado de columas para transicion a presentar en la grilla */
  columnsTransiciones = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'barrio',
    'estadoPk',
    'kmCarrilImpacto',
    'solicitudRadicadoEntrada',
  ];

  /** Listado de columas para filtros de transicion a presentar en la grilla */
  filtersTransiciones = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'barrio',
    'estadoPk'
  ];

  /** Acciones a presentar en la grilla */
  accionesTransiciones: GridAccion[] = [
    { nombre: 'desvincular', label: 'radicado de entrada', icono: 'delete', color: 'warn' }
  ];

  /** Listado de Origenes posibles para el pk */
  origenPk: ListaItem;
  /** Criterio de consulta de radicado de entrada */
  entradaConsultaRadicadoEntrada: string;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Formulario para consulta de pks */
  formularioConsultaPK: FormGroup;
  /** Formulario para busquedas de pks en la grilla */
  formularioConsultaRadicadoEntrada: FormGroup;

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
    mapService: MapService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    // Definición de formularios
    this.formularioConsultaPK = this.formBuilder.group({
      'entradaConsultaPK': [],
      'pk': [null, Validators.compose([Validators.required])],
      'civ': [null, Validators.compose([Validators.required])],
      'calzadaAncho': [],
      'calzadaArea': [],
      'localidadNombre': [],
      'barrioNombre': [],
      'ejeVial': [],
      'upla': [],
      'malla': [],
      'sectorNombre': [],
      'longitud': [],
      'estadoMantenimiento': [],
      'estadoPk': [{ value: null, disabled: true }],
      'indicePriorizacion': [],
      'responsable': [],
      'usoDeLaVia': []

    });

    this.formularioConsultaRadicadoEntrada = this.formBuilder.group({
      'entradaConsultaRadicadoEntrada': [],
      'solicitudRadicadoEntrada': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': [],
    });


    this.forms.push(this.formularioConsultaPK);
    this.forms.push(this.formularioConsultaRadicadoEntrada);
    this.mapService.getVisor().definirEscalasVisualizacion(20000);

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
    }
    this.commonService.getListaItemByNombreListaAndValorItem('MEJORAMIENTO_TIPO_SOLICITUD', 'PETICIONARIO').subscribe((item) => {
      this.origenPk = item;
    });

    this.commonService.getCondicionByNombre('PK sin gestión activa').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.mapService.getVisor().visible = true;

   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'vincular':
        this.vincular(event.mantenimiento);
        break;
      case 'desvincular':
        this.desvincular(event.mantenimiento);
        break;
    }
  }

  /**
   * Método encargado de vincular el mantenimiento indicado
   *
   * @param mantenimiento Objeto de tipo manteniento con la información del
   * registro seleccionado en la grilla
   */
  public vincular(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().visible = false;
    this.data.mantenimiento = mantenimiento;
    this.data.mantenimiento.origen = this.origenPk;
    this.currentAction = 'vincular';
  }

  /**
   * Método encargado de desvincular el mantenimiento indicado
   *
   * @param mantenimiento Objeto de tipo manteniento con la información del
   * registro seleccionado en la grilla
   */
  public desvincular(mantenimiento: WorkflowMantenimientoModel) {
    this.data.mantenimiento = mantenimiento;
    this.data.mantenimiento.solicitudRadicadoEntrada = null;
    this.data.mantenimiento.solicitudFecha = null;
    this.data.mantenimiento.solicitudVencimiento = null;
    this.data.mantenimiento.solicitudRemitente = null;
    this.data.mantenimiento.solicitudAsunto = null;
    this.data.mantenimiento.solicitudDependenciaAsignada = null;
    this.data.mantenimiento.solicitudFechaVinculacion = null;
    this.saveMantenimientoGridOnGrid();

    setTimeout(() => {
      super.seleccionarGrid(1);
    }, 2000);
  }

  /**
   * Método encargado de buscar el radicado de orfeo
   */
  buscarRadicado() {
    this.processingSelectPk = true;
    this.data.mantenimiento.solicitudRadicadoEntrada = null;
    this.data.mantenimiento.solicitudFecha = null;
    this.data.mantenimiento.solicitudVencimiento = null;
    this.data.mantenimiento.solicitudRemitente = null;
    this.data.mantenimiento.solicitudAsunto = null;
    this.data.mantenimiento.solicitudDependenciaAsignada = null;
    this.data.mantenimiento.solicitudFechaVinculacion = null;
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoEntrada).subscribe((orfeo: any) => {
      this.data.mantenimiento.solicitudRadicadoEntrada = orfeo.numeroRadicado;
      this.data.mantenimiento.solicitudFecha = orfeo.fechaRadicado;
      this.data.mantenimiento.solicitudVencimiento = orfeo.fechaVencimiento;
      this.data.mantenimiento.solicitudRemitente = orfeo.nombre + ' ' + orfeo.primerApellido + ' ' + orfeo.segundoApellido;
      this.data.mantenimiento.solicitudAsunto = orfeo.asunto;
      this.data.mantenimiento.solicitudDependenciaAsignada = '';
      this.data.mantenimiento.solicitudFechaVinculacion = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.entradaConsultaRadicadoEntrada = null;
      this.processingSelectPk = false;
    }, error => {
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Método encargado de almacenar el radicado en el mantenimiento
   * y luego envia a procesar.
   *
   * @param mantenimiento Objeto de tipo manteniento con la información del
   * registro seleccionado en la grilla
   */
  saveRadicado(event) {
    const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = event.mantenimientosActividad;
    mantenimientosActividad.forEach(element => {
      element.mantenimiento.origen = this.origenPk;
    });
    super.saveAll();
    this.currentAction = 'list';
  }

  /** M+etodo encargado de asignar el origen del seguimiento
   * y enviar a guardar la información del mantenimiento a la
   * base de datos
   */
  asignarOrigenGardar() {
    this.data.mantenimiento.origen = this.origenPk;
    this.data.transicion = null;
    this.applySingleTransitionTo();
  }

  /**
   * Método encargado de eecutar la transicion de forma masiva para varios
   * pks seleccionados por el usuario.
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   */
   executeMasiveTransition(event: any): void {
    event.mantenimientos.forEach(mantenimiento => {
      mantenimiento.origen = this.origenPk;
    });
    super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
  }

  /** Método encargado de devolver a la pagina principal el componente */
  cancel() {
    this.entradaConsultaRadicadoEntrada = null;
    super.cancel();
  }
}
