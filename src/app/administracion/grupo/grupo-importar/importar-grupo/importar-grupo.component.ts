import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ImportarExcelModel } from 'src/app/shared/models/importar.excel.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImportarExcelRespuestaModel } from 'src/app/shared/models/importar.excel.respuesta.model';
import { RecursoDisponiblidadInfo } from 'src/app/administracion/personadisponibilidad/models/recursodisponibilidadimport.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { RowResult } from 'src/app/shared/models/importar.row.result.model';
import { CONST_ADMINISTRACION_GRUPO } from '../../grupo.constant';
// tslint:disable-next-line: max-line-length
import { MatTableDataSource, MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

/** Componente encargado de gestionar la importación de la información de un grupo */
@Component({
  selector: 'app-importar-grupo',
  templateUrl: './importar-grupo.component.html'
})
export class ImportarGrupoComponent implements OnInit {
  /** Formulario a través del cual se captura la infomación */
  form: FormGroup;
  /** Modelo para importar datos del excel */
  importarExcelModel: ImportarExcelModel;
  /** Modelo de información de respuesta informar al usuario */
  importarExcelRespuestaModel: ImportarExcelRespuestaModel;
  /** Información de la disponibilidad de tiempo del recurso */
  personaDisponibilidad: RecursoDisponiblidadInfo;
  /** Elemento para servicio de llamado del workflow */
  workflowService: WorkflowService;
  /** Elemento para invocación de servicios comunes */
  commonService: CommonService;
  /** Bandera que indica si el componente se encuentra
   * procesando alguna peticion de usuario
   **/
  processing: Boolean;
  /** Bandera que indica si el componente ya finalizo peticiones de usuario*/
  finished = false;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
  /** Listado de columnas que serán importadas en el archivo */
  displayedColumns: string[] = ['data.nombre', 'data.descripcion', 'data.origenSeleccion', 'error', 'message'];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<RowResult>;
  /** Tamaño predeterminado de la cantidad de registros presentados al usuario en la grilla */
  pageSize = 5;
  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param commonService Componente a traves del cual se accede a los servicios comunes de Sigma
   * @param workflowService Componente a través del cual se accede a los servicios de Workflow
   */
  constructor(
    private dialogRef: MatDialogRef<ImportarGrupoComponent>,
    @Inject(MAT_DIALOG_DATA) data: RecursoDisponiblidadInfo,
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    commonService: CommonService,
    workflowService: WorkflowService,
    private snackBar: MatSnackBar,
  ) {
    this.commonService = commonService;
    this.workflowService = workflowService;
    this.personaDisponibilidad = data;
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

  /** Método encargado de devolver a la pagina principal el componente
   * omitiendo los cambios del usuario, previa autorización de él */
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

  /** Método encargado de cargar la información de un archivo
   * indicado por el usuario en el formulario al sistema */
  import() {
    this.processing = true;
    this.importarExcelModel.tipoImportacion = 'GESTIONAR_SELECCION';
    this.commonService.importFile(this.importarExcelModel).subscribe(
      data => {
        this.finished = true;
        this.importarExcelRespuestaModel = data;
        this.dataSource.data = data.results;
        this.processing = false;
      },
      error => {
        this.processing = false;
        this.finished = true;
      });
  }

  /**
   * Método encargado de solicitar y descargar el formato
   * en el cual registrará el usuario la imformación a importar en el sistema
   **/
  descargarFormato() {
    this.processing = true;
    this.commonService.downloadFormato('GESTIONAR_SELECCION').subscribe(data => {
      const body = data;
      this.processing = false;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'formatoGestionarSelecciones.xlsx';
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
  close() {
    this.dialogRef.close(this.dataSource.data);
  }
}
