import { Archivo } from './../../../../../shared/models/orfeo-response';
import { MantenimientoDocumentoModel } from './../../../../models/mantenimientoDocumento.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Documento } from 'src/app/mejoramiento/disenio/models/documento.model';

/** Componente encargado de gestionar la gestión de documentos del mantenimiento */
@Component({
  selector: 'app-mantenimiento-documento',
  templateUrl: './mantenimiento-documento.component.html'
})
export class MantenimientoDocumentoComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Variable usada para identificar los tipos de archivo permitidos en  */
  public accept = 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel;
  /** Fuentes de datos de los archivos de tipo mantenimiento que se procesará en el componente */
  archivosDatasource: MatTableDataSource<MantenimientoDocumentoModel>;
  /** Modelo de tipo de documentos asociado al mantenimiento */
  mantenimientoDocumento: MantenimientoDocumentoModel;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = new MantenimientoDocumentoModel;
  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<MantenimientoDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel,
      'archivosDatasource': MatTableDataSource<MantenimientoDocumentoModel>,
      'mantenimientoDocumento': MantenimientoDocumentoModel
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    const formato = 'DD-MM-YYYY';
    this.mantenimiento = data.mantenimiento;
    this.archivosDatasource = data.archivosDatasource;
    this.mantenimientoDocumento = data.mantenimientoDocumento;

    if (!this.mantenimiento.id) {
      this.mantenimientoDocumento.fecha = this.utilitiesService.convertDateToString(new Date(), formato);
    }

    if (!this.mantenimientoDocumento.documento) {
      this.mantenimientoDocumento = new MantenimientoDocumentoModel();
      this.mantenimientoDocumento.documento = new Documento();
    }

    this.form = formBuilder.group({
      'archivo': [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.mantenimientoDocumento));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.processing = false;
        if (this.mantenimientoDocumento.id > 0) {
          setTimeout(_ => {
            this.mantenimientoDocumento.documento = this.clone.documento;
          }, 1);
        }
        this.dialogRef.close(this.mantenimientoDocumento);
      }
    });

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.form.valid) {
      this.processing = true;
      if (!this.mantenimientoDocumento.id) {
          this.mantenimiento.documentos.push(this.mantenimientoDocumento);
          this.archivosDatasource.data.push( this.mantenimientoDocumento );
      }
      this.dialogRef.close(this.mantenimiento.documentos);
    }

  }
}
