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
import { CONST_ACTAS_VECINDAD } from '../actas-vecindad.constant';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { Router } from '@angular/router';
import { ActaArchivos, Acta } from '../models/actas-vecindad.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

@Component({
  selector: 'app-actas-vecindad',
  templateUrl: './actas-vecindad.component.html'
})
export class ActasVecindadComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
 /** Constantes a usar en el componente */
  constants = CONST_ACTAS_VECINDAD;
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

  registroNomenclaturaDatasource: MatTableDataSource<ActaArchivos>;
  registroFachadaDatasource: MatTableDataSource<ActaArchivos>;
  registroFotograficoDatasource: MatTableDataSource<ActaArchivos>;

  columnasTablaFotos = ['consecutivoFoto', 'nombreFoto', 'fotos', 'acciones'];
  minFotosNomenclatura = 1;
  minFotosFachada = 1;
  minFotosRegistro = 1;
  maxFotosNomenclatura = 1;
  maxFotosFachada = 1;
  maxFotosRegistro = 7;

  columnasLista = ['numeralAscendente', 'noActaVecindad', 'fecha', 'aprobado', 'acciones'];

  ELEMENT_DATA: Acta[];
  listasDataSource: MatTableDataSource<Acta>;
  actasSize: number;
  actasPage: number;
  actasSortby: string;
  actasSortOrder: string;
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
    { nombre: 'adicionar', label: 'Registro Acta de Vecindad', icono: 'note_add', color: 'primary' },
    { nombre: 'listar', label: 'Consultar Acta de Vecindad', icono: 'visibility', color: 'primary' },
  ];

  actaFecha: string;

  formularioEnsayo: FormGroup;

  defaulFilters: KeyValuePair[] = [];

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
    this.defaulFilters.push({key: 'actividadActualProcesoParaleloId', value: '61'});
    this.data = new WorkflowMantenimientoActividadModel();
    this.mapService.getVisor().visible = true;
    this.commonService.getCondicionByNombre('PK_ACTAS_VECINDAD').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  ejecutar(event) {
    this.data.mantenimiento = event.mantenimiento;
    switch (event.accion) {
      case 'adicionar':
        CONST_ACTAS_VECINDAD.mID = event.mantenimiento.id;
        CONST_ACTAS_VECINDAD.mObject = event.mantenimiento;
        this.urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'create')
        this.router.navigate([this.urlBack]);
        break;
      case 'listar':
        CONST_ACTAS_VECINDAD.mPK = event.mantenimiento.pk;
        CONST_ACTAS_VECINDAD.mObject = event.mantenimiento;
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