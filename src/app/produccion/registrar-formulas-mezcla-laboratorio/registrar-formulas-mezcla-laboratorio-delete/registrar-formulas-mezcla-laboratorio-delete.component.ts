import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Formula } from '../models/formula.model';
import { FormulaMezclaLaboratorioService } from '../services/registrar-formulas-mezcla-laboratorio.service';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from './../registrar-formulas-mezcla-laboratorio.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-registrar-formulas-mezcla-laboratorio-delete',
  templateUrl: './registrar-formulas-mezcla-laboratorio-delete.component.html'
})
export class FormulaMezclaLaboratorioDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  formula: Formula;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<FormulaMezclaLaboratorioDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Formula,
    private servicio: FormulaMezclaLaboratorioService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService

  ) {
    this.formula = data;
    this.form = fb.group( { id: [this.formula.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.delete(this.formula.id).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
       this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
