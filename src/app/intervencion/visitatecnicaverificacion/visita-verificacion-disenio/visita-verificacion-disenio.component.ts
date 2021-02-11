import { WorkflowMantenimientoModel } from './../../../workflow/models/workflow-mantenimiento.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-visita-verificacion-disenio',
  templateUrl: './visita-verificacion-disenio.component.html'
})
export class VisitaVerificacionDisenioComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  mantenimiento: WorkflowMantenimientoModel;
  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VisitaVerificacionDisenioComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel
    }) {
    this.mantenimiento = data.mantenimiento;
    this.form = this.formBuilder.group({
      tipoSuperficie: [null],
      espesor: [null],
      volumen: [null]
    });

   }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() { }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
  * Marks all controls in a form group as touched and validate
  * @param formGroup - The form group to touch
  */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.dialogRef.close();
        }
      }
    );
  }

}
