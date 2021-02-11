import { Component, OnInit, Inject } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { MatSnackBar, MatDialogRef, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CuadrillaPersonalModel } from '../../models/cuadrilla-personal.model';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaGeneralModel } from '../../models/cuadrilla-general.model';
import { WorkflowMantenimientoModel } from '../../../../workflow/models/workflow-mantenimiento.model';

@Component({
  selector: 'app-personal-create',
  templateUrl: './personal-create.component.html'
})
export class PersonalCreateComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  mantenimiento: WorkflowMantenimientoModel;
  cuadrillaGeneral: CuadrillaGeneralModel;
  cuadrillaPersonalModel: CuadrillaPersonalModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  nombresApellidos: any;
  enviando = false;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PersonalCreateComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private dialog: MatDialog) {
    this.mantenimiento = data.mantenimiento;
    this.cuadrillaGeneral = data.cuadrillaGeneral;
    this.cuadrillaPersonalModel = new CuadrillaPersonalModel();
    this.form = this.formBuilder.group({
      numeroIdentificacion: [null],
      nombresApellidos: [null, Validators.compose([Validators.required])],
      horarioLlegada: [null, Validators.compose([Validators.required])],
      horarioSalida: [null, Validators.compose([Validators.required])],
      // tslint:disable-next-line: max-line-length
      porcentajeJornada: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('[0-9]*')])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.serviceCuadrillaGeneral.listenerSendStatus(this.constantsEstadoPeticion.iniciando);

    this.serviceCuadrillaGeneral.sendStatus$.subscribe((status) => {
      if (status && status === this.constantsEstadoPeticion.enviando) {
        this.enviando = true;
      } else {
        this.enviando = false;
      }

      if (status && status === this.constantsEstadoPeticion.ok) {
        this.close();
      }
    });

  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionPersonal(this.cuadrillaPersonalModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionPersonal(null);
    this.dialogRef.close(0);
  }

  itemSeleccionado(itemSelected) {
    if (itemSelected) {
      this.cuadrillaPersonalModel.persona = itemSelected;
      this.nombresApellidos = itemSelected.nombres + ' ' + itemSelected.apellidos;
    }
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.close();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true) {
      if (this.duplicateRecord()) {
        this.showMessageSnackBar(this.constants.duplicidadPersonalErrorMsj);
      } else {
        this.save();
      }
    } else {
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  duplicateRecord(): boolean {
    let response = false;
    let validate;
    let validateOther;

    // tslint:disable-next-line: max-line-length
    const jornada = this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0 ? this.mantenimiento.intervenciones[0].programacionesDiarias[0].jornada.descripcion : '';
    // tslint:disable-next-line: max-line-length
    const fechaInforme = this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0 ? this.mantenimiento.intervenciones[0].programacionesDiarias[0].fechaCreacion : '';

    // tslint:disable-next-line: forin
    for (const personal in this.cuadrillaGeneral.personal) {
      validate = '';
      validateOther = '';

      // tslint:disable-next-line: max-line-length
      validate = this.cuadrillaGeneral.mantenimiento.pk + '-' + fechaInforme + '-' + jornada + '-' + this.cuadrillaGeneral.personal[personal].persona.identificacion;
      // tslint:disable-next-line: max-line-length
      validateOther = this.mantenimiento.pk + '-' + fechaInforme + '-' + jornada + '-' + this.cuadrillaPersonalModel.persona.identificacion;

      if (validate === validateOther) {
        response = true;
      }
    }
    return response;
  }

  showMessageSnackBar(message: string) {
    this.snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['error-snackbar']
    }
    );
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",.<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.cuadrillaPersonalModel[attr] = newstr.trim();
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
