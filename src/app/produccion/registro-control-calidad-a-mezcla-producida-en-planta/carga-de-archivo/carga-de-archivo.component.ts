import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';

@Component({
  selector: 'app-carga-de-archivo',
  templateUrl: './carga-de-archivo.component.html'
})
export class CargaDeArchivoComponent implements OnInit {

  mantenimiento: WorkflowMantenimientoModel;
  archivosCargados: Archivo[];
  requerido = true;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CargaDeArchivoComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: WorkflowMantenimientoModel
  ) {
    this.form = this.formBuilder.group({
      'archivoId': [null, [Validators.required]]
    });
    this.mantenimiento = data;

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  guardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe( val => {
        if (val === 1) {
          this.asociarYGuardarArchivo();
        }
      }
    );
  }

  asociarYGuardarArchivo() {
    // Aqui asociar archivos y enviar al back
    this.mantenimiento.controlesCalidadAMezclaProducidaEnPlanta = this.archivosCargados;
    this.dialogRef.close(this.mantenimiento);
  }

  cancelar() {
    this.dialogRef.close(0);
  }



}
