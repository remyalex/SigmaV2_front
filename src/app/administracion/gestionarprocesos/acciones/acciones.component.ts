import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionarprocesosService } from '../services/gestionarprocesos.service';
import { Proceso } from '../../proceso/models/proceso.model';
import { SigmaFormSelectComponent } from 'src/app/shared/component/sigma-form-select/sigma-form-select.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de gestionar las acciones de gestion de procesos de los pks*/
@Component({
  selector: 'acciones-gestionarprocesos',
  templateUrl: './acciones.component.html'
})
export class AccionesComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
  /** Mensaje de confirmación al usuario */
  dataConfirm = '';
  /** Formulario para procesamiento de Reasignación del usuario al mantenimiento*/
  formularioReasignarUsuario: FormGroup;
  /** Formulario para procesamiento de Reasignación de la actividad al mantenimiento */
  formularioReasignarActividad: FormGroup;
  /** Formulario para procesamiento de devolver la actividad al mantenimiento */
  formularioDevolverGestion: FormGroup;
  /** Formulario para procesamiento de termianr la gestión del mantenimiento */
  formularioTerminarGestion: FormGroup;
  /** Formulario para procesamiento anular la gestión del mantenimiento */
  formularioAnularGestion: FormGroup;
  /** Listado de estados del pk para los mantenimientos */
  listaEstadoPk: Array<ListaItem>;
  /** Mantenimiento a procesar por el componente */
  mantenimiento: WorkflowMantenimientoModel;
  /** Objeto con la actividad actual que posee el mantenimiento */
  actividadActualObject: WorkflowActividadModel;
  /** Nombre de usuario actual que posee el mantenimiento */
  usuarioActual: String;
  /** Nombre de la actividad actual que tiene el mantenimiento */
  actividadActual: String;
  /** Nombre del estado actual que tiene el mantenimiento */
  estadoPkActual: String;
  /** Nombre de la anterior actividad por la que paso el mantenimiento */
  actividadAnterior = '';
  /** Nombre del usuario que realizó la anterior actividad */
  usuarioAnterior = '';
  /** Ruta a la cual se dirigira la acción del usuario al presionar reasignar usuario */
  path_reasignarusuarios = '';
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Variable de mantenimiento que ingresa al componente */
  @Input() mant: WorkflowMantenimientoModel;
  /** Formulario con la selección del usuario que se reasignará */
  @ViewChild('ReasignarSelectActividad') reasignarsigmaFormSelect: SigmaFormSelectComponent;
  /** Formulario para terminar el procesamiento del mantenimiento actual */
  @ViewChild('TerminarSelectActividad') terminarsigmaFormSelect: SigmaFormSelectComponent;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param router Componente usado para redireccionar entre componentes
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @package genericServices Servicios genericos para procesamiento de datos
   */
  constructor(
    private formBuilder: FormBuilder,
    private servicio: GestionarprocesosService,
    private dialogRef: MatDialogRef<AccionesComponent>,
    private router: Router,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService,
    private dialog: MatDialog,
    private genericServices: DataGenericService
  ) {
    this.formularioReasignarUsuario = this.formBuilder.group({
      'usuarioActual': [{ value: null, disabled: true }],
      'usuarioNuevo': [null, Validators.compose([Validators.required])],
      'observaciones': [null, Validators.compose([Validators.required])]
    });
    this.formularioReasignarActividad = this.formBuilder.group({
      'actividadActual': [{ value: null, disabled: true }],
      'proceso': [null, Validators.compose([Validators.required])],
      'actividadNuevo': [null, Validators.compose([Validators.required])],
      'estadoPkActual': [{ value: null, disabled: true }],
      'estadoPkNuevo': [null, Validators.compose([Validators.required])],
      'observaciones': [null, Validators.compose([Validators.required])]
    });
    this.formularioDevolverGestion = this.formBuilder.group({
      'actividadActual': [{ value: null, disabled: true }],
      // 'proceso': [null, Validators.compose([Validators.required])],
      'actividadAnterior': [{ value: null, disabled: true }],
      'usuarioActual': [{ value: null, disabled: true }],
      'usuarioAnterior': [{ value: null, disabled: true }],
      'estadoPkActual': [{ value: null, disabled: true }],
      'estadoPkNuevo': [null, Validators.compose([Validators.required])],
      'observaciones': [null, Validators.compose([Validators.required])]
    });
    this.formularioTerminarGestion = this.formBuilder.group({
      'actividadActual': [{ value: null, disabled: true }],
      'proceso': [{ value: null, disabled: true }],
      'actividadFin': [{ value: null, disabled: true }],
      'estadoPkActual': [{ value: null, disabled: true }],
      'estadoPkNuevo': [null, Validators.compose([Validators.required])],
      'observaciones': [null, Validators.compose([Validators.required])]
    });
    this.formularioAnularGestion = this.formBuilder.group({
      'actividadActual': [{ value: null, disabled: true }],
      'usuarioActual': [{ value: null, disabled: true }],
      'observaciones': [null, Validators.compose([Validators.required])]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.genericServices.list(this.constants.path_administracion_gestionarprocesos_reasignarestadopk).subscribe(
      (listEstadoPk: any) => {
        this.listaEstadoPk = this.utilitiesServices.orderArray(listEstadoPk, 'descripcion');
      }
    );
    this.mantenimiento = this.mant;
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
    this.actividadActualObject = this.mantenimiento.actividadActual;
    this.usuarioActual = this.mantenimiento.responsable ? this.mantenimiento.responsable.nombres : 'No tiene asignado';
    this.actividadActual = this.mantenimiento.actividadActual ? this.mantenimiento.actividadActual.nombre : '';
    this.estadoPkActual = this.mantenimiento.estadoMantenimiento ? this.mantenimiento.estadoMantenimiento.descripcion : '';

    this.path_reasignarusuarios =
      this.constants.path_administracion_gestionarprocesos_reasignarusuarios + '/actividad/' + this.actividadActualObject.id;

    this.servicio.listRecords(this.mant.id).subscribe(
      (records: any) => {
        //records = records.filter(rec => rec.estadoGestion !== null);
        console.log(records);
        const mantArrayActivity = [];
        if (records.length <= 0) {
          this.actividadAnterior = 'No existe actividad anterior';
          this.usuarioAnterior = 'No tenia asignado';
        }
        else {
          const mantActivitiesFirstFilter = records.length > 0 ? records.filter(record =>
            /*record.estadoGestion.id === 80842 &&*/ record.actividad.id !== this.actividadActualObject.id
          ) : [];
          mantActivitiesFirstFilter.forEach(mantActivity => {
            mantArrayActivity.push(mantActivity.id);
          });
          const idLastActivity = mantArrayActivity.length > 0 ? Math.max.apply(null, mantArrayActivity) : null;
          const lastActivity = mantActivitiesFirstFilter.length > 0 ? mantActivitiesFirstFilter.filter(
            lastOneManActivity => lastOneManActivity.id === idLastActivity
          ) : [];
          this.actividadAnterior = lastActivity.length > 0 ? lastActivity[0].actividad.nombre : 'No existe actividad anterior';
          this.usuarioAnterior = lastActivity.length > 0 ? lastActivity[0].usuarioAsignado.nombres + ' ' +
            lastActivity[0].usuarioAsignado.apellidos : 'No tenia asignado';
        }
      },
      error => {
        this.actividadAnterior = 'No existe actividad anterior';
        this.usuarioAnterior = 'No tenia asignado';
      }
    );

    this.formularioReasignarActividad.get('proceso').valueChanges.subscribe(
      procesoSelected => {
        if (procesoSelected && this.formularioReasignarActividad.valid === false) {
          this.procesoSelectedToFinalActivity(procesoSelected.id, 'Reasignar');
        }
      }
    );
    this.formularioTerminarGestion.get('proceso').valueChanges.subscribe(
      procesoSelected => {
        if (procesoSelected && this.formularioReasignarActividad.valid === false) {
          this.procesoSelectedToFinalActivity(procesoSelected.id, 'Terminar');
        }
      }
    );
  }

  /** Método encargado de redireccionar la acción del usuario a reasignar o terminar mantenimiento */
  procesoSelectedToFinalActivity(idProceso, action) {
    this.mantenimiento.actividadActual = null;
    const urlListActivitiesByProcesoSelected = this.constants.path_administracion_gestionarprocesos_actividadfinallist + idProceso;
    this.servicio.listActivities(urlListActivitiesByProcesoSelected).subscribe(
      (listActivitiesByProcess: Proceso) => {
        switch (action) {
          case 'Reasignar':
            // tslint:disable-next-line: max-line-length
            this.reasignarsigmaFormSelect.getListFromOtherSite(this.utilitiesServices.orderArray(listActivitiesByProcess.actividades, 'nombre'));
            break;
          case 'Terminar':
            // tslint:disable-next-line: max-line-length
            this.terminarsigmaFormSelect.getListFromOtherSite(this.utilitiesServices.orderArray(listActivitiesByProcess.actividades, 'nombre'));
            break;
        }
      }
    );
  }

  /** Método encargado de actualizar el estado del pk en el formulario */
  setEstadoPk(estados) {
    this.mantenimiento.estadoPk = estados;
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

  /** Método encargado de confirmar la reasignación del usuario */
  reasignarUsuario() {
    this.mantenimiento.observaciones = this.formularioReasignarUsuario.get('observaciones').value;
    this.mantenimiento.actividadActual = this.actividadActualObject;
    this.markAndValidateAllInputs(this.formularioReasignarUsuario);
    if (this.formularioReasignarUsuario.valid) {
      this.dataConfirm = '¿Desea reasignar el usuario?';
      this.confirmChange('reasignarUsuario');
    }
  }

  /** Método encargado de confirmar la reasignación de la actividad */
  reasignarActividad() {
    this.mantenimiento.observaciones = this.formularioReasignarActividad.get('observaciones').value;
    const actividadSel = this.mantenimiento.actividadActual;
    this.markAndValidateAllInputs(this.formularioReasignarActividad);
    if (this.formularioReasignarActividad.valid) {
      this.dataConfirm = '¿Desea reasignar la actividad?';
      this.confirmChange('reasignarActividad');
    }
    this.mantenimiento.actividadActual = actividadSel;
  }

  /** Método encargado de confirmar la devolución del mantenimiento a una actividad */
  devolverGestion() {
    this.mantenimiento.observaciones = this.formularioDevolverGestion.get('observaciones').value;
    this.mantenimiento.actividadActual = this.actividadActualObject;
    this.markAndValidateAllInputs(this.formularioDevolverGestion);
    if (this.formularioDevolverGestion.valid) {
      this.dataConfirm = '¿Desea regresar a la actividad anterior?';
      this.confirmChange('devolverGestion');
    }
  }

  /** Método encargado de confirmar la solicitud de terminación del mantenimiento por el usuario */
  terminarGestion() {
    this.mantenimiento.observaciones = this.formularioTerminarGestion.get('observaciones').value;
    //this.mantenimiento.actividadActual = this.actividadActualObject;
    const actividadSel = this.mantenimiento.actividadActual;
    this.markAndValidateAllInputs(this.formularioTerminarGestion);
    if (this.formularioTerminarGestion.valid) {
      this.dataConfirm = '¿Desea terminar la gestión?';
      this.confirmChange('terminarGestion');
    }
    this.mantenimiento.actividadActual = actividadSel;
  }

  /** Método encargado de confirmar la solicitud de anulación del mantenimiento por el usuario */
  anularGestion() {
    this.mantenimiento.observaciones = this.formularioAnularGestion.get('observaciones').value;
    this.mantenimiento.actividadActual = this.actividadActualObject;
    this.dataConfirm = '¿Desea anular la gestión?';
    this.confirmChange('anularGestion');
  }

  /** Método encargado de confirmar la acción del usuario */
  confirmChange(action) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      mensaje: this.dataConfirm
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value === 1) {
        this.servicio.acciones(action, this.mantenimiento).subscribe((data) => {
          this.servicio.updateGestionarProcesoList('update');
          this.dialogRef.close(this.formularioReasignarUsuario.value);
          if (action === 'reasignarActividad') {
            this.snackBar.open(this.constants.actualizacionExitosaReasignacion, 'X', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open(this.constants.actualizacionExitosa, 'X', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          }
        },
          error => {
            this.utilitiesServices.formErrorMessages(error, this.formularioReasignarUsuario, this.snackBar);
          });
      } else {
        this.restartObject();
      }
    });
  }

  /** Método encargado de reiniciar el objeto mantenimiento a los valores anteriores */
  restartObject() {
    // tslint:disable-next-line: forin
    for (const key in this.mantenimiento) {
      this.mantenimiento[key] = this.clone[key];
    }
  }
}
