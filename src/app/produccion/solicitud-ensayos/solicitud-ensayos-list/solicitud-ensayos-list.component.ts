import { ViewChild, Component, Inject, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { SolicitudEnsayosService } from '../services/solicitud-ensayos.service';
import { SolicitudEnsayosCriteria } from '../models/solicitud-ensayos-criteria.model';
import { SolicitudEnsayos } from '../models/solicitud-ensayos.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from '../solicitud-ensayos.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { SolicitudEnsayosGeneralesDatasource } from '../services/solicitud-ensayos-generales.datasource';
import { SolicitudEnsayosDatasource } from '../services/solicitud-ensayos.datasource';
import { SolicitudEnsayosGeneralesService } from '../services/solicitud-ensayos-generales.service';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-prod-solicitud-ensayos-list',
  templateUrl: './solicitud-ensayos-list.component.html'
})

export class SolicitudEnsayosListComponent implements OnInit, AfterViewInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: SolicitudEnsayosDatasource;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSourceTable= new MatTableDataSource();
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExportGenerica: SolicitudEnsayosGeneralesDatasource;
  dataSourceExport: SolicitudEnsayosDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  listEnsayos: any;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new SolicitudEnsayosCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new SolicitudEnsayosCriteria();
  disabledButton = false;
  lengthList: Number;
  ensayos: SolicitudEnsayos[];
  pagAux: number;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [];

  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{}];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];
  @Input() generico = false;
  action: string;

  dataExport: any = [{}];
  public presentarTipoIntervencion = true;

  @Output() cambiarEstadoTabEnsayoLabPK = new EventEmitter();

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: SolicitudEnsayosService,
    private serviceGenerica: SolicitudEnsayosGeneralesService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utillilb: UtilitiesService,
    private utilitiesServices: UtilitiesService,
    private router: Router,
    private mapService: MapService,
  ) { }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.action = 'list';
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new SolicitudEnsayosDatasource(this.servicio);
    if (this.generico) {
      this.columns = ['id', 'descripcionTipoEnsayo', 'fecha', 'usuario.nombres', 'fechaRegistroEnsayo', 'observaciones', 'acciones'];
      this.headers = [{ tipoEnsayo: 'Tipo ensayo', fecha: 'Fecha solicitud', solicitante: 'Usuario solicitud',
        fechaRegistroEnsayo: 'Fecha ensayo', observaciones: 'Observaciones'
      }];
    } else {
      this.columns = ['pk', 'descripcionTipoEnsayo', 'fecha', 'usuario.nombres', 'fechaRegistroEnsayo', 'observaciones', 'acciones'];
      this.headers = [{ pk: 'PK', tipoEnsayo: 'Tipo ensayo', fecha: 'Fecha solicitud', solicitante: 'Usuario solicitud',
        fechaRegistroEnsayo: 'Fecha ensayo', observaciones: 'Observaciones'
      }];
    }
    this.loadData();
    this.mapService.getVisor().definirEscalasVisualizacion(1200000);
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
  }

  Limpiar(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.criteria.tipoEnsayoId = null;
    this.paginator.pageIndex = 0;
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.criteria.generico = this.generico;
    this.criteria.pk = this.generico ? null : CONST_PRODUCCION_SOLICITUD_ENSAYOS.pkListar;
    this.criteria.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteria.fechaRegistroEnsayo = this.criteria.fechaRegistroEnsayo != null ? this.criteria.fechaRegistroEnsayo : '';
    this.criteria.tipoEnsayoId = this.criteria.tipoEnsayoId != null ? this.criteria.tipoEnsayoId : '';
    this.dataSource.loadData(this.criteria);
//    this.dataSource.ensayosData.descricionTipoEnsayo

this.dataSource.loading$.subscribe(response => {
  this.disabledButton = false;
  if (!response && this.dataSource.ensayosData !== undefined) {
    const content = this.dataSource.ensayosData.content.map((ensayo: SolicitudEnsayos) => {
          if(ensayo.descripcionTipoEnsayo === null || ensayo.descripcionTipoEnsayo == ''){
            ensayo.descripcionTipoEnsayo = ensayo.tipoEnsayo != null ? ensayo.tipoEnsayo.descripcion : '';
            this.update(ensayo);
          }

    });
  }
});

}

  loadDataBack(): void {
    this.criteria.generico = this.generico;
    this.criteria.pk = this.generico ? null : CONST_PRODUCCION_SOLICITUD_ENSAYOS.pkListar;
    this.criteria.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteria.fechaRegistroEnsayo = this.criteria.fechaRegistroEnsayo != null ? this.criteria.fechaRegistroEnsayo : '';
    this.criteria.tipoEnsayoId = '';
    this.dataSource.loadData(this.criteria);
/*
    this.dataSource.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response && this.dataSource.ensayosData !== undefined) {
        const content = this.dataSource.ensayosData.content.map((ensayo: SolicitudEnsayos) => {
              ensayo.descripcionTipoEnsayo = ensayo.tipoEnsayo != null ? ensayo.tipoEnsayo.descripcion : '';
        });
      }
    });
*/
  }
  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
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
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'view');
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  exportAsXLSX(): void {
    this.disabledButton = true;
    const total = this.dataSource.totalelementsSubject.value;

    this.cargandoExcel = true;

    this.criteriaExport.pk = this.criteria.pk;
    this.criteriaExport.fecha = this.criteria.fecha != null ? this.criteria.fecha : '';
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;
    this.cargandoExcel = true;

    if (this.generico === true) {
      this.dataSourceExportGenerica = new SolicitudEnsayosGeneralesDatasource(this.serviceGenerica);
      this.executeExportGenerico();
    } else {
      this.dataSourceExport = new SolicitudEnsayosDatasource(this.servicio);
      this.executeExport();
    }
  }

  executeExportGenerico() {
    this.dataSourceExportGenerica.loadData(this.criteriaExport);
    this.dataSourceExportGenerica.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response && this.dataSourceExportGenerica.ensayosData !== undefined) {
        const content = this.dataSourceExportGenerica.ensayosData.content.map((ensayo: SolicitudEnsayos) => {
            return {
              tipoEnsayo: ensayo.tipoEnsayo != null ? ensayo.tipoEnsayo.descripcion : '',
              fecha: ensayo.fecha,
              solicitante: ensayo.usuario != null ? ensayo.usuario.nombres + ' ' + ensayo.usuario.apellidos : '',
              fechaRegistroEnsayo: ensayo.fechaRegistroEnsayo,
              observaciones: ensayo.observaciones
            };
        });
        this.dataExport = [...this.headers, ...content];
        const order = ['id', 'tipoEnsayo', 'fecha', 'solicitante', 'fechaRegistroEnsayo', 'observaciones'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'SolicitudesEnsayos', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  executeExport() {
    this.dataSourceExport.loadData(this.criteriaExport);
    this.dataSourceExport.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response && this.dataSourceExport.ensayosData !== undefined) {
        const content = this.dataSourceExport.ensayosData.content.map((ensayo: SolicitudEnsayos) => {
            return {
              pk: ensayo.mantenimiento.pk !== null ? ensayo.mantenimiento.pk : '',
              tipoEnsayo: ensayo.tipoEnsayo != null ? ensayo.tipoEnsayo.descripcion : '',
              fecha: ensayo.fecha,
              solicitante: ensayo.usuario != null ? ensayo.usuario.nombres + ' ' + ensayo.usuario.apellidos : '',
              fechaRegistroEnsayo: ensayo.fechaRegistroEnsayo,
              observaciones: ensayo.observaciones
            };
        });
        this.dataExport = [...this.headers, ...content];
        const order = ['pk', 'tipoEnsayo', 'fecha', 'solicitante', 'fechaRegistroEnsayo', 'observaciones'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'SolicitudesEnsayos', true, order);        this.cargandoExcel = false;
      }
    });
  }

  crear() {
    this.mapService.getVisor().visible = false;
    this.presentarTipoIntervencion = false;
    this.action = 'create';
    this.cambiarEstadoTabEnsayoLabPK.emit('true');
  }

  ejecutarbackCreate() {
    this.mapService.getVisor().visible = true;
    this.loadDataBack();
    this.presentarTipoIntervencion = true;
    this.action = 'list';
  }

  cambioEstadoTabEnsayoLabPK(event: any) {
    this.cambiarEstadoTabEnsayoLabPK.emit(event);
  }

  update(ensayo: SolicitudEnsayos) {
    this.servicio.update(ensayo).subscribe(
      data => {
      },
      error => {
//        this.utilitiesServices.formErrorMessages(error, this.formEdit, this.snackBar);
      },
    );
  }

}
