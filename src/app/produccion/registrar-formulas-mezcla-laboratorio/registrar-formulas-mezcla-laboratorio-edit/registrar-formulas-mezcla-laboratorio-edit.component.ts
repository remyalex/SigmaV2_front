import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Formula } from '../models/formula.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormulaMezclaLaboratorioService } from '../services/registrar-formulas-mezcla-laboratorio.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from '../registrar-formulas-mezcla-laboratorio.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-registrar-formulas-mezcla-laboratorio-edit',
  templateUrl: './registrar-formulas-mezcla-laboratorio-edit.component.html'
})

export class FormulaMezclaLaboratorioEditComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  formula: Formula;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  clone: any;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: FormulaMezclaLaboratorioService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FormulaMezclaLaboratorioEditComponent>,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Formula,
    private dialog: MatDialog
  ) {
    this.formula = data;
    this.form = this.formBuilder.group({
      'tipoMezcla': [null, Validators.compose([Validators.required])],
      'especificacion': [null,  Validators.compose([Validators.required])],
      'masaUnitaria': [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
      'fechaInicial': [null, Validators.compose([Validators.required])],
      'fechaFinal': [null, Validators.compose([])],
      'soporte': []
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.formula));
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
        // tslint:disable-next-line: forin
        for (const key in this.formula) {
          this.formula[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.update(this.formula).subscribe(data => {
      this.dialogRef.close(this.form.value);
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    if (this.form.valid === true) {
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

}
