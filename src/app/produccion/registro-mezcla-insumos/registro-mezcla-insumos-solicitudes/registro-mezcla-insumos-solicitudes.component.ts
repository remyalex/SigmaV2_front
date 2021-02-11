import { ViewChild, Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { RegistroMezclaInsumosService } from '../services/registro-mezcla-insumos.service';
import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { RegistroMezclaInsumoDatasource } from '../services/registro-mezcla-insumos.datasource';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from '../registro-mezcla-insumos.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';


@Component({
  selector: 'sigma-produccion-registro-mezcla-insumos-solicitudes',
  templateUrl: './registro-mezcla-insumos-solicitudes.component.html'
})

export class ResgistroMezclaInsumosSolicitudesComponent implements OnInit, AfterViewInit {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RegistroMezclaInsumoDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RegistroMezclaInsumoDatasource;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new RegistroMezclaInsumoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new RegistroMezclaInsumoCriteria();
  disabledButton = false;
  lengthList: Number;
  pagAux: number;
  equipo: RegistroMezclaInsumoCriteria = new RegistroMezclaInsumoCriteria();
  loader = true;
  noInfoToShow = false;
  exportOption = true;
  dataEnsayosExport: any = [];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort
  dataExport: any = [{}];


  columns = [
    'id',
    'fechaRetiro',
    'turno',
    'tipoMaterial',
    'cantidad',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    id: 'No Solicitud',
    fechaRetiro: 'Fecha Solicitud',
    turno: 'Turno',
    tipoMaterial: 'Tipo Material',
    cantidad: 'Cantidad Total',
  }];



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: RegistroMezclaInsumosService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private utillilb: UtilitiesService,
    private utilitiesServices: UtilitiesService,
    private router: Router,
  ) { }


 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RegistroMezclaInsumoDatasource(this.servicio);
    this.loadData();
  }


  /** Método encargado de realizar la busqueda */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.loadData();
  }


  /** Método encargado de limpiar los campos */
  Limpiar(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }


  /** Método encargado de cargar la Data inicial */
  loadData(): void {
    this.dataSource.loadData(this.criteria, this.servicio.getDataService().pk);
  }


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


  /** Método encargado de ir a solicitudes consultadas */
  goToSolicitud(data): void {
    localStorage.setItem('dataSolicitud', JSON.stringify(data));
    this.router.navigate(['produccion/registro-mezcla-insumos/list']);
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
        if (val == 1) {
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'view')
          this.router.navigate([urlBack]);
        }
      }
    );
  }


  /** Método encargado de exportar datos */
  exportAsXLSX(): void {
    this.disabledButton = true;
    this.dataSourceExport = new RegistroMezclaInsumoDatasource(this.servicio);
    const total = this.dataSource.totalelementsSubject.value;
    this.cargandoExcel = true;
    this.criteriaExport.pk = this.criteria.pk;
    this.criteriaExport.fechaDesde = this.criteria.fechaDesde != null ? this.criteria.fechaDesde : '';
    this.criteriaExport.fechaHasta = this.criteria.fechaHasta != null ? this.criteria.fechaHasta : '';

    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.sortBy = this.criteria.sortBy;
    this.criteriaExport.sortOrder = this.criteria.sortOrder;
    this.dataSourceExport.loadData(this.criteriaExport, this.servicio.getDataService().pk);
    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      this.disabledButton = false;
      if (!response) {
        const content = this.dataSourceExport.ensayosData.content.map((data: any) => {
          return {
            id: data.id != null ? data.id : '',
            fechaRetiro: data.fechaRetiro != null ? this.getHumanDate(data.fechaRetiro)  : '',
            turno: data.turno != null ? data.turno.descripcion: '',
            tipoMaterial: data.tipoMaterial != null ? data.tipoMaterial.descripcion : '',
            cantidad: data.cantidad != null ? data.cantidad : '',

          };
        });
        this.dataExport = [...this.headers, ...content];
        const order = [    
        'id',
        'fechaRetiro',
        'turno',
        'tipoMaterial',
        'cantidad',
      ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'ListaSolicitudes', true, order);
        this.cargandoExcel = false;
      }
    });
  }


  /** Método encargado de formatear millis to Date */
  getHumanDate(_date: number) {
    const date = new Date(+_date);
    return date.toISOString().split('T')[0];
  }

}