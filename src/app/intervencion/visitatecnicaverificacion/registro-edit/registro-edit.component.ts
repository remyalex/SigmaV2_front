import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { IntervencionFalla } from '../../models/intervencion-falla';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, MaxLengthValidator } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { SigmaConfirmComponent } from '../../../shared/sigma-confirm/sigma-confirm.component';
import { DiagnosticoFallaModel } from '../../../mejoramiento/diagnostico/models/diagnostico.falla.model';
import { VisitaVerificacionService } from '../services/visitaVerificacion.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MaxDecimalValue } from 'src/app/shared/form/number.validator';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SigmaFormSelectComponent } from '../../../shared/component/sigma-form-select/sigma-form-select.component';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter, catchError } from 'rxjs/operators';
import { Intervencion } from '../../models/intervencionModel.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-registro-edit',
  templateUrl: './registro-edit.component.html'
})
export class RegistroEditComponent implements OnInit {

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
  intervencionFalla: IntervencionFalla;
  intervencionFallas: IntervencionFalla[];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<IntervencionFalla>;
  mantenimiento = new WorkflowMantenimientoModel();
  public path_tipo_falla: string;
  public path_tipo_intervencion: string;
  /** Bandera que permite controlar si se presentará o
   * no el tipo de intervención en el encabezado */
  public presentarTipoIntervencion = true;
  public presentarTipoFalla = true;
  ingresa: boolean;

  @ViewChild('selectFallas',) selectFallas: SigmaFormSelectComponent;
  @ViewChild('selectTipoIntervencion') selectTipoIntervencion: SigmaFormSelectComponent;
  public optionsFallas = [];
  public optionsIntervencion = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      'falla': IntervencionFalla,
      'datasource': MatTableDataSource<IntervencionFalla>,
      'ingresa': boolean,
      'mantenimiento' : WorkflowMantenimientoModel
    },
    private servicio: VisitaVerificacionService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<RegistroEditComponent>,
    private servicioGeneral: DataGenericService,
  ) {
    this.intervencionFalla = new IntervencionFalla();
    this.intervencionFalla = data.falla;
    this.dataSource = data.datasource;
    this.ingresa = data.ingresa;
    this.mantenimiento = data.mantenimiento;

    this.path_tipo_falla = this.constants
      .path_workflow_diagnostico_fallas_tipo_falla.replace('{tipoSuperficieId}',
        this.intervencionFalla.tipoSuperficie.id.toString()
    );

    this.path_tipo_intervencion = this.constants
      .path_all_tipoIntervencion.replace(
        '{tipoSuperficieId}',this.intervencionFalla.tipoSuperficie.id + '');


    this.form = this.formBuilder.group({
      numero: [null, Validators.compose([Validators.required])],
      distancia: [null, Validators.compose([Validators.required, Validators.max(99999)])],
      longitud: [null, Validators.compose([Validators.required,
        Validators.min(0.01), MaxDecimalValue(14, 2)])
      ],
      ancho: [null, Validators.compose([
        Validators.required,
        Validators.min(0.01), MaxDecimalValue(14, 2)
      ])],
      areaFalla: [{value: null, disabled: true}, Validators.compose([Validators.required]),
        Validators.min(0.01), MaxDecimalValue(14, 2)
      ],
      espesor: [null, Validators.compose([Validators.required, this.maxValue(1),
        Validators.min(0.01), MaxDecimalValue(1, 2)
      ])],
      volumen: [{value: null, disabled: true}, Validators.compose([Validators.required])],
      tipoFalla: [null, Validators.compose([Validators.required])],
      tipoSuperficie: [null, Validators.compose([Validators.required])],
      tipoIntervencion: [null, Validators.compose([Validators.required])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {}

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.intervencionFalla.ancho = Number(this.intervencionFalla.ancho);
    this.intervencionFalla.distancia = Number(this.intervencionFalla.distancia);
    this.intervencionFalla.espesor = Number(this.intervencionFalla.espesor);
    this.intervencionFalla.longitud = Number(this.intervencionFalla.longitud);
    this.intervencionFalla.areaFalla = Number(this.intervencionFalla.areaFalla);
    this.intervencionFalla.volumen = Number(this.intervencionFalla.volumen);
    if(this.optionsFallas.length == 0){
      this.intervencionFalla.tipoFalla = null;
    }
    if(this.optionsIntervencion.length == 0){
      this.intervencionFalla.tipoIntervencion = null;
    }
    this.servicio.listenerAction(this.intervencionFalla);
    this.dialogRef.close({code: 1, falla: this.intervencionFalla});
  }

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

  public calcularTodo() {
    this.calcularAreaFalla();
    this.calcularVolumen();
  }

  public calcularAreaFalla() {
    if (typeof this.intervencionFalla.longitud !== undefined && this.intervencionFalla.ancho !== undefined) {
      const result = this.intervencionFalla.longitud * this.intervencionFalla.ancho;
      this.intervencionFalla.areaFalla =  Math.round(result * 100) / 100;
    }
  }

  public calcularVolumen() {
    if (typeof this.intervencionFalla.areaFalla !== undefined && this.intervencionFalla.espesor !== undefined) {
      this.onChangeEspesor();
      const result = this.intervencionFalla.areaFalla * this.intervencionFalla.espesor;
      this.intervencionFalla.volumen = Math.round(result * 100) / 100;
    }
  }

  public onChangeEspesor() {
    if (this.isNumeric(this.intervencionFalla.espesor)) {
      this.intervencionFalla.espesor = Math.round(Number(this.intervencionFalla.espesor) * 100) / 100;
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
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
          this.dialogRef.close({code: 0});
        }
      }
    );
  }

  maxValue(max: Number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value, isValid = input > max;
      if (isValid) {
          return { 'maxValue': {max} };
      } else {
          return null;
      }
    };
  }

  /** Método encargado de gestionar la acción de cambio de tipo de superficie en el formulario */
  cambioTipoSuperficie(tipoSuperficie: ListaItem) {
    this.presentarTipoFalla = false;
    this.presentarTipoIntervencion = false;
    if (tipoSuperficie && typeof tipoSuperficie !== 'undefined' && typeof tipoSuperficie.id !== 'undefined') {
      this.intervencionFalla.tipoSuperficie = tipoSuperficie;

      if(this.ingresa){
        this.ingresa = false;
      }else{
        this.intervencionFalla.tipoFalla = null;
        this.intervencionFalla.tipoIntervencion = null;  
      }
      
      this.path_tipo_intervencion = this.constants
        .path_all_tipoIntervencion.replace(
          '{tipoSuperficieId}', this.intervencionFalla.tipoSuperficie.id + ''
        );
    
      this.path_tipo_falla = this.constants
      .path_workflow_diagnostico_fallas_tipo_falla.replace('{tipoSuperficieId}',
        this.intervencionFalla.tipoSuperficie.id.toString()
      );

      this.servicioGeneral.NoCacheList(this.path_tipo_falla);

      this.servicioGeneral.listQuery$
        .pipe(
          filter((data: any) => (data.path === this.path_tipo_falla))
        )
        .subscribe((data: any) => {
          this.optionsFallas = data.content;
          if(this.optionsFallas.length == 0){
            this.form.controls['tipoFalla'].clearValidators();
          }else{
            this.form.controls['tipoFalla'].setValidators([Validators.required]);
          }
          this.presentarTipoFalla = true;

        }, error => {
          this.optionsFallas = [];
          this.form.controls['tipoFalla'].clearValidators();
          this.presentarTipoFalla = true;
        });

        this.servicioGeneral.NoCacheList(this.path_tipo_intervencion);

        this.servicioGeneral.listQuery$
          .pipe(
            filter((data: any) => (data.path === this.path_tipo_intervencion))
          )
          .subscribe((data: any) => {
            this.optionsIntervencion = data.content;
            if(this.optionsIntervencion.length == 0){
              this.form.controls['tipoIntervencion'].clearValidators();
            }else{
              this.form.controls['tipoIntervencion'].setValidators([Validators.required]);
            }
            this.presentarTipoIntervencion = true;
  
          }, error => {
            this.optionsIntervencion = [];
            this.form.controls['tipoIntervencion'].clearValidators();
            this.presentarTipoIntervencion = true;
          });
  
      }

/*
    setTimeout(() => {
      this.presentarTipoIntervencion = true;
    }, 200);
    */
  }


}
