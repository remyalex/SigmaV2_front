import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { FormulaMezclaLaboratorioService } from '../services/registrar-formulas-mezcla-laboratorio.service';
import { FormulaCriteria } from '../models/formula-criteria.model';
import { FormulaMezclaDatasource } from '../services/registrar-formulas-mezcla-laboratorio.datasource';
import { Formula } from '../models/formula.model';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioEditComponent } from '../registrar-formulas-mezcla-laboratorio-edit/registrar-formulas-mezcla-laboratorio-edit.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDetailComponent } from '../registrar-formulas-mezcla-laboratorio-detail/registrar-formulas-mezcla-laboratorio-detail.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDeleteComponent } from '../registrar-formulas-mezcla-laboratorio-delete/registrar-formulas-mezcla-laboratorio-delete.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from '../registrar-formulas-mezcla-laboratorio.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { LugarAdminComponent } from 'src/app/administracion/lugar/lugar-admin/lugar-admin.component';

@Component({
  selector: 'app-registrar-formulas-mezcla-laboratorio-list',
  templateUrl: './registrar-formulas-mezcla-laboratorio-list.component.html'
})
export class FormulaMezclaLaboratorioListComponent implements OnInit, AfterViewInit {

  currentAction = '';
  formula: Formula;
  @Output() showCreate = new EventEmitter();

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: FormulaMezclaLaboratorioService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar) { }
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  /** Bandera de control para identificar si el componente se encuentra generando el archivo a descargar*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: FormulaMezclaDatasource;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: FormulaMezclaDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new FormulaCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new FormulaCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = ['tipoMezcla', 'fechaInicial', 'fechaFinal', 'soporte', 'acciones'];

  headers = [
    {
      id: this.constants.id,
      tipoMezcla: this.constants.tipoMezcla,
      fechaInicial: this.constants.fechaInicial,
      fechaFinal: this.constants.fechaFinal
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
    this.dataSource = new FormulaMezclaDatasource(this.servicio);
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
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.currentAction = 'formulas';
    this.loadData();
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(formula: Formula): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formula;
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(FormulaMezclaLaboratorioEditComponent, dialogConfig);
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
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(formula: Formula): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formula;
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(FormulaMezclaLaboratorioDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(formula: Formula): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = formula;

    const dialogRef = this.dialog.open(FormulaMezclaLaboratorioDeleteComponent, dialogConfig);

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

  registrarInsumo(formula: Formula) {
    this.formula = formula;
    this.currentAction = 'insumos-edit';
    this.showCreate.emit({show: false});
  }

  detalleMateriaPrima(formula: Formula) {
    this.formula = formula;
    this.currentAction = 'insumos-detail';
    this.showCreate.emit({show: false});
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( ) {
    this.loadData();
    this.currentAction = 'formulas';
    this.showCreate.emit({show: true});
  }


  exportAsXLSX(): void {
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    this.criteriaExport.size = total;
    if (this.criteria.size > this.criteriaExport.size) {
      this.criteriaExport.size = this.criteria.size;
    }
    this.criteriaExport.page = 0;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = this.criteria[key];
      }
    }

    this.dataSourceExport = new FormulaMezclaDatasource(this.servicio);
    this.dataSourceExport.loadData(this.criteriaExport);

    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        try {
          this.dataExport = this.dataSourceExport.formulaData.map((formula: Formula) => {
            return {
              id: formula.id,
              tipoMezcla: formula.tipoMezcla ? formula.tipoMezcla.descripcion : '',
              fechaInicial: formula.fechaInicial,
              fechaFinal: formula.fechaFinal
            };
          });
        } catch (error) {
          console.log(error);
        }

        this.dataExport = [...this.headers, ...this.dataExport];
        const order = [...this.headers];
        this.excelService.exportAsExcelFileCustom(this.dataExport, 'Formulas', true, order);
        this.cargandoExcel = false;
      }
    });
  }

}
