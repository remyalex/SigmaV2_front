import { ExcelService } from './../../../shared/services/excel.service';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CONST_INSPECCION_REGISTRO_AMBIENTAL } from '../registro-inspeccion.constant';
import { FormBuilder } from '@angular/forms';
import {
  MatSnackBar,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialogConfig
} from '@angular/material';
import { PredisenioService } from '../../../mejoramiento/predisenio/service/predisenio.service';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { ElementoInspeccionModel } from '../models/elemento-inspeccion.model';

@Component({
  selector: 'sigma-consultar-inspeccion-ambiental',
  templateUrl: './consultar-inspeccion.component.html'
})
export class ConsultarInspeccionComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() actionEvent = new EventEmitter();
  
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

 /** Constantes a usar en el componente */
  constants = CONST_INSPECCION_REGISTRO_AMBIENTAL;
  currentAction: any;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: any;
  lengthList: Number;
  noInfoToShow = false;
  dataSourceExcel: any = [];
  content: any = [];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'numeral',
    'fechaApertura',
    'fechaCierre',
    'accionesAdelantadas',
    'situacion',
    'elemento',
    'observaciones',
    'estado',
    'acciones'
  ];

  headers = [
    {
      pk: 'PK',
      civ: 'CIV',
      zona: 'ZONA',
      localidad: 'LOCALIDAD',
      upla: 'UPZ',
      barrio: 'BARRIO',
      fechaApertura: 'FECHA APERTURA',
      fechaFin: 'FECHA CIERRE',
      situacion: 'SITUACION',
      elemento: 'ELEMENTO',
      indArboreos: 'INDIVIDUOS ARBOREOS',
      protArbolesCant: 'PROTECCION ARBOLES CANTIDAD',
      sumideros: 'SUMIDEROS',
      protSumiderosCant: 'PROTECCION SUMIDEROS CANTIDAD',
      espacioPublico: 'ESPACIO PUBLICO',
      protEspaciosPublicosCant: 'PROTECCION ESPACIOS PUBLICOS CANTIDAD',
      banios: 'BAÑOS',
      protBaniosCant: 'BAÑOS MANTENIMIENTO CANTIDAD',
      observaciones: 'OBSERVACIONES',
      accion: 'ACCION',
      estado: 'ESTADO'
    }
  ];

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private servicio: PredisenioService,
    private workflowService: WorkflowService,
    private utilitiesServices: UtilitiesService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    if (this.mantenimiento.inspeccionesAmbiental !== undefined) {
      this.loader = false;

      if (this.mantenimiento.inspeccionesAmbiental.length > 0) {
        this.dataSource = new MatTableDataSource(
          this.mantenimiento.inspeccionesAmbiental
        );
        this.lengthList = this.dataSource.filteredData.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.filteredData.length <= 0) {
          this.noInfoToShow = true;
        } else {
          this.noInfoToShow = false;
        }
      }
    }
  }

  loadDataExcel(inspeccion: ElementoInspeccionModel) {
    this.content.pk = this.mantenimiento.pk;
    this.content.civ = this.mantenimiento.civ;
    this.content.zona = this.mantenimiento.zona
      ? this.mantenimiento.zona.nombre
      : '';
    this.content.localidad = this.mantenimiento.localidad
      ? this.mantenimiento.localidad.nombre
      : '';
    this.content.upla = this.mantenimiento.upla
      ? this.mantenimiento.upla.nombre
      : '';
    this.content.barrio = this.mantenimiento.barrio
      ? this.mantenimiento.barrio.nombre
      : '';
    this.content.fechaApertura = inspeccion.fecha;
    this.content.fechaCierre = '';
    this.content.situacion = inspeccion.situacion ? inspeccion.situacion.descripcion : '';
    this.content.elemento = inspeccion.elemento ? inspeccion.elemento.descripcion : '';
    this.content.indArboreos = '';
    this.content.protArbolesCant = inspeccion.protArbolescantidad;
    this.content.sumideros = '';
    this.content.protSumiderosCant = inspeccion.protSumiderosCantidad;
    this.content.espacioPublico = '';
    this.content.protEspaciosPublicosCant = inspeccion.protEspaciosCantidad;
    this.content.banios = '';
    this.content.protBaniosCant = inspeccion.protBaniosCantidad;
    this.content.observaciones = this.forData('observacionElemento', inspeccion);
    this.content.accion = this.forData('accion', inspeccion);
    this.content.estado = inspeccion.estado ? inspeccion.estado.descripcion : '';

    this.dataSourceExcel.push(this.content);
  }

  forData(attr: any, inspeccion: ElementoInspeccionModel): String {
    let msg = '';
    if (inspeccion.detalleInspeccion) {
      // tslint:disable-next-line: forin
      for (const detalle in inspeccion.detalleInspeccion) {
        // tslint:disable-next-line: forin
        for (const dato in inspeccion.detalleInspeccion[detalle]) {
          if (dato === attr) {
            msg += inspeccion.detalleInspeccion[detalle][dato] + '\n\n';
          }
        }
      }

    }
    return msg;
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.currentAction = 'list';
        this.back.emit({ currentAction: this.currentAction });
      }
    });
  }

  viewForm(inspeccion: ElementoInspeccionModel) {
    this.currentAction = 'editarInspeccion';
    this.actionEvent.emit({ currentAction: this.currentAction, inspeccion: inspeccion });
  }

  exportAsXLSX(inspeccion: ElementoInspeccionModel) {
    this.loadDataExcel(inspeccion);
    let exportData: any = [];
    exportData = [...this.headers, ...this.dataSourceExcel];
    this.excelService.exportAsExcelFileCustom(
      exportData,
      'InspeccionAmbiental',
      true,
      ''
    );
  }
}
