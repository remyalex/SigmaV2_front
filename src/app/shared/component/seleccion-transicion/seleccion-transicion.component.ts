import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowTransicionModel } from 'src/app/workflow/models/workflow-transicion.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { CONST_WORKFLOW_SELECCIONAR_TRANSICION } from './seleccionar-transicion.constants';
import { forkJoin } from 'rxjs';
import { stringify } from 'querystring';

/** Componente enacrgado de la gestión de la selección de las transacciones */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-seleccion-transicion',
  templateUrl: './seleccion-transicion.component.html'
})
export class SeleccionTransicionComponent implements OnInit {

  // Constantes
 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_SELECCIONAR_TRANSICION;

  /** Variable de listado de transaciones seleccionables */
  @Input() transiciones: WorkflowTransicionModel[];
  /** Variable de mantenimiento de acividad usada para e workflow */
  @Input() data: WorkflowMantenimientoActividadModel;
  /** Evento de notificación de la transacción ejecutada */
  @Output() executeTransition = new EventEmitter();
  /** Variable de ingreso con la identificación de si se debe presentar el boton desabilitado */
  @Input() disabledSend = false;
  /** usuario por defecto (opcional) */
  @Input() defaultUser: UsuarioInfo;
  /** Bandera usada para visualizar el boton de cancelar */
  @Input() mostrarButtonCancelar = false;
  /** Funcion usada para retornar accion al boton atrás */
  @Output() executeBack = new EventEmitter();

  /** formulario con la información de la transicion */
  formularioTransicion: FormGroup;
  /** Listado de usuarios que se pueden seleccionar */
  asignables: UsuarioInfo[];
  /** Transacción del workflow seleccionable */
  transicion: WorkflowTransicionModel;
  /** Cadena de texto con las observaciones ingresadas por el usuario */
  observaciones: string;
  /** Usuario seleccionado al cual se asignará el mantenimiento */
  asignado: UsuarioInfo;
  /** Bandera para identificar si el usuario se presentará oculto */
  userHidden: Boolean = false;
  /** Bandera que permite identificar si el formulario se encuentra siendo procesado */
  loading = false;

  @Output() procesing = new EventEmitter();

  /** Bandera usada para ocultar el botón guardar */
  disableSelect = new FormControl(false);


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param _formBuilder Componente de construcción de elementos del formulario
  * @param _commonService Componente de servicios comunes usados en SIGMA
  */
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
  ) {
    this.asignado = null;
    this.formularioTransicion = this._formBuilder.group({
      'transicion': [null, Validators.compose([Validators.required])],
      'responsable': [null, Validators.compose([Validators.required])],
      'observacion': [null, Validators.compose([Validators.maxLength(300)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.evaluateOnlyOneTransition();
  }

  /** Método encargado de evaluar la condicion de una transición */
  evaluateOnlyOneTransition() {
    if (this.transiciones.length === 1) {
      this.transicion = this.transiciones[0];
      this.formularioTransicion.get('transicion').setValue(this.transiciones[0]);
      this.changeTransition();
      this.formularioTransicion.get('transicion').disable();
      this.formularioTransicion.get('responsable').disable();
    }
  }

  /**
   * Método encargado de asignar el valor por defecto de los atributos indicados
   *
   * @param option1 Atributo a asignar.
   * @param option2 Atributo a igualar
   */
  compareFnFixDefaultValue(option1, option2) {
    return option1.name === option2.name;
  }

  /**
   * Método encargado de gestionar el cambio de transición seleccionada
   * por el usuario.
   */
  changeTransition(): void {
    this.asignables = [];
    this.asignado = null;
    const _this = this;
    if (this.transicion.tipoAsignacion.valor !== 'NO_REQUIERE_USUARIO') {
      this.loading = true;
      this.procesing.next(true);
      this.setStatusResponsable(_this, false);
      this._commonService.getUsuariosTransicion(0, this.transicion.id).subscribe(data => {
        const mantenimientoID = this.data.mantenimiento.id != null ? this.data.mantenimiento.id : 0;
        this._commonService.getUsuarioAsignado( mantenimientoID, this.transicion.id ).subscribe(usuario => {
          this.asignables = data;
          // selecciona el usuario asignado a la transicion (backend)
          let count = 0;
          for (const asignable of this.asignables) {
            if (asignable.id === usuario.id) {
              this.asignables[count] = usuario;
              this.asignado = usuario;
              this.setStatusResponsable(_this, false);
              break;
            }
            count++;
          }
          this.loading = false;
          this.procesing.next(false);
        },
        error => {
          this.asignables = data;
          let count = 0;
          if (this.defaultUser) { // selecciona el usuario por defecto en caso de tenerlo (frontend)
            for (const asignable of this.asignables) {
              if (asignable.id === this.defaultUser.id) {
                this.asignables[count] = this.defaultUser;
                this.asignado = this.defaultUser;
                this.setStatusResponsable(_this, false);
                break;
              }
              count++;
            }
            this.setStatusResponsable(_this, false);
          } else {
            this.setStatusResponsable(_this, true);
          }
          this.loading = false;
          this.procesing.next(false);
        });
      });
      if (this.transicion.esReasignable || this.transicion.tipoAsignacion.descripcion === 'MANUAL') {
        this.userHidden = false;
      }
    } else {
      this.asignables = [];
      this.setStatusResponsable(_this, false);
      this.userHidden = true;
    }
      if (this.transicion.requiereObservacion) {
        this.formularioTransicion.controls['observacion'].enable();
      } else {
        this.formularioTransicion.controls['observacion'].disable();
      }
  }

  /**
   * Asignar el estado del responsable segun transición
   *
   * @param _this Objeto del cual se desea asignar el responsable
   * @param status Estado del objeto a asignar 
   */
  setStatusResponsable(_this: any, status) {
    if (status === true) {
      setTimeout(function() {
        _this.formularioTransicion.get('responsable').enable();
      } , 50);
    } else {
      setTimeout(function() {
        _this.formularioTransicion.get('responsable').disable();
      } , 50);
    }
  }

  /**
   * Método que permite establecer si el formualario requiere ser
   * procesado antes de ser enviado
   */
  isReadyForSubmit() {
    if (this.transicion === undefined || this.transicion === null) {
      return false;
    } else {
      if (this.transicion.requiereObservacion  === true) {
        if (this.observaciones === undefined || this.observaciones === null || this.observaciones === '') {
          return false;
        }
      }
      if (this.transicion.tipoAsignacion.valor !== 'NO_REQUIERE_USUARIO') {
        if (this.asignado === null || this.asignado === undefined) {
          return false;
        }
      }
      if (this.disabledSend) {
        return false;
      }
    }
    return true;
  }

  /**
   * Método encargado de realizar la validación de los campos
   * del formulario
   */
  public validate(): boolean {
    let habilitado = false;
    // tslint:disable-next-line: forin
    for (const inner in this.formularioTransicion.controls) {
      if (this.formularioTransicion.get(inner).enabled) {
        habilitado = true;
      }
      this.formularioTransicion.get(inner).markAsTouched();
      this.formularioTransicion.get(inner).updateValueAndValidity();
    }
    return !habilitado || this.formularioTransicion.valid;
  }

  /**
   * Método encargado de realizar el almacenamiento y notificación
   * de la acción de la transición.
   */
  public save(): void {
    if (this.validate()) {
      this.data.usuarioAsignado = this.asignado;
      this.data.observaciones = this.observaciones;
      this.data.transicion = this.transicion;
      this.executeTransition.emit();
    }
  }

  public onBack(): void {
    this.executeBack.emit();
  }
}
