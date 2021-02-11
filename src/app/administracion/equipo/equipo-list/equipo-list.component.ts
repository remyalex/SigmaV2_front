import { ViewChild, Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { EquipoService } from '../services/equipo.service';
import { EquipoCriteria } from '../models/equipo-criteria.model';
import { EquipoDatasource } from '../services/equipo.datasource';
import { Equipo } from '../models/equipo.model';
import { EquipoEditComponent } from '../equipo-edit/equipo-edit.component';
import { EquipoDetailComponent } from '../equipo-detail/equipo-detail.component';
import { EquipoDeleteComponent } from '../equipo-delete/equipo-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';


/** Clase encargada de listar equipos */
@Component({
  selector: 'sigma-administracion-equipo-list',
  templateUrl: './equipo-list.component.html'
})
export class EquipoListComponent implements OnInit {
   /**  Constantes que utiliza el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
   /**  Bandera para indicar si el componente se encuentra generando excel */
  cargandoExcel = false;
  /**  Conjunto de datos que utiliza la grilla del componente */
  dataSource: EquipoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la la exportación del componente */
  criteriaExport = new EquipoCriteria();
  /**  Conjunto de datos que utiliza la exportación del componente */
  dataExport: any = [];

  /**  Columnas que presentará la grilla de mantenimiento usada en el componente */
  columns = [
    'numeroInterno',
    'placaInventario',
    'placa',
    'movil',
    'claseEquipoId',
    'tipoEquipoId',
    'activo',
    'acciones',
  ];

  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    numeroInterno: this.constants.numeroInterno,
    placaInventario: this.constants.placaInventario,
    placa: this.constants.placa,
    movil: this.constants.movil,
    claseEquipoId: this.constants.claseEquipoId,
    tipoEquipoId: this.constants.tipoEquipoId,
    activo: this.constants.activo,
  }];

  /**  Elemento usado para la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /**  Elemento usado para el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**  Conjunto de datos que utiliza la exportación del componente */
  dataSourceExport: any;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param snackBar Componente usado para abrir un recuadro modal
   */
  constructor(
    private servicio: EquipoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {

  }

  /** Método encargado de inicializar el componente */
  ngOnInit(): void {
    this.criteria.esMaquinariaProduccion = false;
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipoDatasource(this.servicio);
    this.loadData();
  }

  /** Método encargado de realizar consulta de información para el componente */
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
   * @param equipo Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(equipo: Equipo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipoEditComponent, dialogConfig)
      .afterClosed().subscribe(result => {
        this.loadData();
      });
  }

  /**
   * Método encargado de realizar el llamado al componente de visualización del detalle
   * de un registro de la grilla.
   *
   * @param equipo Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipo: Equipo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de eliminación
   * de un registro de la grilla.
   *
   * @param equipo Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  delete(equipo: Equipo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;

    const dialogRef = this.dialog.open(EquipoDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**  Método encargado de limpiar los criterios de búsqueda del formulario */
  clear(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'esMaquinariaProduccion'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  /**
   * Método encargado de actualizar el valor de la clase del equipo
   * en el modelo de los criterios
   *
   * @param event Evento trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
  setClaseEquipoEquipo(event) {
    this.criteria.claseEquipoId = event;
  }

   /**
   * Método encargado de actualizar el valor del tipo del equipo
   * en el modelo de los criterios
   *
   * @param event Evento trasmitido por el usuario con la informacion
   * seleccionada en el formulario.
   */
  setTipoEquipoEquipo(event) {
    this.criteria.tipoEquipoId = event;
  }

 /**
   * Método encargado de exportar la información de la grilla presentada
   * en el componente a un archivo de excel.
   */
  exportAsXLSX(): void {
    this.cargandoExcel = true;
    this.dataSourceExport = new EquipoDatasource(this.servicio);
    this.cargandoExcel = true;

    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters', 'esMaquinariaProduccion'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.dataSourceExport.loadData(this.criteriaExport);
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let content = [];
        try {
          content = this.dataSourceExport.equipoData.content.map((equipo: any) => {
            return {
              activo: equipo.activo ? 'Si' : 'No',
              claseEquipoId: equipo.claseEquipo ? equipo.claseEquipo.valor : '',
              movil: equipo.movil,
              numeroInterno: equipo.numeroInterno,
              placa: equipo.placa,
              placaInventario: equipo.placaInventario,
              tipoEquipoId: equipo.equipoTipo ? equipo.equipoTipo.valor : ''
            };
          });
        } catch (error) {
        }
        this.dataExport = [...this.headers, ...content];
        const order = ['numeroInterno', 'placaInventario', 'placa', 'movil', 'claseEquipoId', 'tipoEquipoId', 'activo'];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipo', true, order);
        this.cargandoExcel = false;
      }
    });
  }


}
