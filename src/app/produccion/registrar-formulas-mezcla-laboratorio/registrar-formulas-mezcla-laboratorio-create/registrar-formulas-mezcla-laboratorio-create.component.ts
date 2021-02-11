import { Component, OnInit } from '@angular/core';
import { Formula } from '../models/formula.model';
import { FormulaMezclaLaboratorioService } from '../services/registrar-formulas-mezcla-laboratorio.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from '../registrar-formulas-mezcla-laboratorio.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-registrar-formulas-mezcla-laboratorio-create',
  templateUrl: './registrar-formulas-mezcla-laboratorio-create.component.html',
})
export class FormulaMezclaLaboratorioCreateComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  formula: Formula = new Formula();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  disabledBtnSave: Boolean = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: FormulaMezclaLaboratorioService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private formulaService: FormulaMezclaLaboratorioService,
  ) {
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
    this.formula = new Formula();
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
          this.router.navigate([urlBack]);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.formula).subscribe(
      data => {
        this.disabledBtnSave = false;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    if (this.form.valid === true) {
      this.disabledBtnSave = true;
      this.formulaService.ultimaFormulaVigente(this.formula.tipoMezcla.id).subscribe(formula => {
        this.disabledBtnSave = false;
        this.snackBar.open(
          this.constants.existeFormulaVigente, 'X',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }, error => {
        if (error.status === 404) {
          this.save();
        } else {
          this.disabledBtnSave = false;
          this.utilitiesService.formErrorMessages(error, null, this.snackBar);
        }
      });
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

}
