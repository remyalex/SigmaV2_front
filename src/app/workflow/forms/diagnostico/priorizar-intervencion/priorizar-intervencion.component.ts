import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { WorkflowMantenimientoModel } from './../../../models/workflow-mantenimiento.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_WORKFLOW_OTROS_GESTIONAR } from './priorizar-intervencion.constants';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { DefaultSortGrid } from 'src/app/shared/models/defaultSortGrid';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

/** Componente encargado de gestionar el proceso de priorización de intervención */
@Component({
  selector: 'app-priorizar-intervencion',
  templateUrl: './priorizar-intervencion.component.html'
})
export class PriorizarIntervencionComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_OTROS_GESTIONAR;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'select',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
    'kmCarrilImpacto',
    'indicePriorizacion',
    'localidad',
    'zona',
    'selectEstrategia'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'localidad',
    'barrio',
    'zona',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
  ];

  /** Listado de origenes a Excluir de la lista a presentar al usuario */
  excludeOrigin = ['SEGUIMIENTO'];

  /** Ordenamiento predeterminado por el cual se gestionará la información de la grilla */
  defaultSortGrid: DefaultSortGrid = {
    sortBy: 'indicePriorizacion', sortOrder: 'DESC'
  };

  /** Resultado de mezcla de consultas */
  resultIntersectSelect: any;
  intervencionConsultaRadicadoIntervencion: string;
  radicadoRespuestaIntervencion: string;
  verTransicion: Boolean = false;

  // Formularios
  formularioConsultaRadicadoIntervencion: FormGroup;
  mantenimientosSeleccionados: WorkflowMantenimientoModel[];
  grid: GridMantenimientosComponent;


   /** Variable usada para mantener los elementos a presentar en la vinulación de radicados */
  asignarRadicadoIntervencion: GridAccion[] = [
    { nombre: 'radicadoIntervencion', label: 'radicado de intervención', icono: 'call_received', color: 'primary' },
  ];


   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param commonService Componente usado para invocar los servicios de mantenimiento
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
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
    private dialog: MatDialog,
  ) {
    // Invocación del constructor padre
    super(
      servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService
    );

    this.formularioConsultaRadicadoIntervencion = this.formBuilder.group({
      'intervencionConsultaRadicadoIntervencion': [],
      'solicitudRadicadoIntervencion': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
    });

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }


  executeTransitions(): void {
    const seleccionados =  JSON.parse(JSON.stringify(this.mantenimientosSeleccionados));
    this.verTransicion = false;
    super.applyMasiveTransitionTo(seleccionados, this.grid, 0, 'list');
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.forceShowMap();
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
  }


  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    switch (event.accion) {
      case 'radicadoIntervencion':
        this.radicadoIntervencion(event);
        break;
    }
  }

  /**
 * Método encargado de realizar la solicitud de radicado de entrada
 *
 * @param event Evento con los datos del mantenimiento seleccionado por el usuario
 */
  public radicadoIntervencion(event: any) {
    this.grid = event.grid;
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    if (this.mantenimientosSeleccionados.length > 0) {
      let radicadoIgual: string = this.mantenimientosSeleccionados[0].radicadoIntervencion;
      for (let index = 0; index < this.mantenimientosSeleccionados.length; index++) {
        const element = this.mantenimientosSeleccionados[index];
        if ( radicadoIgual !== element.radicadoIntervencion ) {
          radicadoIgual = null;
          break;
        }
      }
       this.radicadoRespuestaIntervencion = radicadoIgual;
    }
    this.currentAction = 'radicadoIntervencion';
  }

  private limpiarVariablesDeFormulario() {
    this.intervencionConsultaRadicadoIntervencion = null;
    this.radicadoRespuestaIntervencion = null;
  }

  /**
   * Método encargado de realizar la búsqueda del radicado de entrada
   * de entrada indicado por el usuario.
   */
  buscarRadicadoIntervencion() {
    this.processingSelectPk = true;
    this.commonService.getRadicadoOrfeo(this.intervencionConsultaRadicadoIntervencion).subscribe((item: any) => {
      this.radicadoRespuestaIntervencion = item.numeroRadicado;
      this.processing = false;
    }, error => {
      this.processing = false;
      this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
    });
  }

  /**
   * Evento de cancelar consulta de radicado de entrada
  */
  cancelRadIntervencion() {
    super.cancel(1);
    this.intervencionConsultaRadicadoIntervencion = null;
    const data = this.grids.toArray()[0];
    data.clearMantenimientosSelected();
    setTimeout(() => {
      super.seleccionarGrid(0);
    }, 2000);
  }


  /**
   * Almacenar el radicado del radicado de entrada en el mantenimiento seleccionado
  */
  saveRadicadoIntervencion(): void {
    this.mantenimientosSeleccionados.forEach(mantenimiento => {
      mantenimiento.radicadoIntervencion = this.radicadoRespuestaIntervencion;
    });
    this.currentAction = 'list';
    this.verTransicion = true;

    if (this.mantenimientosSeleccionados && this.mantenimientosSeleccionados.length > 0) {
      this.mantenimientosSeleccionados.map(dataMantenimiento => {
        if (dataMantenimiento) {
          if (this.verTransicion === true && dataMantenimiento.radicadoIntervencion !== null) {
            this.verTransicion = true;
            this.currentAction = 'radicadoIntervencion';
          } else {
            this.verTransicion = false;
          }
        } else {
          this.verTransicion = false;
        }
      });
    } else {
      this.verTransicion = false;
    }

    this.data.transicion = null;
    this.applyMasiveTransitionTo(this.mantenimientosSeleccionados, this.grid, null, 'radicadoIntervencion');
  }

}
