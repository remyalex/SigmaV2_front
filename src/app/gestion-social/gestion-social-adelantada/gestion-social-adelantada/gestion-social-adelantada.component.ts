import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../gestion-social-adelantada.constant';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { Router } from '@angular/router';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

@Component({
  selector: 'app-gestion-social-adelantada',
  templateUrl: './gestion-social-adelantada.component.html'
})
export class GestionSocialAdelantadaComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {

 /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;
  titleForm: string;
  accionForm: string;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  requerido = true;
  index: number;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  urlBack: string;
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'fechaInicioVisita',
    'fechaFinVisita',
    'turnoResidenteSocial',
    'zona',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'zona',
    'localidad',
    'upla',
    'cuadrante',
    'barrio',
    'pk',
    'civ',
    'fechasIntervencion',
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'adicionar', label: 'Registrar Encuesta de Satisfacción', icono: 'note_add', color: 'primary' },
    { nombre: 'listar', label: 'Consultar Resultados de Encuestas', icono: 'visibility', color: 'primary' },
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
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.enviada = false;
    this.data = new WorkflowMantenimientoActividadModel();
    this.mapService.getVisor().visible = true;
    // this.initDataSource();
    // this.loadData();
    this.commonService.getCondicionByNombre('PK_AUTOPROGRAMAR_VISITA').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.subscribePaginationAndSoort();
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    this.data.mantenimiento = event.mantenimiento;

    CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.mID = event.mantenimiento.id;
    CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.mPK = event.mantenimiento.pk;
    CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.mObject = event.mantenimiento;
    CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA.mTurno =
      this.data.mantenimiento.intervenciones != null ? 
      this.data.mantenimiento.intervenciones[0].turnoResidenteSocial.descripcion : 'DIURNO';

    switch (event.accion) {
      case 'adicionar':
        this.urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'create')
        this.router.navigate([this.urlBack]);
        break;
      case 'listar':
        this.urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'list')
        this.router.navigate([this.urlBack]);
        break;
    }
  }

  elementToRow(element: WorkflowMantenimientoModel): any {
    const kmCarril: number = element.kmCarrilImpacto;
    return {
      pk: element.pk,
      civ: element.civ,
      fechaInicioVisita: element.fechaInicioVisita,
      fechaFinVisita: element.fechaFinVisita,
      zona: element.zona != null ? element.zona.nombre : '',
      responsable: element.responsable != null ? element.responsable.nombres + ' ' + element.responsable.apellidos : '',
    };
  }

  export() {
    const headers = [{
      pk: 'PK',
      civ: 'CIV',
      fechaInicioVisita: 'Fecha inicial de programación',
      fechaFinVisita: 'Fecha final de programación',
      zona: 'Zona',
      responsable: 'Responsable',
    }];

    const order = [
      'pk',
      'civ',
      'fechaInicioVisita',
      'fechaFinVisita',
      'zona',
      'responsable'
    ];

    this.exportToExcel(headers, order);
  }
}