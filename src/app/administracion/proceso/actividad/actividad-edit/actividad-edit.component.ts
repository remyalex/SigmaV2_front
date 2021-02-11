import { Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ActividadModel } from '../../models/actividad.model';
import { Permiso } from 'src/app/administracion/permisos/models/permiso.model';
import { PermisosService } from 'src/app/administracion/permisos/services/permisos.service';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Condicion } from '../../../../mejoramiento/historial-mantenimiento/models/modelsForQuery.model';

/** Componente encargado de gestionar la edición de la actividad */
@Component({
  selector: 'app-actividad-edit',
  templateUrl: './actividad-edit.component.html'
})
export class ActividadEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  /** lista de Permisos usada en el componente */
  listaPermiso: Permiso[];
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** objeto que recibe data enviada al componente */
  proceso: Proceso;
  /** Objeto usado para enviar al servicio de CRUD*/
  actividadToEdit: ActividadModel;
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


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioPermiso Servicio Permisos usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: ProcesoService,
    private servicioPermiso: PermisosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ActividadEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = data.proceso;
    this.actividadToEdit = data.actividadToEdit;
    this.form = this.formBuilder.group(
      {
        'activoProcesoActividad': [this.actividadToEdit.activo, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'id': [null, Validators.compose([Validators.required])],
        'url': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'area': [null],
        'cargo': [null],
        'componenteUI': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'permiso': [null, Validators.compose([Validators.required])],
        'duracion': [null, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('[0-9]*')])]
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.actividadToEdit));
    this.customerDiffer = this.differs.find(this.actividadToEdit).create();
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
        for (let key in this.actividadToEdit) {
          this.actividadToEdit[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.actividadToEdit.area = (this.actividadToEdit.area === '') ? null : this.actividadToEdit.area;
    this.actividadToEdit.cargo = (this.actividadToEdit.cargo === '') ? null : this.actividadToEdit.cargo;
    this.actividadToEdit.duracion = this.actividadToEdit.duracion;
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
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });
  }

  /** Método encargado de añadir la condición en la Transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
    }
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
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

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.actividadToEdit);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicio.searchByList(
          this.constants['path_administracion_procesoactividad_' + record.key], this.actividadToEdit[record.key])
          .then(data => {
            if (data) {
              this.actividadToEdit[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }
}
