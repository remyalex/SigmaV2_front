import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { EquipocalendarioService } from '../services/equipocalendario.service';
import { EquipocalendarioCriteria } from '../models/equipocalendario-criteria.model';
import { EquipocalendarioDatasource } from '../services/equipocalendario.datasource';
import { Equipocalendario } from '../models/equipocalendario.model';
import { EquipocalendarioEditComponent } from '../equipocalendario-edit/equipocalendario-edit.component';
import { EquipocalendarioDetailComponent } from '../equipocalendario-detail/equipocalendario-detail.component';
import { EquipocalendarioDeleteComponent } from '../equipocalendario-delete/equipocalendario-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';
import { SelectionModel } from '@angular/cdk/collections';

/** Componente encargado de presentar en listado los calendarios de los equipos */
@Component({
  selector: 'sigma-administracion-equipocalendario-list',
  templateUrl: './equipocalendario-list.component.html'
})
export class EquipocalendarioListComponent implements OnInit, AfterViewInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EquipocalendarioDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: EquipocalendarioDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipocalendarioCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new EquipocalendarioCriteria();
  /**  Columnas de la grilla que se van a exportar */
  dataExport =  [];

  // Se agrega el código del mapa
  public selection = new SelectionModel<Equipocalendario>(true, []);
  /** Listado de pks seleccionados en la grilla */
  public listaPksSelect = [];

  @ViewChildren('listCheckboxes') private listCheckboxes: QueryList<any>;
  @Output() listaPks = new EventEmitter<any>();
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'disponibleId',
    'equipoDisponibilidadId',
    'fechaFin',
    'fechaInicio',
    'select',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    activo: this.constants.activo,
    disponibleId: this.constants.disponibleId,
    equipoDisponibilidadId: this.constants.equipoDisponibilidadId,
    fechaFin: this.constants.fechaFin,
    fechaInicio: this.constants.fechaInicio,
    id: this.constants.id
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
   * Método encargado de construir una instancia de la clase
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param snackBar Componente usado para abrir un recuadro modal
   */
  constructor(
    private servicio: EquipocalendarioService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EquipocalendarioDatasource(this.servicio);
    this.loadData();
  }

  /**
   * Método encargado de ubicar en el mapa el pk indicado.
   * @param pkSelectMap Número del pk seleccionado.
   */
  searchListMap(pkSelectMap): void {
    this.criteria.equipoDisponibilidadId = pkSelectMap;
    this.paginator.pageIndex = 0;

    this.loadData();
    this.dataSource.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSource.equipocalendarioSubject.value.length > 0) {
          this.dataSource.equipocalendarioSubject.value.map((data: any) => {
            data.select = true;
          });
        }
      }
    });
  }

  /**
   * Método encargado de realizar la sinconización entre mapa y grilla,
   * teniendo en cuenta los pks indicados y el pk seleccionado.
   *
   * @param datos Conjunto de Pks seleccionados en el mapa
   * @param event Conjunto de mantenimientos seleccionados en la grilla
   */
  masterToggle(datos: any, event: any) {
    if (event.checked) {
      this.listaPksSelect = [];
      if (datos.equipocalendarioSubject.value.length > 0) {
        datos.equipocalendariodSubject.value.map(data => {
          this.listaPksSelect.push(data.pk);
          data.select = true;
        });
      }
    } else {
      if (datos.equipocalendarioSubject.value.length > 0) {
        datos.equipocalendarioSubject.value.map(data => {
          data.select = false;
        });
      }
    }
  }

  /**
   * Método encargado de mantener la sinconización entre los
   * pks del mapa y los de la grilla cuando se a seleccionado un pk en el mapa.
   *
   * @param filaTabla pk seleccionado a adicionar en listado de pks Seleccionados
   * @param event Evento se selección de pk en el mapa
   */
  toggleChecks(filaTabla: any, event: any) {
    if (event.checked) {
      this.listaPksSelect.push(filaTabla.pk);
    } else {
      for (const index in this.listaPksSelect) {
        if (this.listaPksSelect[index] === filaTabla.pk) {
          this.listaPksSelect.splice(+index, 1);
        }
      }
    }
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
    this.listaPksSelect = [];
    this.dataSource.loadData(this.criteria);
  }

   /**
   * Método encargado de gestionar la paginación de la información de
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
   * Método encargado de invocar el componente de edición desde el listado actual
   *
   * @param equipocalendario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(equipocalendario: Equipocalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipocalendario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipocalendarioEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param equipocalendario Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(equipocalendario: Equipocalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipocalendario;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EquipocalendarioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param equipocalendario Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  delete(equipocalendario: Equipocalendario): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipocalendario;

    const dialogRef = this.dialog.open(EquipocalendarioDeleteComponent, dialogConfig);

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
    this.dataSourceExport = new EquipocalendarioDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;

    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
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
          content = this.dataSourceExport.equipocalendarioData.map((equipocalendario: any) => {
            return {
              activo: equipocalendario.activo ? this.constants.si : this.constants.no,
              disponibleId: equipocalendario.disponibleValor,
              equipoDisponibilidadId: equipocalendario.equipoDisponibilidadValor,
              fechaFin: equipocalendario.fechaFin,
              fechaInicio: equipocalendario.fechaInicio,
              id: equipocalendario.id,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = ['activo', 'disponibleId', 'equipoDisponibilidadId', 'fechaFin', 'fechaInicio', 'id',];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'equipocalendario', true, order);
        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de asignar al modelo el valor modificado en el formulario */
  setEquipoDisponibilidadEquipocalendario(_id: string) {
    this.criteria.equipoDisponibilidadId = _id;
  }
}
