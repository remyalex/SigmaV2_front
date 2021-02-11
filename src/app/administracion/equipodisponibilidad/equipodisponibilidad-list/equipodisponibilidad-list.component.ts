import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { EquipodisponibilidadService } from '../services/equipodisponibilidad.service';
import { EquipoDisponibilidadCriteria } from '../models/equipodisponibilidad-criteria.model';
import { EquipodisponibilidadDatasource } from '../services/equipodisponibilidad.datasource';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { EquipodisponibilidadEditComponent } from '../equipodisponibilidad-edit/equipodisponibilidad-edit.component';
import { EquipodisponibilidadDetailComponent } from '../equipodisponibilidad-detail/equipodisponibilidad-detail.component';
import { EquipodisponibilidadDeleteComponent } from '../equipodisponibilidad-delete/equipodisponibilidad-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
import { pluck } from 'rxjs/operators';
import { ImportarDisponibilidadEquipoComponent } from 'src/app/workflow/forms/solicitud/shared/importar-disponibilidad-equipo/importar-disponibilidad-equipo.component';


@Component({
  selector: 'sigma-administracion-equipodisponibilidad-list',
  templateUrl: './equipodisponibilidad-list.component.html'
})

export class EquipodisponibilidadListComponent implements OnInit, AfterViewInit {


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private servicio: EquipodisponibilidadService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,

  ) { }
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipodisponibilidadDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoDisponibilidadCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipoDisponibilidadCriteria();

  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'clase',
    'tipo',
    'marca',
    'equipo.linea',
    'equipo.placa',
    'equipo.placaInventario',
    'equipo.picoYPlaca',
    'tipoCombustible',
    'desde',
    'hasta',
    'activo',
    'acciones'
  ];

  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    clase: this.constants.claseEquipoId,
    tipo: this.constants.tipoEquipoId,
    marca: this.constants.marcaEquipoId,
    linea: this.constants.lineaEquipo,
    placa: this.constants.placaEquipo,
    placaInventario: this.constants.placaInventarioEquipo,
    picoYplaca: this.constants.picoYplacaEquipoId,
    tipoCombustible: this.constants.tipoCombustibleEquipoId,
    desde: this.constants.fechaDesde,
    hasta: this.constants.fechaHasta,

  }];

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
    this.servicio.load$
    .pipe(pluck('accion'))
    .subscribe((accion: any) => {
      if (typeof accion !== 'undefined') {
        if (accion == 'cargue') {
          this.loadData();
        }
      }
    });
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipodisponibilidadDatasource(this.servicio);
    this.loadData();
  }


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
   * @param equipodisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(equipodisponibilidad: Equipodisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipodisponibilidad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipodisponibilidadEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.loadData();
      }
    });
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param equipodisponibilidad Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipodisponibilidad: Equipodisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipodisponibilidad;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipodisponibilidadDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param equipodisponibilidad Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(equipodisponibilidad: Equipodisponibilidad): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipodisponibilidad;

    const dialogRef = this.dialog.open(EquipodisponibilidadDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
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

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    let dataSourceExport: EquipodisponibilidadDatasource = new EquipodisponibilidadDatasource(this.servicio);
    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    dataSourceExport.loadData(this.criteriaExport);

    dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        const content = dataSourceExport.equipodisponibilidadData.map((equipodisponibilidad: Equipodisponibilidad) => {
            return {
              clase: equipodisponibilidad.equipo.claseEquipo ? equipodisponibilidad.equipo.claseEquipo.valor : '',
              tipo: equipodisponibilidad.equipo.equipoTipo ? equipodisponibilidad.equipo.equipoTipo.valor : '',
              marca: equipodisponibilidad.equipo.marcaEquipo ? equipodisponibilidad.equipo.marcaEquipo.valor : '',
              linea: equipodisponibilidad.equipo.linea,
              placa: equipodisponibilidad.equipo.placa,
              placaInventario: equipodisponibilidad.equipo.placaInventario != null ?  equipodisponibilidad.equipo.placaInventario : '' ,
              picoYplaca: equipodisponibilidad.equipo.picoYPlaca ? this.constants.si :
                (equipodisponibilidad.equipo.picoYPlaca != null ?this.constants.no: '' ),
              tipoCombustible: equipodisponibilidad.equipo.tipoCombustible ? equipodisponibilidad.equipo.tipoCombustible.valor : '',
              desde: equipodisponibilidad.desde,
              hasta: equipodisponibilidad.hasta,
              activo: equipodisponibilidad.activo ? this.constants.si : this.constants.no
            };
          });
        this.dataExport = [...this.headers, ...content];
        const order = [
          'clase',
          'tipo',
          'marca',
          'linea',
          'placa',
          'placaInventario',
          'picoYplaca',
          'tipoCombustible',
          'desde',
          'hasta',
          'activo'
        ];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipodisponibilidad', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /**
   * Método encargado de llamar el componente de importar datos de
   * disponibilidad para un archivo excel
   */
  importar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ImportarDisponibilidadEquipoComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }
}
