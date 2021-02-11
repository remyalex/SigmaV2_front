import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { WorkflowMantenimientoModel } from './../../../models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges, AfterViewChecked } from '@angular/core';
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
import { GESTIONAR_SEGUIMIENTO_CONSTANTS } from './gestionar-seguimiento.constants';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';

/** Componente encargado de gestionar el proceso de gestionar seguimiento*/
@Component({
  selector: 'app-gestionar-seguimiento',
  templateUrl: './gestionar-seguimiento.component.html'
})
export class GestionarSeguimientoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  constants = GESTIONAR_SEGUIMIENTO_CONSTANTS;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'origen',
    'estadoPk',
    'responsable',
    'fechaVencimiento',
    'indicePriorizacion',
    'fechaVisitaTecnica',
    'tipoActividad'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'tipoActividad',
    'estadoPk',
    'origen',
    'zona',
    'localidad',
    'barrio',
    'tipoActividad'
  ];

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

    this.formularioConsultaRadicadoIntervencion = this.formBuilder.group({
      'intervencionConsultaRadicadoIntervencion': [],
      'solicitudRadicadoIntervencion': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
    });

    this.forms.push(this.formularioConsultaRadicadoIntervencion);
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.verTransicion = false;
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

  executeTransitions(): void {
    const seleccionados =  JSON.parse(JSON.stringify(this.mantenimientosSeleccionados));
    this.verTransicion = false;
    let grilla;
    if (this.grids !== undefined && typeof(this.grids.first) !== 'undefined') {
      grilla = this.grids.first;
    }
    this.mantenimientosSeleccionados = [];
    this.listaPksSelect = [];
    super.applyMasiveTransitionTo(seleccionados, grilla, 0, 'list');
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
    this.limpiarVariablesDeFormulario();
    this.mantenimientosSeleccionados = event.mantenimientos;
    this.grid = event.grid;
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
    this.intervencionConsultaRadicadoIntervencion = null;
    this.currentAction = this.lastAction;
    this.verTransicion = false;
    this.mapService.getVisor().visible = true;
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
