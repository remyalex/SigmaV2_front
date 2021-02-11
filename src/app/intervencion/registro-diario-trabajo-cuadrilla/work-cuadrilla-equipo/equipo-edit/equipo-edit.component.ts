import { Component, OnInit, Inject } from '@angular/core';
import { CONST_REGISTRO_DIARIO_CUADRILLA } from '../../registro-diario-trabajo-cuadrilla.constant';
import { CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION } from '../../registro-diario-trabajo-cuadrilla.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { CuadrillaGeneralService } from '../../services/cuadrilla-general.service';
import { CuadrillaArchivoModel } from '../../models/cuadrilla-archivo.model';
import { UtilitiesService } from '../../../../shared/services/utilities.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CuadrillaEquipoModel } from '../../models/cuadrilla-equipo.model';
import { Equipo } from '../../../../produccion/estado-maquinaria-propio/models/estado-maquinaria-propio.model';
import { WorkflowMantenimientoModel } from '../../../../workflow/models/workflow-mantenimiento.model';
import { SigmaConfirmComponent } from '../../../../shared/sigma-confirm/sigma-confirm.component';
import { CuadrillaEquipoArchivoModel } from '../../models/cuadrilla-equipo-archivo.model';

@Component({
  selector: 'app-equipo-edit',
  templateUrl: './equipo-edit.component.html'
})
export class EquipoEditComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRO_DIARIO_CUADRILLA;
  constantsEstadoPeticion = CONST_REGISTRO_DIARIO_CUADRILLA_ESTADO_PETICION;
  mantenimiento: WorkflowMantenimientoModel;
  CuadrillaEquipoModel: CuadrillaEquipoModel = new CuadrillaEquipoModel();
  clone: CuadrillaEquipoModel;
  cuadrillaArchivoModel: CuadrillaArchivoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  loader = false;
  placa: any;
  equipos: Equipo;
  archivosMaterial: any = [];
  enviando = false;
  archivosSeccion: any = [];

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) data: any, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<EquipoEditComponent>, private serviceCuadrillaGeneral: CuadrillaGeneralService, private utilitiesServices: UtilitiesService, private commonService: CommonService, private dialog: MatDialog) {
    this.mantenimiento = data.mantenimiento;
    this.CuadrillaEquipoModel = JSON.parse(JSON.stringify(data.equipo));
    this.form = this.formBuilder.group({
      movil: [null, Validators.compose([Validators.maxLength(10)])],
      origen: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      unidad: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      horometroInicial: [null, Validators.compose([Validators.maxLength(6)])],
      horometroFinal: [null, Validators.compose([Validators.maxLength(6)])],
      horasTrabajadas: [null, Validators.compose([Validators.maxLength(7)])],
      standBy: [null, Validators.compose([Validators.min(0), Validators.max(9)])],
      noVale: [null],
      numeroViaje: [null, Validators.compose([Validators.min(0), Validators.max(99)])],
      dia: [null, Validators.compose([Validators.min(0), Validators.max(1)])],
      tipoMaquinaria: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      archivo: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.CuadrillaEquipoModel));
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

    this.data();
    this.validation();
    this.extractArchivosBySolicitud();
  }

  data() {
    this.equipos = null;
    this.fieldDisabled();
    this.serviceCuadrillaGeneral.equipoList().subscribe(data => {
      this.equipos = data.filter(dato => dato.movil !== null);
    });
  }

  fieldDisabled() {
    this.form.get('horometroInicial').disable();
    this.form.get('horometroFinal').disable();
    this.form.get('horasTrabajadas').disable();
    this.form.get('standBy').disable();
    this.form.get('noVale').disable();
    this.form.get('numeroViaje').disable();
    this.form.get('dia').disable();
  }

  validation() {
    if (this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0) {
      // this.CuadrillaEquipoModel.movil = this.mantenimiento.intervenciones[0].programacionesDiarias[0].maquinaria[0].equipo;
    }
  }

  changeMovil(event) {
    if (event) {
      this.CuadrillaEquipoModel.tipoMaquinaria = (event.equipoTipo) ? event.equipoTipo.descripcion : '';
      this.CuadrillaEquipoModel.origen = (event.origenEquipo) ? event.origenEquipo.descripcion : '';
    }
  }

  changeUnidad(event) {
    this.fieldDisabled();
    if (event) {
      // tslint:disable-next-line: triple-equals
      if (event.descripcion == 'Día') {
        this.form.get('dia').enable();
        this.form.get('noVale').enable();
      }
      // tslint:disable-next-line: triple-equals
      if (event.descripcion == 'Viaje') {
        this.form.get('numeroViaje').enable();
        this.form.get('noVale').enable();
      }
      // tslint:disable-next-line: triple-equals
      if (event.descripcion == 'Hora') {
        this.form.get('horometroInicial').enable();
        this.form.get('horometroFinal').enable();
        this.form.get('horasTrabajadas').enable();
        this.form.get('standBy').enable();
        this.form.get('noVale').enable();
      }
    }
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.serviceCuadrillaGeneral.listenerActionEquipo(this.CuadrillaEquipoModel);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.serviceCuadrillaGeneral.listenerActionEquipo(null);
    this.dialogRef.close(0);
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
        this.CuadrillaEquipoModel = this.clone;
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
      this.save();
    } else {
      this.enviada = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  extractArchivosBySolicitud() {
    if (this.CuadrillaEquipoModel.equipoArchivos) {
      this.archivosSeccion = [];
      for (const sArchivo of this.CuadrillaEquipoModel.equipoArchivos) {
        this.archivosSeccion.push(sArchivo.archivo);
      }
    }
  }

  setArchivoSolicitud(event: any) {
    let eventObject;
    if (event && event.length > 0) {
      this.runFiles(event);
    } else if (event) {
      eventObject = '[' + JSON.stringify(event) + ']';
      eventObject = JSON.parse(eventObject);
      this.runFiles(eventObject);
    }

    if (event === '') {
      this.archivosSeccion = [];
      this.CuadrillaEquipoModel.equipoArchivos = [];
    }
  }

  runFiles(event: any) {
    for (const archivo of event) {
      if (archivo.id) {
        let existe = false;
        for (const solicitudArchivo of this.CuadrillaEquipoModel.equipoArchivos) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const seccionArchivo = new CuadrillaEquipoArchivoModel();
          seccionArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          seccionArchivo.archivo = archivo;
          this.CuadrillaEquipoModel.equipoArchivos.push(seccionArchivo);
        }
      }
    }
  }

  patternString(attr, data) {
    const re = /[a-zA-z`~!@#$%^&*()_°¬|+\-=?¡¿;:'",<>\{\}\[\]\\\/]/gi;
    const newstr = data.target.value.replace(re, '');
    this.CuadrillaEquipoModel[attr] = newstr.trim();
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
