import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de la gestion de visualización de registros de mantenimientos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'worflow-solicitud-mantenimiento-view',
  templateUrl: './mantenimiento-view.component.html'
})
export class MantenimientoViewComponent implements OnInit {

  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  @Input() mantenimiento: WorkflowMantenimientoModel;

  /** Formulario contenedor del componente */
  @Input() form: FormGroup;

  /** Estados del pk seleccionado en el mapa */
  estadosPkMapa = [];
  /** Bandera que permite identificar si el boton trabajar está deshabilitado en el formualrio*/
  botonTrabajarMapa: false;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
