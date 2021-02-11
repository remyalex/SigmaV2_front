import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ImportarExcelModel } from 'src/app/shared/models/importar.excel.model';
import { RowResult } from 'src/app/shared/models/importar.row.result.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { SigmaSumatoriasComponent } from 'src/app/shared/component/sigma-sumatorias/sigma-sumatorias.component';

@Component({
  selector: 'app-importar-seleccion-pks',
  templateUrl: './importar-seleccion-pks.component.html'
})
export class ImportarSeleccionPksComponent implements OnInit {

  form: FormGroup;
  importarExcelModel: ImportarExcelModel;
  workflowService: WorkflowService;
  tipoImportacion: string;
  commonService: CommonService;
  mantenimientos: Array<WorkflowMantenimientoModel> = [];

  processing: Boolean;
  finished = false;
  cargueFile = false;
  registrosValidos: Boolean = false;

  displayedColumns = ['data.pk', 'error', 'message', 'acciones'];
  dataSourceTable = new MatTableDataSource<RowResult>();
  @ViewChild(MatPaginator) paginator: MatPaginator;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<ImportarSeleccionPksComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    commonService: CommonService,
    workflowService: WorkflowService,
  ) {
    this.commonService = commonService;
    this.workflowService = workflowService;

    this.form = formBuilder.group({
      'archivoId': [null, Validators.compose([Validators.required])],
    });
    this.processing = false;
    this.tipoImportacion = data.tipoImportacion;
    this.importarExcelModel = new ImportarExcelModel();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

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

  import() {
    this.processing = true;
    this.importarExcelModel.tipoImportacion = this.tipoImportacion;
    this.commonService.getMantenimientosFile(this.importarExcelModel).subscribe(
      data => {
        if (data.results !== undefined) {
          if (data.error) {
            this.registrosValidos = false;
          } else {
            this.registrosValidos = true;
          }
          data.results.forEach(mantenimiento => {
            this.mantenimientos.push(mantenimiento.data);
          });
          this.dataSourceTable.data = data.results;
        }
        this.processing = false;
        this.cargueFile = true;
      },
      error => {
        this.processing = false;
        this.cargueFile = true;
      });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processing = true;
    this.close();
  }

  eliminar( elemento ): void {
    let valido = true;
    let indexSelect = '-1';
    for (const index in this.mantenimientos) {
      if (this.mantenimientos[index].pk === elemento.data.pk) {
        indexSelect = index;
      } else {
        if (this.dataSourceTable.data[index].error) {
          valido = false;
        }
      }
    }
    if (indexSelect !== '-1') {
      this.mantenimientos.splice(parseFloat(indexSelect), 1);
      if (this.mantenimientos.length === 0) { valido = false; }
    }

    for (const index in this.dataSourceTable.data) {
      if (this.dataSourceTable.data[index].data.pk === elemento.data.pk) {
        this.dataSourceTable.data.splice(+index, 1);
      }
    }
    this.dataSourceTable.data = this.dataSourceTable.data;
    this.registrosValidos = valido;
  }

  descargarFormato() {
    this.processing = true;
    this.commonService.downloadFormato('ENVIO_PK').subscribe(data => {
      const body = data;
      this.processing = false;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type});
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'ImportarEnviosPks.xlsx';
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
    this.dialogRef.close(this.mantenimientos);
  }

}
