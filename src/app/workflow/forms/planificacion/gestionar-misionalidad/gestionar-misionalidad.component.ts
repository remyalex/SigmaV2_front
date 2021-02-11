import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { GESTIONAR_MISIONALIDAD_CONSTANTS } from './gestionar-misionalidad.constants';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

/** Componente encargado de gestionar el proceso de gestionar misionalidad*/
@Component({
  selector: 'app-gestionar-misionalidad',
  templateUrl: './gestionar-misionalidad.component.html'
})
export class GestionarMisionalidadComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

 /** Constantes a usar en el componente */
  constants = GESTIONAR_MISIONALIDAD_CONSTANTS;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'solicitudRadicadoEntrada',
    'origen',
    'estadoPk',
    'fechaAsignacion',
    'fechaVencimiento',
    'kmCarrilImpacto',
    'observacionActividadActual'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'radicadoSolicitudReserva',
    'radicadoRespuestaReserva',
    'origen',
    'estadoMantenimiento',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable'
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

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
    // Definición de formularios

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
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
    this.commonService.getCondicionByNombre('PK_DIAGNOSTICO_GESTIONAR_MISIONALIDAD_ALL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /**
   * Método encargado de eecutar la transicion de forma masiva para varios
   * pks seleccionados por el usuario.
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   */
   executeMasiveTransition(event: any): void {
    super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
  }

}
