import { Component, OnInit, Inject } from '@angular/core';
import { CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS } from '../mantenimientos-programados.constant'
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { MantenimientosProgramadosService } from '../services/mantenimientos-programados.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'sigma-maquinaria-mantenimiento-add',
  templateUrl: './maquinaria-mantenimiento-add.component.html'
})
export class MaquinariaMantenimientoAddComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS;
  newMantenimiento: any = {};
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  minDate: Date = new Date();
  showTaller = false;
  fechaInicio: string;
  /** fecha actual - variable auxiliar */
  fechaHoy: Date = new Date();

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<MaquinariaMantenimientoAddComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private service: MantenimientosProgramadosService,
    private dialog: MatDialog
  ) {
    console.log("data", data);
    //this.maquinaria = data;
    this.form = this.fb.group({
      tipo: [this.newMantenimiento.tipo, Validators.compose([Validators.required])],
      fechaInicio: [this.newMantenimiento.fecha, Validators.compose([Validators.required])],
      taller: [null, []],
      equipo: [data, Validators.compose([Validators.required])],
    });

    this.form.get('tipo').valueChanges.subscribe(() => {
      const value = this.form.get('tipo').value;

      if (value === null || value === undefined) {
        return;
      }

      if (value['valor'].indexOf('CORRECTIVO') !== -1) {
        this.form.get('taller').setValidators(Validators.required);
        this.showTaller = true;
      } else {
        this.form.get('taller').setValidators([]);
        this.form.get('taller').setValue(undefined);
        this.showTaller = false;
      }
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    //this.fechaHoy = this.utilitiesService.addDays(this.fechaHoy, 1);
    this.newMantenimiento.fechaMin = this.utilitiesService.convertDateToString(this.fechaHoy, 'DD-MM-YYYY');
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
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

  /** Método encargado de limpiar los valores del calendario */
  clearInputCalendar() {
    this.form.get('fechaInicio').setValue(null);
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.form);

    //this.form.get('maquinaria').setValue(this.maquinaria);

    if (!this.form.valid) {
      console.log("algo falta!");
      return;
    }

    if (this.form.get('tipo').value === 'PREVENTIVO') {
      this.form.setValue({ taller: undefined })
    }
    this.form.get('fechaInicio').setValue(this.utilitiesService.convertStringToDate(this.fechaInicio, 'DD-MM-YYYY HH:mm:00'));
    console.log("values", this.form.value);
    console.log("Todo está correcto");

    this.disableSubmit = true;
    this.service.create(this.form.value).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se creó el mantenimiento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open('¡Ocurrió un error al crear el mantenimiento!', 'X', {
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
