import { WorkflowCondicionModel } from './../../../models/workflow-condicion.model';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { CONST_GESTION_AMBIENTAL } from '../gestion-ambietal.constant';
import { CierreAmbientalModel } from 'src/app/gestion-ambiental/models/cierre.ambiental.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-consultar-consolidado-ambiental',
  templateUrl: './consultar-consolidado-ambiental.component.html'
})
export class ConsultarConsolidadoAmbientalComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  /** Constantes a usar en el componente */
  public  constants = CONST_GESTION_AMBIENTAL;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'fechaProgramacionIntervencion',
    'turnoEjecucionIntervencion',
    'zona',

    // 'estadoInspeccionIntervencion',  // No se debe presentar
    // 'nombreResidenteAmbiental',      // No se debe presentar
  ];

  columnsExport = [
    'posicion',
    'pk',
    'civ',
    'fechaProgramacionIntervencion',
    'turnoEjecucionIntervencion',
    'zona',
    'localidad',
    'upla',
    'barrio',
    'cantidadArbolesIntervencion',
    'cantidadProtArbolesIntervencion',
    'cantidadSumiderosIntervencion',
    'cantidadProtSumiderosIntervencion',
    'cantidadEspacioPublicoIntervencion',
    'cantidadEscombrosIntervencion',
    'destinoEscombrosIntervencion',
    'cantidadBanosInervencion',
    'cantidadBanosMantenIntervencion'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'estadoInspeccionIntervencion',
    'residenteAmbiental',
    'fechaProgramacionIntervencion',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;

  defaulFilters: KeyValuePair[] = [];

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
    private profileService: ProfileService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'permisoId', value: '1'});
    this.loadData();
    this.mapService.getVisor().seleccionMasiva = false;
    this.commonService.getCondicionByNombre('PK_CONSOLIDADO_AMBIENTAL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case this.constants.currentAction.registrarCierreAmbiental:
        this.currentAction = event.accion;
        this.utilitiesServices.scrollToTop();
        this.mantenimiento = event.mantenimiento;
        this.mapService.getVisor().visible = false;
        break;
    }
  }

}
