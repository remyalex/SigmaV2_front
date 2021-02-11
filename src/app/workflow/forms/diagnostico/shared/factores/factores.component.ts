import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { DiagnosticoFactorModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.factor.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

/** Componente encargado de gestionar la creación de los factores del diagnóstico */
@Component({
  selector: 'app-factores',
  templateUrl: './factores.component.html'
})
export class FactoresComponent implements OnInit {

  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** LIstado de factores presentados al usuario */
  factores: DiagnosticoFactorModel[];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<DiagnosticoFactorModel>;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  factor: DiagnosticoFactorModel = new DiagnosticoFactorModel();


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param data Información a procesar
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<FactoresComponent>,
    @Inject(MAT_DIALOG_DATA) data: { 'factores': DiagnosticoFactorModel[], 'datasource': MatTableDataSource<DiagnosticoFactorModel> },
    formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.factores = data.factores;
    this.dataSource = data.datasource;

    this.form = formBuilder.group({
      'tipoFactor': [null, Validators.compose([Validators.required, Validators.minLength(1)])],
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
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
    this.markAndValidateAllInputs(this.form);
      if (this.form.valid) {
        this.factores.push(this.factor);
        this.dataSource.data = this.factores;
        this.dialogRef.close();
      }
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
