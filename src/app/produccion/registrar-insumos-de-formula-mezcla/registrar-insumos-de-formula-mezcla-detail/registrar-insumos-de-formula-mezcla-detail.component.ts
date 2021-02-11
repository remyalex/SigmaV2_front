import { ViewChild, Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CONST_PRODUCCION_INSUMOS_FORMULA_MEZCLA } from '../registrar-insumos-de-formula-mezcla.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulaMateriaPrima } from '../models/formula-materia-prima.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { RegistrarInsumosFormulaMezclaService } from '../services/registrar-insumos-de-formula-mezcla.service';
import { Formula } from '../../registrar-formulas-mezcla-laboratorio/models/formula.model';

@Component({
  selector: 'app-produccion-registro-insumo-formula-mezcla-detail',
  templateUrl: './registrar-insumos-de-formula-mezcla-detail.component.html'
})
export class RegistrarInsumoFormulaMezclaDetailComponent implements OnInit, AfterViewInit {

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
  columnasTablaMateriasPrimas = ['consecutivo', 'materiaPrima', 'valor', 'unidadMedida', 'masaUnitaria'];

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
    private dialogRef: MatDialogRef<RegistrarInsumoFormulaMezclaDetailComponent>,
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

}
