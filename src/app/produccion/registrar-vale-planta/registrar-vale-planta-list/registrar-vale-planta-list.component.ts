import { UtilitiesService } from './../../../shared/services/utilities.service';
import { Acciones } from './../../../mejoramiento/historial-mantenimiento/models/modelsForQuery.model';
import { RegistrarValePlanta } from './../models/registrar-vale-planta.model';
import { RegistrarValePlantaCriteria } from './../models/registrar-vale-planta-criteria.model';
import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { RegistrarValePlantaService } from '../services/registrar-vale-planta.service';
import { RegistrarValePlantaDatasource } from '../services/registrar-vale-planta.datasource';
import { RegistrarValePlantaEditComponent } from '../registrar-vale-planta-edit/registrar-vale-planta-edit.component';
import { RegistrarValePlantaDetailComponent } from '../registrar-vale-planta-detail/registrar-vale-planta-detail.component';
import { RegistrarValePlantaDeleteComponent } from '../registrar-vale-planta-delete/registrar-vale-planta-delete.component';
import { RegistrarValePlantaAttachComponent } from '../registrar-vale-planta-attach/registrar-vale-planta-attach.component';

@Component({
  selector: 'sigma-produccion-registrar-vale-planta-list',
  templateUrl: './registrar-vale-planta-list.component.html'
})
export class RegistrarValePlantaListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: RegistrarValePlantaService,
    private utilitiesService: UtilitiesService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: RegistrarValePlantaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: RegistrarValePlantaDatasource;

  criteria = new RegistrarValePlantaCriteria();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'numeroVale',
    'horaEntrada',
    'horaSalida',
    'turno',
    'tipoMaterial',
    'proveedor',
    'jefeBascula',

    'placa',
    'pesoBruto',
    'pesoTara',
    'pesoNeto',
    'recibe',
    'fecha',

    'activo',
    'acciones'
  ];

  order = [
    'activo',
  ];

  headers = [
    {
      numeroVale: this.constants.numeroVale,
      horaEntrada: this.constants.horaEntrada,
      horaSalida: this.constants.horaSalida,
      turno: this.constants.turno,
      tipoMaterial: this.constants.tipoMaterial,
      proveedor: this.constants.proveedor,
      jefeBascula: this.constants.jefeBascula,
      placaVehiculo: this.constants.placaVehiculo,
      pesoBruto: this.constants.pesoBruto,
      pesoTara: this.constants.pesoTara,
      pesoNeto: this.constants.pesoNeto,
      nombreRecibe: this.constants.nombreRecibe,
      fecha: this.constants.fecha,
      activo: this.constants.activo,
    }
  ];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new RegistrarValePlantaDatasource(this.servicio);
    this.loadData();
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

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
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

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formato: RegistrarValePlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(RegistrarValePlantaEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formato: RegistrarValePlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;
    dialogConfig.width = '50';

    const dialogRef = this.dialog.open(RegistrarValePlantaDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(formato: RegistrarValePlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formato;

    const dialogRef = this.dialog.open(RegistrarValePlantaDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  attach(registro: RegistrarValePlanta): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = registro;

    const dialogRef = this.dialog.open(RegistrarValePlantaAttachComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  formatHora(value): string {
    return this.utilitiesService.formatoHora(value);
  }
}
