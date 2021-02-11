import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../../../../../administracion/lugardisponibilidad/lugardisponibilidad.constant';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ImportarExcelModel } from 'src/app/shared/models/importar.excel.model';
import { ImportarExcelRespuestaModel } from 'src/app/shared/models/importar.excel.respuesta.model';
import { RowResult } from 'src/app/shared/models/importar.row.result.model';
import { RecursoDisponiblidadInfo } from 'src/app/administracion/personadisponibilidad/models/recursodisponibilidadimport.model';

/** Componente encargado de gestionar la importacción de la información
 * de la disponibilidad para los lugares */
@Component({
  selector: 'app-importar-disponibilidad-lugar',
  templateUrl: './importar-disponibilidad-lugar.component.html'
})
export class ImportarDisponibilidadLugarComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Modelo de información usado para agrupar la información que se importará del excel */
  importarExcelModel: ImportarExcelModel;
  /** Modelo de información con la respuesta de salida a notificar al usuario*/
  importarExcelRespuestaModel: ImportarExcelRespuestaModel;
  /** Modelo de disponibilidad del lugar a importar */
  lugarDisponibilidad: RecursoDisponiblidadInfo;
  /** Componente usado para invocar los servicios de workflow */
  workflowService: WorkflowService;
  /** Servicio para llamado a funcionalidades propias del SIGMA */
  commonService: CommonService;

  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing: Boolean;
  /** Bandera usada para identificar si el componente ha finalizado su procesamiento */
  finished = false;
  /** Definición de las columnas presentadas en la grilla */
  displayedColumns: string[] = ['data.nombre', 'data.fechaDesde', 'data.fechaHasta', 'error', 'message'];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<RowResult>;
  /** Número de registros presentados en cada página de la grilla */
  pageSize = 5;
   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;



  /**
   * Método encargado de construir una instancia de componente
   *
   * @param data Información a procesar
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param commonService Componente usado para invocar los servicios de mantenimiento
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param formBuilder Componente usado para gestionar los elementos del formulario
   */
  constructor(
    private dialogRef: MatDialogRef<ImportarDisponibilidadLugarComponent>,
    @Inject(MAT_DIALOG_DATA) data: RecursoDisponiblidadInfo,
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    commonService: CommonService,
    workflowService: WorkflowService,
    private snackBar: MatSnackBar,
  ) {
    this.commonService = commonService;
    this.workflowService = workflowService;
    this.lugarDisponibilidad = data;
    this.form = formBuilder.group({
      'archivoId': [null, Validators.compose([Validators.required])],
    });
    this.processing = false;
    this.importarExcelModel = new ImportarExcelModel();
    this.importarExcelRespuestaModel = new ImportarExcelRespuestaModel();
    this.dataSource = new MatTableDataSource<RowResult>(this.importarExcelRespuestaModel.results);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Método encargado de devolver a la pagina principal el componente */
  cancel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de Realizar la carga del archivo desde el cliente y retornar
   * el listado de objetos con la información del archivo en el modelo */
  import() {
    this.processing = true;
    this.importarExcelModel.tipoImportacion = 'DISPONIBILIDAD_LUGAR';
    this.commonService.importFile(this.importarExcelModel).subscribe(
      data => {
        this.importarExcelRespuestaModel = data;
        this.dataSource.data = data.results;
        this.processing = false;
        this.finished = true;
      },
      error => {
        this.processing = false;
        this.finished = true;
        this.snackBar.open(this.constants.error500, 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      });
  }

   /** Método encargado de realizar la descarga archivo con formato excel en el cual
   * el usuario diligenciará la información que posteriormente cargará
   */
   descargarFormato() {
    this.processing = true;
    this.commonService.downloadFormato('DISPONIBILIDAD_LUGAR').subscribe(data => {
      this.processing = false;
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type});
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'formatoDisponibilidadlugar.xlsx';
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
    error => {
      this.processing = false;
    });
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(this.dataSource.data);
  }

}
