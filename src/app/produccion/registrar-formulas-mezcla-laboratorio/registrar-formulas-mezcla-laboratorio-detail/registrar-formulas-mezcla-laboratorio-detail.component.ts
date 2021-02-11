import { Component, OnInit, Inject } from '@angular/core';
import { Formula } from '../models/formula.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from '../registrar-formulas-mezcla-laboratorio.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import * as moment from 'moment';

@Component({
  selector: 'app-registrar-formulas-mezcla-laboratorio-detail',
  templateUrl: './registrar-formulas-mezcla-laboratorio-detail.component.html'
})
export class FormulaMezclaLaboratorioDetailComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  formula: Formula;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<FormulaMezclaLaboratorioDetailComponent>,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: Formula
  ) {
    this.formula = data;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
