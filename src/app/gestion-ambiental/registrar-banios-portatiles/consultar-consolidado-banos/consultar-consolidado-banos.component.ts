import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { CONST_GESTION_AMBIENTAL } from '../../gestion.ambiental.constants';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { BanosPortatilesModel } from '../../models/banos.portatiles.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'sigma-consultar-consolidado-banos',
  templateUrl: './consultar-consolidado-banos.component.html',
})
export class ConsultarConsolidadoBanosComponent implements OnInit {

  /** Constantes a usar en el componente */
  public  constants = CONST_GESTION_AMBIENTAL;
  @Input('mantenimiento') mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  @Input('data') data: WorkflowMantenimientoActividadModel;
  @Input('transicionesIndividuales') transicionesIndividuales = [];

  // outputs
  @Output() closeRegistro: any = new EventEmitter();

  public currentAction = this.constants.currentAction.list;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion',
    'civ',
    'pk',
    'fechaNecesidadLLegada',
    'horaNecesidadLLegada',
    'fechaNecesidadRetiro',
    'horaNecesidadRetiro',
    'tipoIntervencion',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    fechaNecesidadLLegada: this.constants.fechaNecesidadLLegada,
    horaNecesidadLLegada: this.constants.horaNecesidadLLegada,
    fechaNecesidadRetiro: this.constants.fechaNecesidadRetiro,
    horaNecesidadRetiro: this.constants.horaNecesidadRetiro,
    direccion: this.constants.direccion,
    localidad: this.constants.localidad,
    upla: this.constants.upla,
    barrio: this.constants.barrio,
    civ: this.constants.civ,
    pk: this.constants.pk,
    tipoIntervencion: this.constants.tipoIntervencion
  }];

  public banoPortatiles: BanosPortatilesModel = new BanosPortatilesModel();
  public banosPortatiles: Array<BanosPortatilesModel> = [];
  public cargandoExcel = false;
  public dataSource = new MatTableDataSource();
  public utilitiesServices: UtilitiesService;

  constructor(
    utilitiesServices: UtilitiesService,
    private dialog: MatDialog,
    private excelService: ExcelService,
  ) {
    this.utilitiesServices = utilitiesServices;
  }

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.banosPortatiles = this.mantenimiento.banioPortatiles == null ? [] : this.mantenimiento.banioPortatiles;
    this.dataSource = new MatTableDataSource(this.banosPortatiles);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.loadData();
    });
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(banioPortatiles: BanosPortatilesModel) {
    this.banoPortatiles = banioPortatiles;
    this.currentAction = this.constants.currentAction.programarBanosPortatiles;
  }

  closeAll(event) {
    this.closeRegistro.emit(event);
  }

  closeRegister(event) {
    if (event.close) {
      this.currentAction = this.constants.currentAction.list;
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      mensaje: this.constants.deseaSalir
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val == 1) {
        this.closeRegistro.emit({ close: true });
        this.utilitiesServices.scrollToTop();
      } else {
        this.closeRegistro.emit({ close: false });
      }
    });
  }

  exportAsXLSX() {
    if (this.mantenimiento.banioPortatiles.length > 0) {
      const content = this.mantenimiento.banioPortatiles.map((banioPortatil: BanosPortatilesModel) => {
        return {
          pk: this.mantenimiento.pk,
          civ: this.mantenimiento.civ,
          fechaNecesidadLLegada: banioPortatil.fechaLlegada,
          fechaNecesidadRetiro: banioPortatil.fechaRetiro,
          // tslint:disable-next-line: max-line-length
          horaNecesidadLLegada: this.utilitiesServices.convertDateToString(this.utilitiesServices.clearHora(banioPortatil.horaLlegada), 'HH:mm'),
          // tslint:disable-next-line: max-line-length
          horaNecesidadRetiro: this.utilitiesServices.convertDateToString(this.utilitiesServices.clearHora(banioPortatil.horaRetiro), 'HH:mm'),
          tipoIntervencion: this.mantenimiento.diagnostico ?
            this.mantenimiento.diagnostico.encabezado ?
              this.mantenimiento.diagnostico.encabezado ?
                this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal ? 
                  this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion :  '' 
                : ''
              : ''
            : '',
          direccion: banioPortatil.direccion,
          barrio: this.mantenimiento.barrio ? this.mantenimiento.barrio.nombre : '',
          localidad: this.mantenimiento.localidad ? this.mantenimiento.localidad.nombre : '',
          upla: this.mantenimiento.upla ? this.mantenimiento.upla.nombre : ''
        };
      });
      this.dataExport = [...this.headers, ...content];
      const order = [
        'pk',
        'civ',
        'fechaNecesidadLLegada',
        'horaNecesidadLLegada',
        'fechaNecesidadRetiro',
        'horaNecesidadRetiro',
        'tipoIntervencion',
        'direccion',
        'barrio',
        'localidad',
        'upla'
      ];
      this.excelService.exportAsExcelFileCustom(
        this.dataExport, 'baniosportatiles', true, order
      );
      this.cargandoExcel = false;
    }
  }
}
