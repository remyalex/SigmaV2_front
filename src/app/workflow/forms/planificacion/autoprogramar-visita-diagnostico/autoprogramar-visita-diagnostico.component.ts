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
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Router } from '@angular/router';
import { MapService } from 'src/app/shared/services/map.service';
// tslint:disable-next-line: max-line-length
import { CONST_WORKFLOW_AUTOPROGRAMAR } from 'src/app/workflow/forms/planificacion/autoprogramar-visita-diagnostico/autoprogramar-visita-diagnostico.constants';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

/** Componente encargado de gestionar el proceso de autoprogramar visita de diagnóstico*/
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-autoprogramar-visita-diagnostico',
  templateUrl: './autoprogramar-visita-diagnostico.component.html'
})
export class AutoprogramarVisitaDiagnosticoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_AUTOPROGRAMAR;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'pk',
    'radicadoEntrada',
    'radicadoSalida'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'origen',
    'radicadoSalida',
    'radicadoEntrada',
  ];

  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usaarán de forma predeterminada en este componente */
  defaultFilters: KeyValuePair[] = [
    { key: 'actividadActualId', value: 'NULL' }
  ];

  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'autoprogramar', label: 'Autoprogramar', icono: 'schedule', color: 'primary' }
  ];

  // Formularios
  /** Formulario para consulta de los PKs */
  formularioConsultaPK: FormGroup;
  /** Formularios para consulta de radicado de entrada */
  formularioConsultaRadicadoEntrada: FormGroup;
  /**  Criterios por los cuales realizará la consulta de información del mapa */
  criteriaMap: GridMantenimientoCriteria;
  /** Tipo de solicitud del peticionario seleccionada */
  tipoSolicitudPeticionario: ListaItem = new ListaItem();
  /** Criterio de busqueda del campo de radicado de entrada del autoomplete */
  entradaConsultaRadicadoEntrada: string;

  /** Diccionario con llaves y valores de homologación de campos */
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
    { source: 'ESTADO_PK_ID', target: 'VALOR_ESTADO_PK' },
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
    { source: 'ACT_ACTUAL_GESTION_SOCIAL_ID', target: 'ACT_ACTUAL_GESTION_SOCIAL_ID' },
];

  // Constructor del componente

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
   * @param _router Componente usado para redireccionar entre componentes
   */
  constructor(
    private _router: Router,
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.criteriaMap = new GridMantenimientoCriteria();

    this.formularioConsultaPK = this.formBuilder.group({
      'entradaConsultaPK': [],
      'pk': [null, Validators.compose([Validators.required])],
      'origen': [null, Validators.compose([Validators.required])],
      'civ': [null, Validators.compose([Validators.required])],
      'calzadaAncho': [],
      'calzadaArea': [],
      'localidadNombre': [],
      'barrioNombre': [],
      'ejeVial': [],
      'upla': [],
      'malla': [],
      'sectorNombre': [],
      'desde': [],
      'hasta': [],
      'longitud': [],
      'seccionVial': [],
      'tipoSuperficie': [],
      'estado': [],
      'sector': [],
    });

    this.formularioConsultaRadicadoEntrada = this.formBuilder.group({
      'entradaConsultaRadicadoEntrada': [],
      'radicadoEntrada': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'dependenciaAsignada': [],
      'fechaGeneracionDocumento': [],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
    this.criteriaMap.actividadActualId = 'NULL';
    this.data.mantenimiento = undefined;
    this.defaultCriteria();
    this.commonService.getListaItemByNombreListaAndValorItem('MEJORAMIENTO_TIPO_SOLICITUD', 'PETICIONARIO').subscribe(listaItem => {
      this.tipoSolicitudPeticionario = listaItem;
    }, error => {
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });

    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = false;
    this.mapService.getVisor().limpiar();
    this.mapService.limpiarMantenimientoIndividual();
    this.mapService.getVisor().setMapFilterForce(this.getMapFilter());

    this.mapService.mantenimientoSeleccionado$.subscribe(_mantenimiento => {
      if (_mantenimiento) {
        this.autoprogramar(_mantenimiento);
      }
    });
  }

  /**
   * Método encargado de actualizar el pk del flibreo en el criteria
   *
   * @param pk Objeto de tipo pk con los datos a actualizar
   */
  public setPkFiltro(pk: any) {
    this.criteria.pk = pk;
    this.loadData();
  }

  /** Método encargado de entregar el filtro del mapa */
  public getMapFilter(): string {
    let sql = '';
    const transiciones = this.transicionesIndividuales[0]; 
    if (transiciones) {
      if (transiciones.condicion) {
        sql = this.getQueryCondicion(transiciones.condicion);
      }
    }
    return sql;
  }

  /**
   * Método encargado de construir la condición a usar
   * para los términos del autoprogramar
   *
   * @param condicion Objeto con los datos de la condición a aplicar
   */
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
                    } else {
                      if (termino.operadorLogico.includes(')')) {
                        sql += ' )';
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
        } else {
          if (typeof field !== undefined) {
            sql += termino.atributo + field.target + termino.valor;
          } else {
            sql += termino.atributo + termino.operador + termino.valor;
          }
        }
    });

    return sql;
}


/** Método encargado de construir y retornar
 * el criteria predeterminado por el cual realizar la búsqueda
 **/
defaultCriteria(): void {

    if (this.defaultFilters) {
      this.defaultFilters.forEach(filter => {

        if (filter.key === 'pk') {
          this.criteriaMap.pk = filter.value;
        }
        if (filter.key === 'civ') {
          this.criteriaMap.pk = filter.value;
        }

        if (filter.key === 'localidadId') {
          this.criteriaMap.localidad = new Localidad();
          this.criteriaMap.localidad.id = +filter.value;
        }

        if (filter.key === 'cuadranteId') {
          this.criteriaMap.cuadrante = new Cuadrante();
          this.criteriaMap.cuadrante.id = +filter.value;
        }
        if (filter.key === 'barrioId') {
          this.criteriaMap.barrio = new Barrio();
          this.criteriaMap.barrio.id = +filter.value;
        }

        if (filter.key === 'zonaId') {
          this.criteriaMap.zona = new Zona();
          this.criteriaMap.zona.id = +filter.value;
        }
        if (filter.key === 'estadoMantenimientoId') {
          this.criteriaMap.estadoMantenimiento = new ListaItem();
          this.criteriaMap.estadoMantenimiento.id = +filter.value;
        }

        if (filter.key === 'tipoSeccionVialId') {
          this.criteriaMap.tipoSeccionVial = new ListaItem();
          this.criteriaMap.tipoSeccionVial.id = +filter.value;
        }
        if (filter.key === 'tipoMallalId') {
          this.criteriaMap.tipoMalla = new ListaItem();
          this.criteriaMap.tipoMalla.id = +filter.value;
        }
        if (filter.key === 'actividadActualId') {
          this.criteriaMap.actividadActualId = filter.value;
        }
        if (filter.key === 'origenId') {
          this.criteriaMap.origen = new ListaItem();
          this.criteriaMap.origen.id = +filter.value;
        }
        if (filter.key === 'solicitudRadicadoEntrada') {
          this.criteriaMap.solicitudRadicadoEntrada = filter.value;
        }
        if (filter.key === 'solicitudRadicadoSalida') {
          this.criteriaMap.solicitudRadicadoSalida = filter.value;
        }
        if (filter.key === 'indicePriorizacion') {
          this.criteriaMap.indicePriorizacion = filter.value;
        }
        if (filter.key === 'indicePriorizacionDesde') {
          this.criteriaMap.indicePriorizacionDesde = filter.value;
        }
        if (filter.key === 'indicePriorizacionHasta') {
          this.criteriaMap.indicePriorizacionHasta = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionDesde') {
          this.criteriaMap.solicitudFechaVinculacionDesde = filter.value;
        }
        if (filter.key === 'solicitudFechaVinculacionHasta') {
          this.criteriaMap.solicitudFechaVinculacionHasta = filter.value;
        }
        if (filter.key === 'tieneRadicadoSalida') {
          this.criteriaMap.tieneRadicadoSalida = filter.value;
        }
        if (filter.key === 'posibleDanioRedes') {
          this.criteriaMap.posibleDanioRedes = filter.value;
        }
        if (filter.key === 'fechaAsignacionDesde') {
          this.criteriaMap.fechaAsignacionDesde = filter.value;
        }
        if (filter.key === 'fechaAsignacionHasta') {
          this.criteriaMap.fechaAsignacionHasta = filter.value;
        }
        if (filter.key === 'fechaVencimientoDesde') {
          this.criteriaMap.fechaVencimientoDesde = filter.value;
        }
        if (filter.key === 'fechaVencimientoHasta') {
          this.criteriaMap.fechaVencimientoHasta = filter.value;
        }
        if (filter.key === 'responsableId') {
          this.criteriaMap.responsable = new UsuarioInfo();
          this.criteriaMap.responsable.id = +filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaDesde') {
          this.criteriaMap.fechaVisitaTecnicaDesde = filter.value;
        }
        if (filter.key === 'fechaVisitaTecnicaHasta') {
          this.criteriaMap.fechaVisitaTecnicaHasta = filter.value;
        }
        if (filter.key === 'tipoActividadId') {
          this.criteriaMap.tipoActividad = new ListaItem();
          this.criteriaMap.tipoActividad.id = +filter.value;
        }
        if (filter.key === 'enSeguimiento') {
          this.criteriaMap.enSeguimiento = filter.value;
        }
        if (filter.key === 'fechaSeguimientoDesde') {
          this.criteriaMap.fechaSeguimientoDesde = filter.value;
        }
        if (filter.key === 'fechaSeguimientoHasta') {
          this.criteriaMap.fechaSeguimientoHasta = filter.value;
        }
        if (filter.key === 'estadoPkId') {
          this.criteriaMap.estadoPk = new ListaItem();
          this.criteriaMap.estadoPk.id = + filter.value;
        }
      });
    }
  }


  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    switch (event.accion) {
      case 'autoprogramar':
        this.autoprogramar(event.mantenimiento);
        break;
    }
  }

  /** Método encargado de gestionar la acción de autoprogramar */
  public autoprogramar(mantenimiento: WorkflowMantenimientoModel) {
    this.data.mantenimiento = mantenimiento;
    this.currentAction = 'autoprogramar';
  }

  /** Método encargado de buscar el radicado de tipo orfeo */
  buscarRadicado() {
    this.processingSelectPk = true;
    this.data.mantenimiento.solicitudFecha = null;
    this.data.mantenimiento.solicitudVencimiento = null;
    this.data.mantenimiento.solicitudRemitente = null;
    this.data.mantenimiento.solicitudAsunto = null;
    this.data.mantenimiento.solicitudDependenciaAsignada = null;
    this.data.mantenimiento.solicitudFechaVinculacion = null;
    this.commonService.getRadicadoOrfeo(this.entradaConsultaRadicadoEntrada).subscribe((item: any) => {
      this.data.mantenimiento.solicitudRadicadoEntrada = item.numeroRadicado;
      this.data.mantenimiento.solicitudFecha = item.fechaRadicado;
      this.data.mantenimiento.solicitudVencimiento = item.fechaVencimiento;
      this.data.mantenimiento.solicitudRemitente = item.nombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
      this.data.mantenimiento.solicitudAsunto = item.asunto;
      this.data.mantenimiento.solicitudDependenciaAsignada = '';
      this.data.mantenimiento.solicitudFechaVinculacion = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      this.processingSelectPk = false;
    }, error => {
      this.processingSelectPk = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /** Método encargado de almacenar los datos de radicado de
   * entrada entregados por el usuario en el formulario */
  saveLocal() {
    this.markAndValidateAllInputs(this.formularioConsultaPK);
    if (this.formularioConsultaPK.valid === true) {
      if (this.data.mantenimiento.origen.id !== this.tipoSolicitudPeticionario.id) {
        this.data.mantenimiento.solicitudRadicadoEntrada = null;
        this.data.mantenimiento.solicitudFecha = null;
        this.data.mantenimiento.solicitudVencimiento = null;
        this.data.mantenimiento.solicitudRemitente = null;
        this.data.mantenimiento.solicitudAsunto = null;
        this.data.mantenimiento.solicitudDependenciaAsignada = null;
        this.data.mantenimiento.solicitudFechaVinculacion = null;
      }
      this.entradaConsultaRadicadoEntrada = null;
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
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

  /** Método encargado de realizar el envio al servicio de almacenar
   * los datos de la programación generada */
  guardarEnviarProgramacion(): void {
    this.processing = true;
    this.utilitiesServices.scrollToTop();
    if (this.data.id) {

      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.processing = false;
          this.mapService.getVisor().visible = false;
          this._router.navigate(['/workflow/planificacion/registrar-visita-diagnostico/' +
          this.data.mantenimiento.id + '/workAutoprogramar']);
        },
        error => {
          this.processing = false;
          this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
        });
    } else {
      this
        .workflowService.create(this.data).subscribe(
          data => {
            this.data = data;
            this.processing = false;
            this.mapService.getVisor().visible = false;
            this._router.navigate(['/workflow/planificacion/registrar-visita-diagnostico/' +
            this.data.mantenimiento.id + '/workAutoprogramar']);

          },
          error => {
            this.processing = false;
            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
          });
    }
  }
}
