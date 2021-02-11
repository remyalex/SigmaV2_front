import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DiagnosticoUnidadMuestraModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.unidadMuestreo.model';
import { NumberValidator, MaxValue, MaxDecimalValue } from 'src/app/shared/form/number.validator';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de gestionar la edición de las unidades de muestreo del diagnóstico */
@Component({
  selector: 'app-muestreosEdit',
  templateUrl: './muestreosEdit.component.html'
})
export class MuestreosEditComponent implements OnInit {

  form: FormGroup;
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Objeto del mantenimiento que se procesará en el componente */
  mantenimiento: WorkflowMantenimientoModel;
  /** Objeto anterior del mantenimiento que se procesará en el componente */
  muestreosPrevios: DiagnosticoUnidadMuestraModel[];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<DiagnosticoUnidadMuestraModel>;
  /** LIstado de las unidades de meustreo presentados al usuario */
  unidadMuestreo: DiagnosticoUnidadMuestraModel = new DiagnosticoUnidadMuestraModel();
  /** Bandera que permite saber si el campo número de
   * losas se encuentra visible en el formulario */
  visibilidadNumeroLosas: Boolean = false;
  /** Indice del elemento de la lista de muestras que se va a editar */
  index: number;
  /** Máximo valor de losas permitidos */
  maximo = '30';

  anchoPkDecimales: number;
  longitudPkDecimales: number;
  areaPKDecimales: number;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param data Información a procesar
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<MuestreosEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel,
      'datasource': MatTableDataSource<DiagnosticoUnidadMuestraModel>,
      'muestreo': DiagnosticoUnidadMuestraModel,
      'index': number,
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.mantenimiento = data.mantenimiento;
    this.dataSource = data.datasource;
    this.muestreosPrevios = JSON.parse(JSON.stringify(this.mantenimiento.diagnostico.muestreos));
    this.unidadMuestreo = data.muestreo;
    this.index = data.index;

    if (this.mantenimiento.tipoSuperficie != null &&
      typeof this.mantenimiento.tipoSuperficie.descripcion != 'undefined' &&
      this.mantenimiento.tipoSuperficie.descripcion == 'RÍGIDO') {
      this.visibilidadNumeroLosas = true;
    }

    this.form = formBuilder.group({
      'anchoPK': [{ value: null, disabled: true }],
      'longitudPk': [{ value: null, disabled: true }],
      'areaPK': [{ value: null, disabled: true }],

      'abscisaInicial': [null, Validators.compose([Validators.min(0), MaxDecimalValue(10, 2), Validators.required])],
      'abscisaFinal': [null, Validators.compose([Validators.min(0.01), MaxDecimalValue(10, 2), Validators.required])],
      'anchoMuestreo': [null, Validators.compose([Validators.required, Validators.min(0.01), MaxDecimalValue(10, 2)])],
      'areaMuestreo': [{ value: null, readonly: true }, Validators.compose([Validators.required, Validators.min(0.01),
      Validators.max(99999999999999999)])],

      'consecutivo': [null],
      'numeroLosas': [null, Validators.compose([Validators.required, Validators.min(0.01), Validators.max(99999999999999999)])],
    }, { validator: NumberValidator.abscisaMaxima });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    if (this.mantenimiento.tipoSuperficie != null &&
      typeof this.mantenimiento.tipoSuperficie.descripcion != 'undefined') {

      if (this.mantenimiento.tipoSuperficie.descripcion == 'RÍGIDO') {
        this.form.get('numeroLosas').validator = <any>Validators.compose([Validators.max(28), Validators.min(0.01), Validators.required]);
      } else {
        this.form.get('numeroLosas').validator = <any>Validators.compose([null]);
      }

      let sumaAreaas = 0;
      this.form.get('areaMuestreo').validator = <any>Validators.compose([null]);

      if (typeof this.mantenimiento != 'undefined') {
        if (this.mantenimiento.diagnostico.muestreos.length > 0) {
          sumaAreaas = this.mantenimiento.diagnostico.muestreos.map(o => o.area).reduce((a, c) => a + c);
        }
        sumaAreaas = parseFloat((this.mantenimiento.area - sumaAreaas + this.unidadMuestreo.area).toFixed(4));
      }

      if (this.mantenimiento.tipoSuperficie.descripcion == 'ADOQUÍN ARCILLA' ||
        this.mantenimiento.tipoSuperficie.descripcion == 'ADOQUÍN CONCRETO') {
        this.maximo = '100';
        this.form.get('areaMuestreo').validator =
          <any>Validators.compose([Validators.max(sumaAreaas), MaxValue(100), Validators.min(0.01)]);
      } else if (this.mantenimiento.tipoSuperficie.descripcion === 'FLEXIBLE' && (sumaAreaas == 0 || sumaAreaas > 323)) {
        this.maximo = '323';
        this.form.get('areaMuestreo').validator =
          <any>Validators.compose([Validators.max(sumaAreaas), MaxValue(323), Validators.min(0.01)]);
      } else {
        this.form.get('areaMuestreo').validator = <any>Validators.compose([Validators.max(sumaAreaas), Validators.min(0.01)]);
      }
    }

    this.anchoPkDecimales = parseFloat(parseFloat(this.mantenimiento.ancho + '').toFixed(2));
    this.longitudPkDecimales = parseFloat(parseFloat(this.mantenimiento.longitud + '').toFixed(2));
    this.areaPKDecimales = parseFloat(parseFloat(this.mantenimiento.area + '').toFixed(2));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dataSource.data = this.muestreosPrevios;
        this.mantenimiento.diagnostico.muestreos = this.muestreosPrevios;
        this.dialogRef.close();
      }
    });
  }


  /** Método encargado de realizar el cálculo del valor del area de la unidad de muestreo */
  calcularAreaMuestreo() {
    this.unidadMuestreo.area =
      (typeof this.unidadMuestreo.ancho == 'undefined' ? 0 : this.unidadMuestreo.ancho) * (
        (typeof this.unidadMuestreo.abscisaFinal == 'undefined' ? 0 : this.unidadMuestreo.abscisaFinal) -
        (typeof this.unidadMuestreo.abscisaInicial == 'undefined' ? 0 : this.unidadMuestreo.abscisaInicial));

    if (typeof this.unidadMuestreo.area !== 'undefined' && this.unidadMuestreo.area != null) {
      this.unidadMuestreo.area = parseFloat(parseFloat(this.unidadMuestreo.area + '').toFixed(2));
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento al servicio*/
  guardar() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '40%';
      dialogConfig.data = {
        mensaje: 'La actualización de datos implica eliminar los registros asociados a las fallas. ¿Desea continuar?',
        titulo: 'Confirmar acción'
      };
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          if (this.index < this.mantenimiento.diagnostico.muestreos.length) {
            const muestra = this.mantenimiento.diagnostico.muestreos[this.index];
            let fallasTemp = new Array<any>();
            if (muestra.id === this.unidadMuestreo.id) {
              muestra.registrosDependientes = false;
              this.mantenimiento.diagnostico.muestreos[this.index] = this.unidadMuestreo;
              if (this.mantenimiento.diagnostico.fallas != null) {
                for (let indexfallas = 0; indexfallas < this.mantenimiento.diagnostico.fallas.length; indexfallas++) {
                  if (this.mantenimiento.diagnostico.fallas[indexfallas].unidadMuestreo != null &&
                    this.mantenimiento.diagnostico.fallas[indexfallas].unidadMuestreo.id !== this.unidadMuestreo.id) {
                    fallasTemp.push(this.mantenimiento.diagnostico.fallas[indexfallas]);
                  }
                }
                this.mantenimiento.diagnostico.fallas = fallasTemp;
              }
            }
          }
          this.dataSource.data = this.mantenimiento.diagnostico.muestreos;
          this.dialogRef.close(this.mantenimiento.diagnostico);
        }
      });

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
