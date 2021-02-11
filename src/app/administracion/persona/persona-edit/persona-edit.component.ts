import { Component, OnInit, Inject, KeyValueDiffer, KeyValueDiffers, KeyValueChanges, DoCheck } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Persona } from '../models/persona.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../services/persona.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de una persona*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-persona-edit',
  templateUrl: './persona-edit.component.html'
})
export class PersonaEditComponent implements OnInit, DoCheck {

  private customerDiffer: KeyValueDiffer<string, any>;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
  /** Objeto usado para enviar al servicio de CRUD*/
  persona: Persona;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Lista de datos requeridos para mostrar en el componente auto-complete */
  personaInfo = { nombres: this.constants.nombre, apellidos: this.constants.apellido };
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = {};


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param data Información a procesar
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param differs Elemento usado para mantener la información clonada.
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: PersonaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonaEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Persona,
    private dialog: MatDialog,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService,
  ) {
    this.persona = data;
    this.servicio.persona = this.persona;

    this.form = this.formBuilder.group(
      {
        'id': [null, Validators.compose([Validators.required])],
        'activo': [null],
        'apellidos': [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
        'areaUmvId': [null, Validators.compose([Validators.required])],
        'cargoId': [null, Validators.compose([Validators.required])],
        'categoriaPersonaId': [null, Validators.compose([Validators.required])],
        'correo': [null, Validators.compose([Validators.required, Validators.maxLength(60), Validators.email])],
        'estadoPersonaId': [null, Validators.compose([Validators.required])],
        'horaFinal': [null],
        'horaInicial': [null],
        'identificacion': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
        'nombres': [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
        'telefono': [null, Validators.compose([Validators.required, Validators.maxLength(20),
        Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)])],
        'tipoIdentificacionId': [null, Validators.compose([Validators.required])],
        'tipoRegimenId': [null],
        'usuario': [null],
      }, { /* validator: TimeValidator.timeMin */ });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.persona));
    this.customerDiffer = this.differs.find(this.persona).create();

    this.servicio.personaClone$.subscribe(data => {
      if (Object.keys(data).length > 1) {
        if (data.id === this.clone['id']) {
          this.clone = JSON.parse(JSON.stringify(data));
          this.persona = data;
        }
      }
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
      if (val === 1) {
        // tslint:disable-next-line:forin
        for (const key in this.persona) {
          this.persona[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.persona.usuario) {
      if (!this.persona.usuario.id) {
        this.persona.usuario = null;
      }
    }
    this.servicio.update(this.persona).subscribe(data => {
      this.dataGenericService.removeCacheListContain(this.constants.path_administracion_persona);
      this.dialogRef.close(this.form.value);
      this.enviada = false;
      this.snackBar.open(this.constants.successEdit, 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.disableSubmit = false;
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open(this.constants.errorForm, 'X', {
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
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }


  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.persona);
    if (changes) {
      this.customerChanged(changes);
    }
  }


  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
          this.router.navigate([urlBack]);
        }
      }
    );
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
          this.constants['path_administracion_persona_' + record.key], this.persona[record.key])
          .then(data => {
            if (data) {
              this.persona[record.key.replace(/Id$/, '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }

}
