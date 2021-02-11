import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { ArchivoMantenimientoModel } from 'src/app/workflow/models/archivoMantenimiento';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de gestionar el proceso de archivos del mantenimiento */
@Component({
  selector: 'app-archivos-mantenimiento',
  templateUrl: './archivos-mantenimiento.component.html'
})
export class ArchivosMantenimientoComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Tipos de archivo admitidos */
  public accept = 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<ArchivoMantenimientoModel>;
  /** Archivo de mantenimiento ingresado por el usuario */
  archivoMantenimiento: ArchivoMantenimientoModel = new ArchivoMantenimientoModel();
  /** Actividad en la que se realizará el cargue del archivo indicado */
  actividadCargaArchivos: String = '';
  /** Clón del objeto que se va a modificar información */
  clone = new ArchivoMantenimientoModel;
  /** Variable usada para habilitar o deshabilitar boton guardar */
  loading = false;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente de dialog usado para presentar la información adicional
  * @param data Datos asociados a la funcionalidad a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<ArchivosMantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'actividadCargaArchivos': String,
      'mantenimiento': WorkflowMantenimientoModel,
      'datasource': MatTableDataSource<ArchivoMantenimientoModel>,
      'archivoMantenimiento': ArchivoMantenimientoModel
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    const formato = 'DD-MM-YYYY';
    this.mantenimiento = data.mantenimiento;
    this.dataSource = data.datasource;
    this.actividadCargaArchivos = data.actividadCargaArchivos;
    this.archivoMantenimiento = data.archivoMantenimiento;

    if (!this.archivoMantenimiento.id) {
      this.archivoMantenimiento.fechaRegistro = this.utilitiesService.convertDateToString(new Date(), formato);
    }

    this.form = formBuilder.group({
      'archivo': [null, Validators.compose([Validators.required])],
      'observacion': [null, Validators.compose([Validators.maxLength(300)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.archivoMantenimiento));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        if (this.archivoMantenimiento.id > 0) {
          setTimeout(_ => {
            this.archivoMantenimiento.archivo = this.clone.archivo;
          }, 1);
        }
        this.dialogRef.close();
      }
    });

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.loading = true;
    if (this.form.valid) {
      if (!this.archivoMantenimiento.id) {
        if (this.actividadCargaArchivos === 'registrar-resultado-apique') {
          this.mantenimiento.resultadosSolicitudesApiques.push(this.archivoMantenimiento);
        } else {
          this.mantenimiento.resultadosSolicitudesAforos.push(this.archivoMantenimiento);
        }
      }
      if (this.actividadCargaArchivos === 'registrar-resultado-apique') {
        this.dataSource.data = this.mantenimiento.resultadosSolicitudesApiques;
      } else {
        this.dataSource.data = this.mantenimiento.resultadosSolicitudesAforos;
      }
      this.dialogRef.close();
    }
  }
}
