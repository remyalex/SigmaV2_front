import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../../tipocargueestructura/tipocargueestructura.constant';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { TipocargueService } from '../services/tipocargue.service';
import { TipocargueCriteria } from '../models/tipocargue-criteria.model';
import { TipocargueDatasource } from '../services/tipocargue.datasource';
import { Tipocargue } from '../models/tipocargue.model';
import { TipocargueEditComponent } from '../tipocargue-edit/tipocargue-edit.component';
import { TipocargueDetailComponent } from '../tipocargue-detail/tipocargue-detail.component';
import { TipocargueDeleteComponent } from '../tipocargue-delete/tipocargue-delete.component';
import { CONST_ADMINISTRACION_TIPOCARGUE } from './../tipocargue.constant';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

/** Componente encargado de gestionar la visualización del listados de tipo cargue */
@Component({
  selector: 'sigma-administracion-tipocargue-list',
  templateUrl: './tipocargue-list.component.html'
})

export class TipocargueListComponent implements OnInit, AfterViewInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUE;
  constantsEstrctura = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: TipocargueDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: TipocargueDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new TipocargueCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new TipocargueCriteria();
  /** Columnas de la grilla Tipo cargue que se van a exportar */
  dataTipocargueExport: any = [];
  /**  Columnas de la grilla Estructura que se van a exportar */
  dataEstructuraExport: any = [];
  /**  Columnas de la todas las grilla que se van a exportar */
  dataAllExport: any = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nombre', 'descripcion', 'programaSql', 'activo', 'acciones'
  ];
  /**  Nombres de columnas que presentará la grilla de tipo cargue usada en el componente */
  headersTipocargue = [{
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    programaSql: this.constants.programaSql,
    activo: this.constants.activo,
  }];
  /**  Nombres de columnas que presentará la grilla de estructura usada en el componente */
  headerEstructura = [
    {
      campo: this.constantsEstrctura.campo,
      descripcionCampo: this.constantsEstrctura.descripcion,
      requeridoId: this.constantsEstrctura.requeridoId,
      tipoDatoId: this.constantsEstrctura.tipoDatoId,
      activoCampo: this.constantsEstrctura.activo
    }
  ];
  /**  Nombres de columnas que presentará todas las grillas usadas en el componente */
  headerAll = [
    {
      nombreTipocargue: this.constants.nombre + ' de tipo de cargue',
      descripcionTipocargue: this.constants.descripcion + ' de tipo de cargue',
      programaSqlTipocargue: this.constants.programaSql + ' de tipo de cargue',
      activoTipocargue: this.constants.activo,

      campoEstructura: this.constantsEstrctura.campo + ' de estructura',
      descripcionCampoEstructura: this.constantsEstrctura.descripcion + ' de estructura',
      requeridoIdEstructura: this.constantsEstrctura.requeridoId + ' de estructura',
      tipoDatoIdEstructura: this.constantsEstrctura.tipoDatoId + ' de estructura',
      activoCampoEstructura: this.constantsEstrctura.activo
    }
  ];
  /** Listado de nombre de las columnas Tipo cargue que se presentarán en la grilla  */
  orderTipocargue = ['nombre', 'descripcion', 'programaSql', 'activo'];
  /** Listado de nombre de las columnas Estructura que se presentarán en la grilla  */
  orderEstructura = ['campo', 'descripcionCampo', 'requeridoId', 'tipoDatoId', 'activoCampo'];
  /** Listado de nombre de todas las columnas que se presentarán en la grilla  */
  orderAll = [
    'nombreTipocargue',
    'descripcionTipocargue',
    'programaSqlTipocargue',
    'activoTipocargue',

    'campoEstructura',
    'descripcionCampoEstructura',
    'requeridoIdEstructura',
    'tipoDatoIdEstructura',
    'activoCampoEstructura'
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
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private servicio: TipocargueService,
    private dialog: MatDialog,
  ) { }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new TipocargueDatasource(this.servicio);
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
   * @param tipocargue Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(tipocargue: Tipocargue): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargue;
    dialogConfig.width = '70%';
    dialogConfig.height = '90%';

    const dialogRef = this.dialog.open(TipocargueEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param tipocargue Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(tipocargue: Tipocargue): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargue;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipocargueDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param tipocargue Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(tipocargue: Tipocargue): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargue;

    const dialogRef = this.dialog.open(TipocargueDeleteComponent, dialogConfig);

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
    let worksheetTipocargues: XLSX.WorkSheet;
    let worksheetEstructura: XLSX.WorkSheet;
    let worksheetAll: XLSX.WorkSheet;

    this.dataSourceExport = new TipocargueDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;
    this.criteriaExport.nombre = this.criteria.nombre;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }
    this.dataSourceExport.loadData(this.criteriaExport);

    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        let contentTipocargue = [];
        let contentEstructura = [];
        let contentAll = [];

        try {
          contentTipocargue = this.dataSourceExport.tipocargueData.map((tipoCargue: Tipocargue) => {
            return {
              nombre: tipoCargue.nombre,
              descripcion: tipoCargue.descripcion,
              programaSql: tipoCargue.programaSql,
              activo: tipoCargue.activo ? this.constants.si : this.constants.no
            };
          });

        } catch (error) { }

        this.dataTipocargueExport = [... this.headersTipocargue, ...contentTipocargue];

        for (let i = 0; i < this.dataSourceExport.tipocargueData.length; i++) {
          if (this.dataSourceExport.tipocargueData[i].estructuras.length > 0) {
            const itmesEstructuras = this.dataSourceExport.tipocargueData[i].estructuras.map((item: any) => {
              item = {
                campo: item.campo,
                descripcionCampo: item.descripcion,
                requeridoId: item.requerido ? this.constants.si : this.constants.no,
                tipoDatoId: item.tipoDato ? item.tipoDato.valor : '',
                activoCampo: item.activo ? this.constants.si : this.constants.no,
              };
              contentEstructura.push(item);
            });
            const itemsAll = this.dataSourceExport.tipocargueData[i].estructuras.map((item: any) => {
              item = {
                nombreTipocargue: this.dataSourceExport.tipocargueData[i].nombre,
                descripcionTipocargue: this.dataSourceExport.tipocargueData[i].descripcion,
                programaSqlTipocargue: this.dataSourceExport.tipocargueData[i].programaSql,
                activoTipocargue: this.dataSourceExport.tipocargueData[i].activo ? this.constants.si : this.constants.no,

                campoEstructura: item.campo,
                descripcionCampoEstructura: item.descripcion,
                requeridoIdEstructura: item.requerido ? this.constants.si : this.constants.no,
                tipoDatoIdEstructura: item.tipoDato ? item.tipoDato.valor : '',
                activoCampoEstructura: item.activo ? this.constants.si : this.constants.no,
              };
              contentAll.push(item);
              return item;
            });
          }
        }
        this.dataEstructuraExport = [... this.headerEstructura, ...contentEstructura];
        this.dataAllExport = [... this.headerAll, ...contentAll];

        const hayTipocargue = contentTipocargue.length > 0;
        const hayEstructura = contentEstructura.length > 0;

        worksheetTipocargues = XLSX.utils.json_to_sheet(this.dataTipocargueExport, { skipHeader: true, header: this.orderTipocargue });
        worksheetEstructura = XLSX.utils.json_to_sheet(this.dataEstructuraExport, { skipHeader: true, header: this.orderEstructura });
        worksheetAll = XLSX.utils.json_to_sheet(this.dataAllExport, { skipHeader: true, header: this.orderAll });
        let workbook;

        if (hayTipocargue && hayEstructura) {
          workbook = {
            Sheets: {
              'tipo_cargue': worksheetTipocargues, 'estructura': worksheetEstructura, 'todos': worksheetAll
            },
            SheetNames: ['tipo_cargue', 'estructura', 'todos']
          };
        } else {
          if (hayTipocargue) {
            workbook = {
              Sheets: {
                'tipo_cargue': worksheetTipocargues
              },
              SheetNames: ['tipo_cargue']
            };
          }
        }

        if (hayTipocargue || hayEstructura) {
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, 'tipos_cargues');
        }

        this.cargandoExcel = false;
      }
    });
  }

  /** Método encargado de almacenar el archivo Excel
   * @param buffer Objeto que recibe el archivo xlsx
   * @param fileName nombre del archivo
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
