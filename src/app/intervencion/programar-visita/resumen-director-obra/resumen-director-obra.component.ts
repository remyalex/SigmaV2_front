import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../../../workflow/forms/diagnostico/shared/diagnostico.constants';
import { ResumenDirectorObraDatasource } from '../../services/resumen.director.obra.datasource';
import { ResumenDirectorObraCriteria } from 'src/app/intervencion/models/ResumenDirectorObraCriteria';
import { ResumenDirectorObraService } from '../../services/resumen.director.obra.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { ResumenDirectorObraModel } from '../../models/ResumenDirectorObra';
import { VerProgramacionComponent } from '../ver-programacion/ver-programacion.component';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-resumen-director-obra',
  templateUrl: './resumen-director-obra.component.html'
})
export class ResumenDirectorObraComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // tslint:disable-next-line: no-input-rename
  @Input('data') data: WorkflowMantenimientoActividadModel = new WorkflowMantenimientoActividadModel();

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  public formCriteria: FormGroup;
  public dataSource: ResumenDirectorObraDatasource;
  public dataSourceExport: ResumenDirectorObraDatasource;
  public criteria = new ResumenDirectorObraCriteria();
  public criteriaExport = new ResumenDirectorObraCriteria();
  public cargandoExcel = false;
  directorObra: any;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'directorObraNombre', 'numeroVisitasSinRealizar', 'zona', 'acciones'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    directorObraNombre: this.constants.directorObra,
    numeroVisitasSinRealizar: this.constants.numeroVisitasProgramadasSinRealizar,
    zona: this.constants.zona,
  }];


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private programarVisitaVerificacionService: ResumenDirectorObraService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private formBuilder: FormBuilder
  ) {
    this.createFormCriteria();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource = new ResumenDirectorObraDatasource(this.programarVisitaVerificacionService);
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
  }


  createFormCriteria() {
    this.formCriteria = this.formBuilder.group({
      directorObra: [null, []]
    });
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

  verProgramacion(directorObra: ResumenDirectorObraModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      directorObra: directorObra,
      data: this.data
    };
    dialogConfig.width = '80%';

    this.dialog.open(VerProgramacionComponent, dialogConfig);
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

  limpiar(): void {
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  dataExport: any = [];
  exportAsXLSX(): void {
    this.dataSourceExport = new ResumenDirectorObraDatasource(this.programarVisitaVerificacionService);
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
          content = this.dataSourceExport.resumenDirectorObraData.map((item: any) => {
            return {
              directorObraNombre: item.directorObraNombre,
              numeroVisitasSinRealizar: item.numeroVisitasSinRealizar,
              zona: item.zona,
            };
          });
        } catch (error) { }
        this.dataExport = [...this.headers, ...content];
        const order = [
          'directorObraNombre',
          'numeroVisitasSinRealizar',
          'zona'
        ];
        this.excelService.exportAsExcelFileCustom(
          this.dataExport,
          'resumenDirectorObra',
          true,
          order
        );
        this.cargandoExcel = false;
      }
    });
  }

}
