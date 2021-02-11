import { Component, OnInit, Inject, Input } from '@angular/core';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';

/** Componente encargado de gestionar la presentación de la infromación del mantenimiento */
@Component({
  selector: 'mantenimiento-info',
  templateUrl: './mantenimientoinfo.component.html'
})
export class MantenimientoinfoComponent implements OnInit {

   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
  /** mantenimiento al cual se le va a presentar la información de gestión del proceso */
  mantenimiento: WorkflowMantenimientoModel;
  /** Formulario en el cual se agrupará la información del mantenimiento */
  formularioMantenimiento: FormGroup;
  /** Usuario actualmente asignado */
  usuarioAsignado: string;
  /** Fecha de en la que se realizó la visita tecnica a la obra */
  fechaVisitaTec: string;

  /** Variable de entrada con el Id del mantenimiento del cual se presentará la información */
  @Input() mant: WorkflowMantenimientoModel;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param form: formulario usado para agrupar los elementos del modelo
  * @param workflowService Servicio de Workflow al que se solicitará la funcionalidad de workflow
  */
  constructor(
    private form: FormBuilder,
    private workflowService: WorkflowService
  ) {
    this.formularioMantenimiento = this.form.group({
      'idMantenimiento': [{ value: null, disabled: true }],
      'civ': [{ value: null, disabled: true }],
      'pk': [{ value: null, disabled: true }],
      'estadoPk': [{ value: null, disabled: true }],
      'localidad': [{ value: null, disabled: true }],
      'barrio': [{ value: null, disabled: true }],
      'zona': [{ value: null, disabled: true }],
      'ejeVial': [{ value: null, disabled: true }],
      'desde': [{ value: null, disabled: true }],
      'hasta': [{ value: null, disabled: true }],
      'descripcionOrigen': [{ value: null, disabled: true }],
      'fechaVisita': [{ value: null, disabled: true }],
      'responsable': [{ value: null, disabled: true }],
      'actividadActual': [{ value: null, disabled: true }],
      'programa': [{ value: null, disabled: true }],
      'estrategia': [{ value: null, disabled: true }],
      'administracion': [{ value: null, disabled: true }],
      'diagnosticoObservaciones': [{ value: null, disabled: true }],
      'observacionesPriorizacion': [{ value: null, disabled: true }],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mantenimiento = this.mant;
    if ( this.mantenimiento && this.mantenimiento.id ) {
      this.fechaVisitaTec = this.mantenimiento.fechaVisitaTecnica;
      this.workflowService.detail(this.mantenimiento.id).subscribe((data: any) => {
        if (data && data.length > 0 && data[0].mantenimiento) {
          this.usuarioAsignado = data[0].usuarioAsignado.nombresYapellidos;
        } else {
          this.loadData();
        }
      });
    } else {
      this.loadData();
    }

  }

  /**
  * Método encargado de suplantar el métido de carga de
  * datos para solicitud de la información
  */
  loadData() {
    this.usuarioAsignado = null;
  }

}
