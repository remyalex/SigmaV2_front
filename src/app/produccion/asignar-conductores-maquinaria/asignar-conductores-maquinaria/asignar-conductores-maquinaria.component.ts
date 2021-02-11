import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from '../asignar-conductores-maquinaria.constant';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
import { Router } from '@angular/router';
import { AsignarConductoresMaquinariaDatasource } from '../services/asignar-conductores-maquinaria.datasource';
import { AsignarConductoresMaquinariaCriteria } from '../models/asignar-conductores-maquinaria-criteria.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-prod-asignar-conductores-maquinaria',
  templateUrl: './asignar-conductores-maquinaria.component.html'
})

export class AsignarConductoresMaquinariaComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  urlBack: string;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  dataSourceSol: AsignarConductoresMaquinariaDatasource;
  criteriaSol = new AsignarConductoresMaquinariaCriteria();
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'pk',
    'civ',
    'localidad',
    'zona',
    'barrio',
    'upla',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'civ',
    'zona',
    'localidad',
    'upla',
    'barrio',
  ];

  defaultFilter: KeyValuePair[] = [
    { key: 'actividadActualId', value: '28' },
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'accionSimple', label: 'Trabajar', icono: 'work', color: 'primary' },
  ];
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
    private router: Router,
    private servicioSol: AsignarConductoresMaquinariaService,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
      this.commonService.getCondicionByNombre('PK_PROD_SOLICITUDES_PMT').subscribe(_condicion => {
        this.condicion = _condicion;
      });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.data = new WorkflowMantenimientoActividadModel();
  }

  executeSingleAction(event) {
    // this.servicioSol.setDataService(event.mantenimiento);

    localStorage.setItem('dataMapa', JSON.stringify(event.mantenimiento));
    this.router.navigate(['produccion/asignar-conductores-maquinaria/list']);
  }
}