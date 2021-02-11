import { ViewChild, Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA } from '../registrar-insumos-de-formula-mezcla.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulaMateriaPrima } from '../models/formula-materia-prima.model';
import { RegistrarMateriasPrimasFormulaComponent } from '../registrar-materias-primas-formula/registrar-materias-primas-formula.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { RegistrarInsumosFormulaMezclaService } from '../services/registrar-insumos-de-formula-mezcla.service';
import { Formula } from '../../registrar-formulas-mezcla-laboratorio/models/formula.model';

@Component({
  selector: 'app-produccion-registro-insumo-formula-mezcla-edit',
  templateUrl: './registrar-insumos-de-formula-mezcla-edit.component.html'
})
export class RegistrarInsumoFormulaMezclaEditComponent implements OnInit, AfterViewInit {

  @Input() formula: Formula;
  @Output() atras = new EventEmitter();
  forumulaMateriaPrima: FormulaMateriaPrima;
  listaMateriasPrimas;
  formIsValid = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  eliminarMateriaPrima = false;

  // tabla
  columnasTablaMateriasPrimas = ['consecutivo', 'materiaPrima', 'valor', 'unidadMedida', 'masaUnitaria', 'acciones'];

  // forms
  formuarlioFormula: FormGroup;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private service: RegistrarInsumosFormulaMezclaService,
    private utilitiesServices: UtilitiesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RegistrarInsumoFormulaMezclaEditComponent>,
    private dialog: MatDialog
  ) {

    // Definición de formulario
    this.formuarlioFormula = this.formBuilder.group({
      'id': [{ value: null, disabled: true }],
      'tipoMezcla': [{ value: null, disabled: true }],
      'especificacion': [{ value: null, disabled: true }],
      'fechaInicial': [{ value: null, disabled: true }],
      'fechaFinal': [{ value: null, disabled: true }],
      'masaUnitaria': [{ value: null, disabled: true }],
    });

  }

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA;

  headers = [
    {
      consecutivo: this.constants.consecutivo,
      materiaPrima: this.constants.materiaPrima,
      valor: this.constants.valor,
      unidadMedida: this.constants.unidadMedida,
      masaUnitaria: this.constants.masaUnitaria,
    }
  ];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    if (this.formula === undefined) {
      this.formula = new Formula();
      this.formula.materiasPrimas = [];
    }

    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.listaMateriasPrimas = new MatTableDataSource(this.formula.materiasPrimas);
    this.listaMateriasPrimas.paginator = this.paginator;
    this.listaMateriasPrimas.sort = this.sort;
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
  }

  addFormulaMateriaPrima(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      formula: this.formula,
      datasource: this.listaMateriasPrimas,
      materiaPrima: new FormulaMateriaPrima()
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(RegistrarMateriasPrimasFormulaComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(() => {
      this.listaMateriasPrimas = new MatTableDataSource(this.formula.materiasPrimas);
      this.listaMateriasPrimas.paginator = this.paginator;
      this.listaMateriasPrimas.sort = this.sort;
    });
  }

  editarFormulaMateriaPrima(index: number, materiaPrima: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      formula: this.formula,
      //datasource: this.listaMateriasPrimas,
      materiaPrima: materiaPrima,
      indexEditar: index,
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(RegistrarMateriasPrimasFormulaComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(() => {
      this.listaMateriasPrimas = new MatTableDataSource(this.formula.materiasPrimas);
      this.listaMateriasPrimas.paginator = this.paginator;
      this.listaMateriasPrimas.sort = this.sort;
    });
  }

  removeFormulaMateriaPrima(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.constants.confirmar;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.forumulaMateriaPrima = this.formula.materiasPrimas[index];
        this.formula.materiasPrimas.splice(index, 1);
        this.eliminarMateriaPrima = true;
        this.validarConsecutivo();
        this.listaMateriasPrimas = new MatTableDataSource(this.formula.materiasPrimas);
        this.listaMateriasPrimas.paginator = this.paginator;
        this.listaMateriasPrimas.sort = this.sort;
      }
    });
  }

  validarConsecutivo() {
    // tslint:disable-next-line: prefer-const
    for (let materia of this.formula.materiasPrimas) {
      if (this.eliminarMateriaPrima && materia.consecutivo > this.forumulaMateriaPrima.consecutivo && materia.consecutivo > 1) {
        materia.consecutivo--;
      } else if (!this.eliminarMateriaPrima && materia.consecutivo >= this.forumulaMateriaPrima.consecutivo) {
        materia.consecutivo++;
      }
    }
    this.eliminarMateriaPrima = false;
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.formula.materiasPrimas === undefined || this.formula.materiasPrimas === null) {
      this.formula.materiasPrimas = [];
    }
    if (this.formula.materiasPrimas.length === 0) {
      this.disableSubmit = false;
      this.snackBar.open('Por favor agregue las materias primas', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    } else {
      this.service.create(this.formula).subscribe(
        data => {
          this.formula = data;
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.disableSubmit = false;
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesServices.formErrorMessages(error, this.formuarlioFormula, this.snackBar);
        }
      );
    }
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.listaMateriasPrimas = new MatTableDataSource(this.formula.materiasPrimas);
    this.listaMateriasPrimas.paginator = this.paginator;
    this.listaMateriasPrimas.sort = this.sort;
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.atras.emit();
        }
      }
    );
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

}
