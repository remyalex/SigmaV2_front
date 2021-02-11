import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CONST_GESTION_AMBIENTAL } from '../../gestion.ambiental.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CierreAmbientalModel } from '../../models/cierre.ambiental.model';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-consultar-cierre',
  templateUrl: './consultar-cierre.component.html'
})
export class ConsultarCierreComponent implements OnInit {

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
    'fechaCierre',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    tipoIntervencion: this.constants.tipoIntervencion,
    otroTipoIntervencion: this.constants.otroTipoIntervencion,
    fechaCierre: this.constants.fechaCierreAmbiental,
    localidad: this.constants.localidad,
    upla: this.constants.upla,
    barrio: this.constants.barrio,
    civ: this.constants.civ,
    pk: this.constants.pk,
    escombros: this.constants.escombros,
    destinoEscombros: this.constants.destinoEscombros,
    retiroProteccionZonaVerde: this.constants.retiroProteccionZonaVerde,
    libreResiduoZonaVerde: this.constants.libreResiduoZonaVerde,
    retiroProteccionSumidero: this.constants.retiroProteccionSumidero,
    retiroProteccionSenalizacion: this.constants.retiroProteccionSenalizacion,
  }];

  public cierreAmbiental: CierreAmbientalModel = new CierreAmbientalModel();
  public cierreAmbientales: Array<CierreAmbientalModel> = [];
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
    this.cierreAmbientales = this.mantenimiento.cierresAmbientales == null ? [] : this.mantenimiento.cierresAmbientales;
    this.dataSource = new MatTableDataSource(this.cierreAmbientales);
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
  edit(cierreAmbiental: CierreAmbientalModel) {
    this.cierreAmbiental = cierreAmbiental;
    
    setTimeout(() => {
      this.currentAction = this.constants.currentAction.registrarCierreAmbiental;  
    }, 100);
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
    if (this.mantenimiento.cierresAmbientales.length > 0) {
      const content = this.mantenimiento.cierresAmbientales.map((cierreAmbiental: CierreAmbientalModel) => {
        return {
          tipoIntervencion: this.mantenimiento.diagnostico ?
            this.mantenimiento.diagnostico.encabezado ?
              this.mantenimiento.diagnostico.encabezado ?
                this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal ? 
                  this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion : '' 
                : ''
              : ''
            : '',
          otroTipoIntervencion: cierreAmbiental.otroTipoIntervencion,
          fecha: cierreAmbiental.fechaCierre,
          localidad: this.mantenimiento.localidad ? this.mantenimiento.localidad.nombre : '',
          upla: this.mantenimiento.upla ? this.mantenimiento.upla.nombre : '',
          barrio: this.mantenimiento.barrio ? this.mantenimiento.barrio.nombre : '',
          pk: this.mantenimiento.pk,
          civ: this.mantenimiento.civ,
          escombros: cierreAmbiental.escombros,
          destinoEscombros: cierreAmbiental.destinoEscombros,
          retiroProteccionZonaVerde: cierreAmbiental.retiroProteccion ? this.constants.si : this.constants.no,
          libreResiduoZonaVerde: cierreAmbiental.libreResiduos ? this.constants.si : this.constants.no,
          retiroProteccionSumidero: cierreAmbiental.sumideros ? this.constants.si : this.constants.no,
          retiroProteccionSenalizacion: cierreAmbiental.senalizacion ? this.constants.si : this.constants.no,
        };
      });
      this.dataExport = [...this.headers, ...content];
      const order = [
        'tipoIntervencion',
        'otroTipoIntervencion',
        'fecha',
        'localidad',
        'upla',
        'barrio',
        'pk',
        'civ',
        'escombros',
        'destinoEscombros',
        'retiroProteccionZonaVerde',
        'libreResiduoZonaVerde',
        'retiroProteccionSumidero',
        'retiroProteccionSenalizacion'
      ];
      this.excelService.exportAsExcelFileCustom(
        this.dataExport, 'cierreAmbietal', true, order
      );
      this.cargandoExcel = false;
    }
  }
}
