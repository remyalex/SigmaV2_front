import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MantenimientoCriteria } from 'src/app/workflow/criterials/mantenimiento-criteria.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { MatDialog, MatSnackBar, MatPaginator, MatSort, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MantenimientoDatasource } from 'src/app/workflow/datasources/mantenimiento-datasource';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MantenimientoDocumentoModel } from 'src/app/workflow/models/mantenimientoDocumento.model';
import { COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO } from './../historial-mantenimiento.constants';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { MapService } from 'src/app/shared/services/map.service';
import { HistorialMantenimientoDocumentoCriteria } from '../models/historialMantenimientoDocumento.criteria.model';

/** Componente encargado de gestioanr el historial de documentos de un mantenimiento */
@Component({
  selector: 'sigma-historial-mantenimiento-documento',
  templateUrl: './historial-mantenimiento-documento.component.html'
})
export class HistorialMantenimientoDocumentoComponent implements OnInit {

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MantenimientoDocumentoModel[];
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new HistorialMantenimientoDocumentoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente para la exportación */
  criteriaExport = new HistorialMantenimientoDocumentoCriteria();
  /** Listado de documentos */
  listDocumentos: any;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];

  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing: boolean = true;

  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  @Input() mantenimiento: any = new WorkflowMantenimientoModel();


  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'id',
    'fecha',
    'nombre',
    'version',
    'autor',
    'estadoDocumento',
    'acciones'
  ];

  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    id: 'id',
    fecha: 'Fecha',
    nombre: 'Nombre Archivo',
    version: 'Version',
    autor: 'Autor',
    estadoDocumento: 'Estado Documento',
    acciones: 'Acciones'
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: any;

  /** Tamaño de la lista */
  lengthList: Number;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param mapService Componente usado para gestionar los servicios del mapa
   */
  constructor(
    private servicio: MantenimientoService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {

  }


  /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.servicio.mantenimientoById(this.mantenimiento.mantenimientoId).subscribe(data => {
      this.mantenimiento = data;
      this.mantenimiento.documentos.sort();
      this.loadData(true);
    }, error => {
    });
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
  }


  /**
  * Método encargado de solicitar el listado de los pks al servicio
  *
  * @param order Indicador de si se realizará la presentación de los datos en orden
  */
  loadData(order: boolean): void {
    if (this.mantenimiento.documentos != undefined) {
      this.dataSource = this.mantenimiento.documentos;
      const mantenimientoDocs: MantenimientoDocumentoModel[] = this.mantenimiento.documentos.sort((a, b) => Number(a.id) - Number(b.id));
      this.listDocumentos = new MatTableDataSource(this.mantenimiento.documentos.sort((a, b) => Number(a.id) - Number(b.id)));
      this.listDocumentos.sort = this.sort;
      this.listDocumentos.paginator = this.paginator;
      this.lengthList = this.listDocumentos.filteredData.length;
      this.processing = false;
    }
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData(true);
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData(true);
    });
  }

  /** Método encargado de devolver a la pagina principal el componente */
  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.mapService.getVisor().visible = true;
          this.back.emit({ currentAction: 'list' });
        }
      }
    );
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo PDF
   */
  exportarPDF(mantenimientoDocumento: MantenimientoDocumentoModel) {
    this.servicio.generarHistoricoPDF(mantenimientoDocumento.id, mantenimientoDocumento.documento.archivo.nombre);
  }

}
