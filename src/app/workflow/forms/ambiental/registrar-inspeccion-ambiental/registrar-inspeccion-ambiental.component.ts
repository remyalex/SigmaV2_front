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
import { KeyValuePair } from '../../../../shared/models/key-value-pair.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { ElementoInspeccionModel } from 'src/app/gestion-ambiental/registrar-inspeccion-ambiental/models/elemento-inspeccion.model';
import { ProfileService } from '../../../../seguridad/services/profile.service';
// tslint:disable-next-line: max-line-length
import { CONST_INSPECCION_REGISTRO_AMBIENTAL } from '../../../../gestion-ambiental/registrar-inspeccion-ambiental/registro-inspeccion.constant';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-registrar-inspeccion-ambiental',
  templateUrl: './registrar-inspeccion-ambiental.component.html'
})
export class RegistrarInspeccionAmbientalComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

 /** Constantes a usar en el componente */
  constants = CONST_INSPECCION_REGISTRO_AMBIENTAL;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  nextTransition = false;
  elementoInspeccion: ElementoInspeccionModel;
  buttonShow: any = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'pk',
    'civ',
    'zona',
    'nombreResidenteAmbiental',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona'
  ];

  columnsToExport = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'cuadrante'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [];

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
    private profileService: ProfileService
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.AppAccess();
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: this.data.actividad.id.toString()});
    this.commonService.getCondicionByNombre('PK_REGISTRAR_INSPECCION_AMBIENTAL').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  AppAccess() {
    const permisoRegistrar = this.constants.ambiental_inspeccion_create;
    const permisoConsultar = this.constants.ambiental_inspeccion_list;

    this.profileService.isGranted(permisoRegistrar).subscribe(data => {
      if (data.state) {
        this.buildButtonGrid('registrarInspeccion', 'Registrar inspección ambiental', 'add', 'primary');
      }
    });

    this.profileService.isGranted(permisoConsultar).subscribe(data => {
      if (data.state) {
        this.buildButtonGrid('consultarInspeccion', 'Consultar inspección ambiental', 'visibility', 'Basic');
      }
    });

  }

  buildButtonGrid(nombre: any, label: any, icono: any, color: any) {
    this.buttonShow = [];
    this.buttonShow.nombre = nombre;
    this.buttonShow.label = label;
    this.buttonShow.icono = icono;
    this.buttonShow.color = color;
    this.acciones.push(this.buttonShow);
  }

  executeSingleAction(event) {
    switch (event.accion) {
      case 'registrarInspeccion':
        this.registrarInspeccion(event);
        break;
      case 'consultarInspeccion':
        this.consultarInspeccion(event);
        break;
    }
  }

  registrarInspeccion(event) {
    if (!event.mantenimiento.intervenciones) {
      this.showMessageSnackBar('El PK no cuenta con una Intervención');
    } else {
      this.utilitiesServices.scrollToTop();
      this.currentAction = 'registrarInspeccion';
      this.mantenimiento = event.mantenimiento;
      this.mapService.getVisor().visible = false;
    }
  }

  consultarInspeccion(event) {
    if (!event.mantenimiento.inspeccionesAmbiental) {
      this.showMessageSnackBar('El PK no tiene registros asociados');
    } else {
      this.utilitiesServices.scrollToTop();
      this.currentAction = 'consultarInspeccion';
      this.mantenimiento = event.mantenimiento;
      this.mapService.getVisor().visible = false;
    }
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  back(event) {
    this.mapService.getVisor().visible = true;
    this.currentAction = event.currentAction;
  }

  actionEvent(event) {
    this.mapService.getVisor().visible = false;
    this.currentAction = event.currentAction;
    this.elementoInspeccion = event.inspeccion;
  }

  saveAllForm(event) {
    this.nextTransition = event.nextTransition;
  }

  executeTransition(): void {
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
  }

}
