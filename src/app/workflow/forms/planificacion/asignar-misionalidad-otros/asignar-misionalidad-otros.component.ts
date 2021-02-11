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
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ASIGNAR_MISIONALIDAD_CONSTANTS } from './asignar-misionalidad.constants';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

/** Componente encargado de gestionar el proceso de asignación de misionalidad y otros*/
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-asignar-misionalidad-otros',
  templateUrl: './asignar-misionalidad-otros.component.html'
})
export class AsignarMisionalidadOtrosComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

 /** Constantes a usar en el componente */
  constants = ASIGNAR_MISIONALIDAD_CONSTANTS;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'pk',
    'civ',
    'estadoPk',
    'kmCarrilImpacto',
    'zona',
    'localidad',
    'barrio'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'estadoPk',
    'zona',
    'localidad',
    'barrio'
  ];

  /** Item de la lista de Origen para opción misionalidad */
  origenMisionalidad: ListaItem;
  /** Item de la lista de Origen para opción otro */
  origenOtro: ListaItem;


   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
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

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.getVisor().definirEscalasVisualizacion(20000);
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.commonService.getListaItemByNombreListaAndValorItem('MEJORAMIENTO_TIPO_SOLICITUD', 'MISIONAL').subscribe((item) => {
      this.origenMisionalidad = item;
    });
    this.commonService.getListaItemByNombreListaAndValorItem('MEJORAMIENTO_TIPO_SOLICITUD', 'OTRO').subscribe((item) => {
      this.origenOtro = item;
    });

    this.mapService.getVisor().definirEscalasVisualizacion(20000);

  }

  /**
   * Método encargado de eecutar la transicion de forma masiva para varios
   * pks seleccionados por el usuario.
   *
   * @param event Evento con datos de mantenimientos seleccionados por el usuario
   */
  executeMasiveTransition(event: any): void {
    if (event.grid) {
      if (event.grid.transicion.id === this.constants.TRANSICION_ENVIO_MISIONALIDAD_ID) {
        event.mantenimientos.forEach(mantenimiento => {
          mantenimiento.origen = this.origenMisionalidad;
          mantenimiento.fechaSolicitudProgramacion = this.utilitiesServices.getFechaServerFormat(new Date);
        });
      }
      if (event.grid.transicion.id === this.constants.TRANSICION_ENVIO_OTRO_ID) {
        event.mantenimientos.forEach(mantenimiento => {
          mantenimiento.origen = this.origenOtro;
          mantenimiento.fechaSolicitudProgramacion = this.utilitiesServices.getFechaServerFormat(new Date);
        });
      }
    }
    super.applyMasiveTransitionTo(event.mantenimientos, event.grid);
  }

}
