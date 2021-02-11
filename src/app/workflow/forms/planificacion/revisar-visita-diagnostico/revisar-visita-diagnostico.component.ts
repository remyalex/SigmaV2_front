import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../diagnostico/shared/diagnostico.constants';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { VisitaModel } from 'src/app/workflow/models/visita.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';

/** Componente encargado de gestionar el proceso de visualización de visita de diagnóstico */
@Component({
  selector: 'app-revisar-visita-diagnostico',
  templateUrl: './revisar-visita-diagnostico.component.html'
})
export class RevisarVisitaDiagnosticoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'solicitudRadicadoSalida',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'id',
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'origen',
    'fechaAsignacion',
    'fechaVencimiento',
    'vencimiento',
    'responsable'
  ];

  /** Listado de acciones que se pueden ejecutar desde la grilla */
  actions: GridAccion[] = [
    { nombre: 'work', label: 'Trabajar', icono: 'edit', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

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

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.commonService.getCondicionByNombre('PK_DIAGNOSTICO_REVISAR').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    if (this.accion) {
      switch (this.accion) {
        case 'work':
          this.work(this.data.mantenimiento);
          break;
      }
    }
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event: any) {
    switch (event.accion) {
      case 'work':
        this.work(event.mantenimiento);
        break;
      case 'route':
        this.mostrarRuta(event.mantenimiento);
        break;
    }
  }

  /**
   * Método encargado de redireccionar la acción del usuario a la acción del servicio
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
  work(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    this.mapService.getVisor().limpiar();
    this.mapService.getVisor().visible = false;
    super.work(mantenimiento, true);
  }

  /**
   * Método que permite mostrar la ruta de la visita asocciada al mantenimiento
   *
   * @param mantenimiento Mantenimiento al cual se le va a aplicar la
   * accion realizada por el usuario
   */
   mostrarRuta(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().limpiar();
    if (mantenimiento.visitas !== null && mantenimiento.visitas.length > 0) {
      const visita: VisitaModel = mantenimiento.visitas[0];
      if (visita.rutaMapa !== null) {
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

  /** Método encargado de ejecutar la transición seleccionada por el usuario */
  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
  }

  /** Método encargado de devolver a la pagina principal el componente */
  back(event) {
    this.currentAction = 'list';
    this.accion = null;
    setTimeout(() => {
      super.seleccionarGrid(0);
    }, 2000);
  }

}
