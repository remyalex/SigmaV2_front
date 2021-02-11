import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { TransicionModel } from '../../models/transicion.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';
import { ProcessService } from 'src/app/shared/services/process.service';
import { pluck } from 'rxjs/operators';
import { Permiso } from '../../../permisos/models/permiso.model';
import { PermisosService } from '../../../permisos/services/permisos.service';
import { ListaItem } from '../../../listas-items/models/listas-items.model';
import { Proceso } from '../../models/proceso.model';
import { ProcesoService } from '../../services/proceso.service';
import { SigmaFormSelectComponent } from 'src/app/shared/component/sigma-form-select/sigma-form-select.component';
import { transition } from '@angular/animations';

@Component({
  selector: 'sigma-administracion-procesotransicion-edit',
  templateUrl: './transicion-edit.component.html'
})
export class TransicionEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  proceso: Proceso;
  transicionToEdit: TransicionModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Clón del objeto que se va a modificar información */
  clone: {};
  /** Objeto lista Permiso tipo Permiso */
  listaPermiso: Permiso[];

  hideactividadFinal = true;
  /**  Bandera para indicar si el componente se encuentra en procesamiento desde el cliente*/
  valid = false;
  /** variable usada para mantener la condición seleccionada */
  condicion: any;
  /** Componente hijo SigmaFormSelect usado en el componente */
  @ViewChild('actividadFinal') sigmaFormSelect: SigmaFormSelectComponent;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param processService Servicio proceso usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: ProcesoService,
    private servicioPermiso: PermisosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TransicionEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private processService: ProcessService
  ) {
    this.proceso = data.proceso;
    this.transicionToEdit = data.transicionToEdit;
    this.transicionToEdit.condicion = this.transicionToEdit.condiciones;

    this.form = this.formBuilder.group(
      {
        'actividadFinId': [null, Validators.compose([Validators.required])],
        'actividadInicioId': [null, Validators.compose([Validators.required])],
        'estadopk': [null],
        'estadoMantenimiento': [null],
        'proceso': [null],
        'condicion': [null],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'permiso': [null, Validators.compose([Validators.required])],
        'activoTransicion': [this.transicionToEdit.activo],
        'requiereObservacion': [null],
        'esMasiva': [{ value: null, disabled: true }, null],
        'id': [this.transicionToEdit.id],
        'tipoasignacion': [null, Validators.compose([Validators.required])],
        'esReasignable': []
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.transicionToEdit));
    this.form.get('proceso').valueChanges.subscribe(
      procesoSelected => {
        if (procesoSelected && this.valid === false) {
          document.getElementById('tAId').style.display = 'initial';
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
        for (let key in this.transicionToEdit) {
          this.transicionToEdit[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.transicionToEdit.estadoPk = (this.transicionToEdit.estadoPk === '') ? null : this.transicionToEdit.estadoPk;
    this.transicionToEdit.estadoMantenimiento = (this.transicionToEdit.estadoMantenimiento === '') ? null : this.transicionToEdit.estadoMantenimiento;
    if (this.transicionToEdit.estadoMantenimiento === '') {
      delete this.transicionToEdit.estadoMantenimiento;
    }
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      (data: Proceso) => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(this.form.value);
        this.enviada = false;
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        this.disableSubmit = false;
        this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      });
  }

  /** Método encargado de añadir la condición en la Transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: no-shadowed-variable
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: triple-equals
      if (this.proceso.transiciones[transition].id === this.transicionToEdit.id) {
        this.proceso.transiciones[transition].condicion = this.condicion;
      } else {
        // tslint:disable-next-line: max-line-length
        this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
      }
    }
  }

  /** Método encargado de asignar condición seleccionada al objeto condición
  * @param event objeto condición 
  */
  condicionFunct(event) {
    this.condicion = event;
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.valid = true;
      this.disableSubmit = true;
      this.save();
    } else {
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
    this.transicionToEdit.actividadFinal = null;
    const urlListActivitiesByProcesoSelected = this.constants.path_administracion_procesotransicion_actividadfinallist + idProceso;
    this.servicio.listActivities(urlListActivitiesByProcesoSelected).subscribe(
      (listActivitiesByProcess: Proceso) => {
        this.sigmaFormSelect.getListFromOtherSite(listActivitiesByProcess.actividades);
      }
    );
  }
}
