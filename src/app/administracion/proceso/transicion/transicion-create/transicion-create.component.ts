import { Component, OnInit, KeyValueDiffer, KeyValueDiffers, KeyValueChanges, Inject, ViewChild } from '@angular/core';
import { TransicionModel } from '../../models/transicion.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';
import { Permiso } from '../../../permisos/models/permiso.model';
import { PermisosService } from '../../../permisos/services/permisos.service';
import { ListaItem } from '../../../listas-items/models/listas-items.model';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaFormSelectComponent } from 'src/app/shared/component/sigma-form-select/sigma-form-select.component';

/** Componente encargado de gestionar la creación de transición */
@Component({
  selector: 'app-transicion-create',
  templateUrl: './transicion-create.component.html'
})
export class TransicionCreateComponent implements OnInit {

  /** objeto que recibe data enviada al componente */
  procesoData;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;
  /** Objeto usado para enviar al servicio de CRUD*/
  transicion: TransicionModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};
  /** Objeto lista Permiso tipo Permiso */
  listaPermiso: Permiso[];
  /** Objeto lista Estado tipo ListaItem */
  listaEstado: ListaItem[];
  /** Objeto lista actividades por proceso de tipo WorkflowActividadModel */
  listActivitiesByProcesoSelected: WorkflowActividadModel[];
  /**  Bandera para indicar si el componente se encuentra en procesamiento desde el cliente*/
  valid = false;
  /** Componente hijo SigmaFormSelect usado en el componente */
  @ViewChild('actividadFinal') sigmaFormSelect: SigmaFormSelectComponent;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) procesoData,
    private servicio: ProcesoService,
    private servicioPermiso: PermisosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TransicionCreateComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesServices: UtilitiesService
    // private differs: KeyValueDiffers
  ) {
    this.procesoData = procesoData.proceso;
    this.procesoData.actividades = this.utilitiesServices.orderArray(procesoData.proceso.actividades, 'nombre');
    this.transicion = new TransicionModel();

    this.form = this.formBuilder.group(
      {
        'actividadFinId': [null, Validators.compose([Validators.required])],
        'proceso': [null],
        'actividadInicioId': [null, Validators.compose([Validators.required])],
        'estadopk': [null],
        'estadoMantenimiento': [null],
        'condicion': [null],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'permiso': [null, Validators.compose([Validators.required])],
        'activo': [true],
        'requiereObservacion': [null],
        'esMasiva': [],
        'tipoasignacion': [null, Validators.compose([Validators.required])],
        'esReasignable': []
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.form.get('proceso').valueChanges.subscribe(
      procesoSelected => {
        if (procesoSelected && this.valid === false) {
          this.procesoSelectedToFinalActivity(procesoSelected.id);
        }
      }
    );
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
      if (val == 1) {
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.transicion.estadoPk = (this.transicion.estadoPk === '') ? null : this.transicion.estadoPk;
    this.transicion.estadoMantenimiento = (this.transicion.estadoMantenimiento === '') ? null : this.transicion.estadoMantenimiento;
    if (this.transicion.estadoMantenimiento === '') {
      delete this.transicion.estadoMantenimiento;
    }
    this.addCondicionTransicion();
    this.procesoData.transiciones.push(this.transicion);
    this.servicio.update(this.procesoData).subscribe(
      data => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(this.form.value);
        this.enviada = false;
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(this.form.value);
      },
      error => {
        this.disableSubmit = false;
        this.procesoData.transiciones.splice(-1, 1);
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
  }

  /** Método encargado de añadir la condición en la Transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.procesoData.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.procesoData.transiciones[transition].condicion = this.procesoData.transiciones[transition].condiciones;
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.valid = true;
      this.disableSubmit = true;
      this.save();
    } else {
      if (this.form.get('proceso').value) {
        this.valid = true;
      }
      this.markAndValidateAllInputs(this.form);
      this.valid = false;
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método que retorna las actividades del proceso seleccionado
   * @param idProceso variable Id Proceso
   */
  procesoSelectedToFinalActivity(idProceso) {
    this.transicion.actividadFinal = null;
    const urlListActivitiesByProcesoSelected = this.constants.path_administracion_procesotransicion_actividadfinallist + idProceso;
    this.servicio.listActivities(urlListActivitiesByProcesoSelected).subscribe(
      (listActivitiesByProcess: Proceso) => {
        this.sigmaFormSelect.getListFromOtherSite(this.utilitiesServices.orderArray(listActivitiesByProcess.actividades, 'nombre'));
      }
    );
  }
}
