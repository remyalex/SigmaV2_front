import {
  Component, OnInit, Inject, KeyValueChanges, KeyValueDiffer, KeyValueDiffers,
  ElementRef, ViewChild, Input, Output, AfterViewInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Proceso } from '../models/proceso.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcesoService } from '../services/proceso.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';
import { ProcessService } from 'src/app/shared/services/process.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/operators';
import { Lista } from '../../listas/models/lista.model';
import { EventEmitter } from 'events';
import { pluck } from 'rxjs/operators';
import { ActividadModel } from '../models/actividad.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la edición de proceso*/
@Component({
  selector: 'sigma-administracion-proceso-edit',
  templateUrl: './proceso-edit.component.html'
})
export class ProcesoEditComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;
  /** Objeto usado para enviar al servicio de CRUD*/
  proceso: Proceso;
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
  /** Lista de opciones */
  optionsList: Lista[];
  /** Lista de Actividades usada en la grilla del componente*/
  listaActividades: ActividadModel[];
  /** Bandera para indicar si la transición esta inactiva */
  transitionDisabled: Boolean = false;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  generalLoad = true;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param _router Componente usado para recibir parametros por URL
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param processService Componente de procesos de peticiones a servicios
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: ProcesoService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private processService: ProcessService,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = new Proceso();
    this.form = this.formBuilder.group(
      {
        'activo': [null, Validators.compose([Validators.required])],
        'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'url': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        'id': [null, Validators.compose([Validators.required])],
        'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this.processService.updateIdProcess({ id: Number(id) });
    this.servicio.detail(Number(id)).subscribe(
      (data: Proceso) => {
        this.generalLoad = false;
        this.proceso = data;
        this.servicio.sendNewDataSelection(this.proceso);
        if (this.proceso.actividades.length < 2) {
          this.transitionDisabled = true;
        } else {
          this.transitionDisabled = false;
        }
        this.enviada = false;
      },
      error => {
        this.proceso = new Proceso();
      }
    );
    this.servicio.Procesodata.subscribe(
      (data: Proceso) => {
        if (data.id !== undefined) {
          this.proceso = data;
          if (this.proceso.actividades.length < 2) {
            this.transitionDisabled = true;
          } else {
            this.transitionDisabled = false;
          }
        }
      }
    );
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

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      procesoData => {
        this.snackBar.open('¡Se actualizaron los datos con éxito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.split('/').splice(0, location.pathname.split('/').length - 2).join('/') + '/admin';
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de añadir la condición en la Transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
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
          const urlBack = location.pathname.split('/').splice(0, location.pathname.split('/').length - 2).join('/') + '/admin';
          this.router.navigate([urlBack]);
        }
      }
    );
  }
  // selectTabla(nombreTabla: string): void {
  //   this.proceso.tabla = nombreTabla;
  // }

  /** Método encargado de reemplazar el ID de actividad Inicial del proceso
   * @param _id objeto numerico
   */
  seleccionarActividadInicial(_id: number) {
    this.proceso.actividadInicialId = _id;
  }
}

