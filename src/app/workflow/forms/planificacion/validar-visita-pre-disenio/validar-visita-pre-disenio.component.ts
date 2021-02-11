import { MapService } from '../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowCondicionModel } from '../../../models/workflow-condicion.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-ver-visita-pre-disenio',
  templateUrl: './validar-visita-pre-disenio.component.html'
})
export class ValidarVisitaPreDisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChild('grid') grid: GridMantenimientosComponent;
  predisenio: any;
  mantenimiento: any;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'solicitudRadicadoEntrada',
    'origen',
    'estadoMantenimiento',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla'
  ];

  acciones = [
    { nombre: 'predisenioAccion', label: 'Trabajar', icono: 'note_add', color: 'primary' },
    { nombre: 'diagnosticoAccion', label: 'Ver Registro Visita Diagnóstico', icono: 'visibility', color: 'primary' }
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
    private dialog: MatDialog
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

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
    this.commonService.getCondicionByNombre('PK_VALIDAR_PREDISENIO').subscribe(_condicion => {
      this.condicion = _condicion;
    });
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'predisenioAccion':
        this.utilitiesServices.scrollToTop();
        this.currentAction = 'work';
        this.mantenimiento = event.mantenimiento;
        this.predisenio = event.mantenimiento.predisenio;
        if (this.grid.esMasiva()) {
          this.mapService.getVisor().ocultarMapa();
          this.mapService.getVisor().visible = false;
        }
        break;
      case 'diagnosticoAccion':
        this.utilitiesServices.scrollToTop();
        this.currentAction = 'detalleDiagnostico';
        this.mantenimiento = event.mantenimiento;
        this.mapService.getVisor().visible = false;
        break;
    }
    this.accion = this.currentAction;
    this.mapService.getVisor().visible = false;
  }

  saveFunction(event) {
    this.data.mantenimiento = event.mantenimiento;
    this.saveAll();
  }

  back(event) {
    this.currentAction = event.currentAction;
    this.grid.search();
    if (this.mapService.getGrid().esMasiva()) {
      this.mapService.getVisor().ocultarMapa();
    }
    this.mapService.getVisor().visible = true;
  }

  onBackList() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.currentAction = 'list';
          this.mapService.getVisor().visible = true;
        }
      }
    );
  }

  executeTransition(): void {
    this.grid.setMantenimientosSelected([]);
    this.data.mantenimiento = this.mantenimiento;
    this.applySingleTransitionTo();
    this.mapService.getVisor().visible = true; //
  }

}
