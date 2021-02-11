import { Component, OnInit, Inject } from '@angular/core';
import { CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS } from '../mantenimientos-programados.constant'
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { MantenimientosProgramadosService } from '../services/mantenimientos-programados.service';
import { MantenimientoProgramado } from '../models/mantenimientos-programados.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'sigma-maquinaria-mantenimiento-cancel',
  templateUrl: './maquinaria-mantenimiento-cancel.component.html'
})
export class MaquinariaMantenimientoCancelComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS;
  mantenimiento: MantenimientoProgramado;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  minDate: Date = new Date();
  showTaller = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<MaquinariaMantenimientoCancelComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private service: MantenimientosProgramadosService,
    private dialog: MatDialog
  ) {
    console.log("data", data);
    this.mantenimiento = data as MantenimientoProgramado;
    this.form = this.fb.group({
      motivo: [null, Validators.compose([Validators.required, Validators.maxLength(140)])]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          this.dialogRef.close(0);
        }
      }
    );
  }
  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.form);

    //this.form.get('maquinaria').setValue(this.maquinaria);

    if (!this.form.valid) {
      console.log("algo falta!");
      return;
    }

    console.log("Todo está correcto");

    this.mantenimiento.motivoCancelacion = this.form.get('motivo').value;
    this.mantenimiento.fechaCancelacion = new Date();
    this.mantenimiento.estado = 'CANCELADO';
    this.mantenimiento.cancelado = true;

    this.disableSubmit = true;
    this.service.update(this.mantenimiento).subscribe(
      data => {
        this.dialogRef.close(this.mantenimiento);
        this.snackBar.open('¡Se actualizó el mantenimiento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open('¡Ocurrió un error al actualizar el mantenimiento!', 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
