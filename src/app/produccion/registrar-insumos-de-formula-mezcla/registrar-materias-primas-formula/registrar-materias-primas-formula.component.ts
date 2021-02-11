import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { FormulaMateriaPrima } from '../models/formula-materia-prima.model';
import { CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA } from './../registrar-insumos-de-formula-mezcla.constant';
import { Formula } from '../../registrar-formulas-mezcla-laboratorio/models/formula.model';

@Component({
  selector: 'app-registrar-materias-primas-formula',
  templateUrl: './registrar-materias-primas-formula.component.html'
})
export class RegistrarMateriasPrimasFormulaComponent implements OnInit {

  formuarlioFormulaMateriaPrima: FormGroup;
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<FormulaMateriaPrima>;
  formula: Formula;
  materiaPrima: FormulaMateriaPrima = new FormulaMateriaPrima();
  indexEditar = -1;
  formBuilder: FormBuilder;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<RegistrarMateriasPrimasFormulaComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'datasource': MatTableDataSource<FormulaMateriaPrima>,
      'formula': Formula,
      'materiaPrima': FormulaMateriaPrima,
      'indexEditar': number
    },
    _formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.dataSource = data.datasource;
    this.formBuilder = _formBuilder;
    this.formula = data.formula;
    this.materiaPrima = data.materiaPrima;
    this.indexEditar = data.indexEditar;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.formuarlioFormulaMateriaPrima = this.formBuilder.group({
      id: [null],
      consecutivo: [null],
      materiaPrima: [null, Validators.compose([Validators.required])],
      masaUnitaria: [null, Validators.compose([Validators.required])],
      valor: [null, Validators.compose(
        [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[+-]?[0-9]{1,12}(?:.[0-9]{1,2})?$')])],
      unidadMedida: [null, Validators.compose([Validators.required])],
    });
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
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.markAndValidateAllInputs(this.formuarlioFormulaMateriaPrima);
    if (this.formuarlioFormulaMateriaPrima.valid) {
      if (this.formula.materiasPrimas === null || this.formula.materiasPrimas === undefined) {
        this.formula.materiasPrimas = [];
      }

      if (this.materiaPrima.consecutivo === undefined || this.materiaPrima.consecutivo === null || this.materiaPrima.consecutivo === 0) {
        if (this.formula.materiasPrimas.length > 0) {
          this.materiaPrima.consecutivo = this.arrayMax(this.formula.materiasPrimas).consecutivo + 1;
        } else {
          this.materiaPrima.consecutivo = 1;
        }
      }

      if (this.indexEditar > -1 ) {
        for (let mPs of this.formula.materiasPrimas) {
          if (mPs.consecutivo == this.materiaPrima.consecutivo) {
            mPs = this.materiaPrima;
            break;
          }
        }
      } else {
        this.formula.materiasPrimas.push(this.materiaPrima);
      }
      this.dataSource = new MatTableDataSource(this.formula.materiasPrimas);
      this.dialogRef.close();
    }
  }

  arrayMax(arr: FormulaMateriaPrima[]) {
    return arr.reduce(function (p, v) {
      return (p.consecutivo > v.consecutivo ? p : v);
    });
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
}
