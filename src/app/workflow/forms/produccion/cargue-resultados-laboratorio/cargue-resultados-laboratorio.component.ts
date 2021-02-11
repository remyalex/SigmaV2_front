import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { CONST_PRODUCCION_CARGUE_RESULTADOS_LAB } from 'src/app/workflow/forms/produccion/cargue-resultados-laboratorio/cargue-resultados-laboratorio.constant';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { SolicitudEnsayos } from 'src/app/produccion/solicitud-ensayos/models/solicitud-ensayos.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'app-cargue-resultados-laboratorio',
  templateUrl: './cargue-resultados-laboratorio.component.html'
})
export class CargueResultadosLaboratorioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {


  // constants
  constants = CONST_PRODUCCION_CARGUE_RESULTADOS_LAB;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'estadoPk',
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
    'barrio',
    'fechaSolicitudEnsayo',
    'tipoEnsayo',
    'fechaRegistroEnsayo'
  ];

  actions: GridAccion[] = [
    { nombre: 'listSolEn', label: 'Ver ensayos', icono: 'visibility', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  defaulFilters: KeyValuePair[] = [];
  ensayo: SolicitudEnsayos;
  selectedTab = 0;

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
    private dialog: MatDialog,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({ key: 'permisoId', value: '1' });
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }

    this.commonService.getCondicionByNombre('PK_CON_SOLICITUD_ENSAYO').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  // ngAfterViewInit(): void {
  // }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    console.log(event);
    switch (event.accion) {
      case 'listSolEn':
        this.listarEnsayos(event.mantenimiento);
        break;
    }
  }

  listarEnsayos(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.getVisor().visible = false;
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.currentAction = 'listSolEn';
  }

  back(event) {
    super.cancel();
  }

  backGen(event) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mapService.getVisor().visible = true;
        this.selectedTab = 1;
        super.seleccionarGrid(1);
        this.currentAction = 'list';
      }
    });
  }

  detalleGen(event) {
    this.mapService.getVisor().visible = false;
    this.ensayo = event.ensayo;
    this.currentAction = "detalleGenerico";
  }


}
