import { Component, OnInit, KeyValueChanges, KeyValueDiffers, KeyValueDiffer, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ProcessService } from 'src/app/shared/services/process.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ActividadModel } from '../../models/actividad.model';
import { PermisosService } from 'src/app/administracion/permisos/services/permisos.service';
import { Permiso } from 'src/app/administracion/permisos/models/permiso.model';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';
import { ProcesoService } from '../../services/proceso.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la creación de actividad*/
@Component({
  selector: 'sigma-administracion-procesoactividad-create',
  templateUrl: './actividad-create.component.html'
})
export class ActividadCreateComponent implements OnInit {

  /** objeto que recibe data enviada al componente */
  procesoData;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;
  /** lista de Permisos usada en el componente */
  listaPermiso: Permiso[];
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  actividad: ActividadModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Objeto lista  */
  actividades = [];
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param servicioPermiso Servicio Permisos usando en en componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param differs Elemento usado para mantener la información clonada
   * @param processService Servicio Procesos usado en el componente para gestionar las peticiones
   * @param dataGenericService Servicio Generico usado en el componente para gestionar las peticiones
   * @param procesoService Servicio Proceso usado en el componente para gestionar las peticiones
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) procesoData,
    // private servicio: ProcesoactividadService,
    private servicio: ProcesoService,
    private servicioPermiso: PermisosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ActividadCreateComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private processService: ProcessService,
    private dataGenericService: DataGenericService,
    private procesoService: ProcesoService,
    private utilitiesServices: UtilitiesService
  ) {
    this.procesoData = procesoData.proceso;
    this.actividad = new ActividadModel();
    this.form = this.formBuilder.group(
      {
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'activo': [true],
        'area': [null],
        'cargo': [null],
        'url': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'componenteUI': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'permiso': [null, Validators.compose([Validators.required])],
        'duracion': [null, Validators.compose([Validators.required, Validators.maxLength(255), Validators.pattern('[0-9]*')])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.actividad));
    this.customerDiffer = this.differs.find(this.actividad).create();

    this.servicioPermiso.list().subscribe(data => {
      this.listaPermiso = data;
    });
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
        for (let key in this.actividad) {
          this.actividad[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.actividad.area = (this.actividad.area === '') ? null : this.actividad.area;
    this.actividad.cargo = (this.actividad.cargo === '') ? null : this.actividad.cargo;
    this.actividad.duracion = this.actividad.duracion;
    this.procesoData.actividades.push(this.actividad);
    this.addCondicionTransicion();
    this.servicio.update(this.procesoData).subscribe(
      procesoDataToSend => {
        this.servicio.sendNewDataSelection(procesoDataToSend);
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(this.form.value);
      },
      error => {
        this.procesoData.actividades.splice(-1, 1);
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
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
    // tslint:disable-next-line: forin
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.actividad);
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
          this.constants['path_administracion_procesoactividad_' + record.key], this.actividad[record.key])
          .then(data => {
            if (data) {
              this.actividad[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
    */
  }
}
