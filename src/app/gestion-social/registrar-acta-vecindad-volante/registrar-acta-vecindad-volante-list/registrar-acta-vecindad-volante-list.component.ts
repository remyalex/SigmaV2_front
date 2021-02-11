import { Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { ActaVolanteCriteria } from '../models/acta-volante-criteria.model';
import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActaVolanteService } from '../services/acta-volante.service';
import { ActaVolanteDatasource } from '../services/acta-volante.datasource';
// tslint:disable-next-line: max-line-length
import { RegistrarActaVecindadVolanteEditComponent } from '../registrar-acta-vecindad-volante-edit/registrar-acta-vecindad-volante-edit.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ActaVolanteResidenteModel } from '../models/acta-volante-residente.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-social-registrar-acta-vecindad-volante-list',
  templateUrl: './registrar-acta-vecindad-volante-list.component.html'
})
export class RegistrarActaVecindadVolanteListComponent extends BaseComponent implements OnInit, AfterViewChecked {

  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;

  // inputs
  @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  transiciones: WorkflowTransicionModel[];
  dataSourceVol: ActaVolanteDatasource;
  criteriaVol = new ActaVolanteCriteria();
  actaVolanteCrear: ActaVolanteModel = new ActaVolanteModel();
  total: any;
  isLabelNuevo: boolean = true;
  actasVolanteResidente: ActaVolanteModel[];
  actaVolanteResidente: ActaVolanteResidenteModel = new ActaVolanteResidenteModel();
  pk: any;
  actaVolanteId: any;
  //  currentAction: any;
  public currentAction = 'listVolantes';
  processing = true;
  listVolante = true;
  creaVolante = true;
  verEnvio = false;


  columns = [
    'propietario',
    'direccion',
    'telefono',
    'fechaRegistro',
    'volanteEntregado',
    'acciones'
  ];


  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

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

    private servicioVol: ActaVolanteService,
    private dialog: MatDialog,
    private router: Router,
    private _route: ActivatedRoute,

  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    //    this.mantenimiento = data;
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSourceVol = new ActaVolanteDatasource(this.servicioVol);
    const pk = this._route.snapshot.paramMap.get('pk');
    if (pk !== null && pk.length > 0) {
      this.servicio.detailByPk(Number(pk)).subscribe(data => {
        this.mantenimiento = data;
        this.loadData();
      }, error => {
      });
    } else {
      this.loadData();
    }

    this.servicioVol.serviceListener$.subscribe((data: WorkflowMantenimientoActividadModel) => {
      this.data = data;
      if (typeof this.data.actividad !== 'undefined' &&
        typeof this.data.actividad.transiciones !== 'undefined') {
        this.transiciones = this.data.actividad.transiciones;
      }
    });


  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteriaVol.page = this.paginator.pageIndex;
      this.criteriaVol.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.criteriaVol.sortBy = this.sort.active;
      this.criteriaVol.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteriaVol.page = 0;
    this.loadData();
  }

  /**
   * Método encargado de gestionar la carga de los pks
   * de la grilla al iniciar el componente.
   */
  loadData(): void {
    this.criteriaVol.pk = this.mantenimiento.pk;
    this.dataSourceVol.loadData(this.criteriaVol);
    this.processing = false;
    this.listVolante = false;

  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.currentAction = 'createActa';
    //const posUltimaPosicion = location.pathname.lastIndexOf('/list');
    //const url = location.pathname.substr(0, posUltimaPosicion + 1) + 'create/' + this.mantenimiento.pk;
    //const urlBack = '/gestion-social/registrarActaVecindadVolante/create/' + this.mantenimiento.pk;
    //this.router.navigate([urlBack]);
    //    this.processing = false;
    //    this.listVolante = true;
    //    this.creaVolante = false;
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(actaVolante: ActaVolanteModel): void {
    this.currentAction = 'editarVolante';
    this.pk = this.mantenimiento.pk;
    this.actaVolanteId = actaVolante.id;
  }


  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          const currentAction = 'list';
          window.location.href = 'workflow/social/registrar-acta-vecindad-volante';
          //this.back.emit({ currentAction: currentAction });
        }
      }
    );
  }

  backEvent(event) {
    this.currentAction = event.currentAction;
    this.loadData();
  }

  list(event) {
    if (event.pk !== undefined) {
      this.mantenimiento.pk = event.pk;
      this.dataSourceVol = new ActaVolanteDatasource(this.servicioVol);
      this.loadData();
    } else {
      this.listVolante = false;
    }
    this.creaVolante = true;
  }

  prepararEnvio() {
    this.verEnvio = true;
  }

  executeTransition(): void {
    for (var i = 0; i < this.mantenimiento.intervenciones[0].actasAfiche.length; i++) {
      this.mantenimiento.intervenciones[0].actasAfiche[i].intervencionEncabezado = new IntervencionInfo();
      this.mantenimiento.intervenciones[0].actasAfiche[i].intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    }

    for (var i = 0; i < this.mantenimiento.intervenciones[0].actasVolante.length; i++) {
      this.mantenimiento.intervenciones[0].actasVolante[i].intervencionEncabezado = new IntervencionInfo();
      this.mantenimiento.intervenciones[0].actasVolante[i].intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    }
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
    //    this.onBack();
    //    window.location.href = 'gestion-social/registrarActaVecindadVolante/admin';
    setTimeout(() => {
      window.location.href = 'workflow/social/registrar-acta-vecindad-volante';
    }, 500);
  }

}
