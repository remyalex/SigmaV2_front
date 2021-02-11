import { Router } from '@angular/router';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, Sort } from '@angular/material';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { GrupoService } from '../services/grupo.service';
import { GrupoCriteria } from '../models/grupo-criteria.model';
import { GrupoModel } from '../models/grupo.model';
import { GrupoDeleteComponent } from '../grupo-delete/grupo-delete.component';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';
import { ImportarGrupoComponent } from '../grupo-importar/importar-grupo/importar-grupo.component';
import { GrupoDatasource } from '../services/grupo.datasource';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/** Componente encargado de gestionar la presentación del listado de grupos en el sistema */
@Component({
  selector: 'sigma-administracion-grupo-list',
  templateUrl: './grupo-list.component.html'
})
export class GrupoListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: GrupoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new GrupoCriteria();
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: GrupoDatasource;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new GrupoCriteria();
  /** Contador de pks seleccionados */
  calzadasCont: number;
  /** Valor de la sumatoria del km carril de los pks seleccionados */
  kilometroCarril: number;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'nombre',
    'descripcion',
    'fecha',
    'calzadas',
    'kilometroCarril',
    'activo',
    'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    fecha: this.constants.fecha,
    calzadas: this.constants.calzadas,
    kilometroCarril: this.constants.kilometroCarril,
    activo: this.constants.activo
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
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private servicio: GrupoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  /**
    * Método encargado de gestionar la carga de los pks
    * de la grilla al iniciar el componente.
    */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new GrupoDatasource(this.servicio);
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
      this.onSortData(this.sort);
    });
  }


  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param groupToEdit Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(groupToEdit: GrupoModel): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'edit/' + groupToEdit.id;
    this.router.navigate([urlBack]);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param groupToDelete Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(groupToDelete: GrupoModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = groupToDelete;

    const dialogRef = this.dialog.open(GrupoDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.search();
        }
      }
    );
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


  /**
    * Método encarga de gestionar la exportación de los datos
    * presentados en la grilla mediante un archivo excel
    */
  exportAsXLSX(): void {
    this.dataSourceExport = new GrupoDatasource(this.servicio);
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
          content = this.dataSourceExport.gruposData.map((proceso: any) => {
            return {
              activo: proceso.estadoNombre,
              descripcion: proceso.descripcion,
              nombre: proceso.nombre,
              fecha: proceso.fecha,
              calzadas: proceso.calzadas,
              kilometroCarril: proceso.kilometroCarril,
            };
          });
          this.dataExport = [...this.headers, ...content];
          const order = ['nombre', 'descripcion', 'fecha', 'calzadas', 'kilometroCarril', 'activo'];
          this.excelService.exportAsExcelFileCustom(this.dataExport, 'procesos', true, order);
          this.cargandoExcel = false;
        } catch (error) { }
      }
    });
  }


  /** Método encargado de cargar la información de un archivo
   * indicado por el usuario en el formulario al sistema */
  importar(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ImportarGrupoComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.search();
        }
      }
    );
  }


  onSortData(sort: Sort) {
    let data = this.dataSource.gruposData;
    if (sort.active && sort.direction !== '') {
        data = data.sort((a: GrupoModel, b: GrupoModel) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'nombre': return this.compare(a.nombre.toUpperCase(), b.nombre.toUpperCase(), isAsc);
                case 'descripcion': return this.compare(a.descripcion.toUpperCase(), b.descripcion.toUpperCase(), isAsc);
                case 'fecha': return this.compare(a.fecha, b.fecha, isAsc);
                case 'calzadas': return this.compare(a.calzadas, b.calzadas, isAsc);
                case 'kilometroCarril': return this.compare(a.kilometroCarril, b.kilometroCarril, isAsc);
                case 'activo': return this.compare(a.activo, b.activo, isAsc);
                default: return 0;
            }
        });
    }
    this.dataSource.gruposSubject.next(data);
}

  private compare(a, b, isAsc) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
