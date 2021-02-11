import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, AfterViewChecked } from '@angular/core';
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
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from 'src/app/shared/services/map.service';
import { VisitaPredisenoModel } from 'src/app/workflow/models/visita.prediseno.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { GridMantenimientosComponent } from '../../../../shared/component/grid-mantenimientos/grid-mantenimientos.component';

@Component({
  selector: 'app-gestionar-visita-disenio',
  templateUrl: './gestionar-visita-disenio.component.html'
})
export class GestionarVisitaDisenioComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  @ViewChildren('grid') grids: QueryList<GridMantenimientosComponent>;

  indexTab: any;
  indexTransition: any;

  columns = [
    'pk',
    'civ',
    'estadoPk',
    'estadoMantenimiento',
    'origen',
    'zona',
    'localidad',
    'cuadrante',
    'direccion',
    'fechaAsignacion',
    'fechaVencimiento',
    'responsable',
    'solicitudRadicadoEntrada',
    'tipoIntervencion',
    'fechaVisitaDisenio'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
  ];

  filtersformulario = [
    'pk'
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'work', label: 'Trabajar', icono: 'edit', color: 'primary' },
  ];

  options = [
    { value: true, name: 'SI' },
    { value: false, name: 'NO' }
  ];

  // Formularios
  formularioConsultaPK: FormGroup;
  formularioSoportes: FormGroup;

  visitaPredisenoModel: VisitaPredisenoModel;

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
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event) {
    this.mapService.getVisor().ocultarMapa();
    switch (event.accion) {
      case 'solicitudSoportes':
        this.currentAction = 'solicitudSoportes';
        this.solicitudSoportes(event.mantenimiento);
        break;
      case 'work':
        this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
        this.currentAction = event.accion;
        this.mantenimiento = event.mantenimiento;
        this.indexTransition = event.transicion;
        break;
    }

    this.accion = this.currentAction;
    this.mapService.getVisor().visible = false;
  }

  public solicitudSoportes(mantenimiento: WorkflowMantenimientoModel) {
    this.data.mantenimiento = mantenimiento;

    if (this.data.mantenimiento.visitasPrediseno != null) {
      this.visitaPredisenoModel = this.data.mantenimiento.visitasPrediseno[0];
    } else {
      this.data.mantenimiento.visitasPrediseno = [];
      this.visitaPredisenoModel = new VisitaPredisenoModel();
      this.visitaPredisenoModel.levantamientoTopografico = false;
      this.visitaPredisenoModel.modulacionLosas = false;
      this.visitaPredisenoModel.fichaEvaluacion = false;
      this.visitaPredisenoModel.informacionDiseno = false;
      this.visitaPredisenoModel.consultaRedes = false;
    }
    this.currentAction = 'solicitudSoportes';
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  public save() {
    this.visitaPredisenoModel.fecha = this.utilitiesServices.getFechaServerFormat_ddMMaaaa(new Date());
    if (this.data.mantenimiento.visitasPrediseno.length === 0) {
      this.data.mantenimiento.visitasPrediseno.push(this.visitaPredisenoModel);
    } else {
      // La posición cero siempre traera la ultima visita prediseño activa
      this.data.mantenimiento.visitasPrediseno[0] = this.visitaPredisenoModel;
    }
    super.saveAll();
  }

  back(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.mapService.getVisor().mostrarMapa();
          this.mapService.getVisor().visible = true;
          this.currentAction = 'list';
        }
      }
    );
  }

  tabIndexReload() {
    let id = 0;
    switch (this.indexTransition.id) {
      case 112:
        id = 0;
        break;
      case 119:
        id = 1;
        break;
      case 120:
        id = 2;
        break;
    }

    return id;
  }

}
