import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormularioServiceService } from '../../services/formulario-service.service';
import { WorkflowFormulario } from '../../models/workflow.formulario.model';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../../services/workflow-service.service';
import { WorkflowMantenimientoActividadModel } from '../../models/workflow-mantenimiento-actividad.model';
import { FormularioViewerComponent } from '../formulario-viewer/formulario-viewer.component';
import { MatSnackBar } from '@angular/material';
import { BaseComponent } from '../../extends/base-component';
import { FormComponent } from '../../interfaces/workflow-forms.interface';

/** Componente enacrgado de gestionar las actividades que se presentarán en la grilla al usuario */
@Component({
  selector: 'app-actividad-viewer',
  templateUrl: './actividad-viewer.component.html'
})
export class ActividadViewerComponent implements OnInit {
  /** Proceso al cual pertenece la actividad a gestionar */
  private proceso: string;
  /** Nombre de la actividad a gestionar */
  private actividad: string;
  /** Vista de formulario que contiene la vista del elemento a mostrar  */
  @ViewChild('formViewer') formViewer: FormularioViewerComponent;

  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing: Boolean = true;

  /** Formulario contenedor del componente */
  public formulario: WorkflowFormulario;
  /**
   * Variable usada para recibir en la invocación del componente
   * la actividad del mantenimiento
   **/
  public mantenimientoActividad: WorkflowMantenimientoActividadModel;
  /** Identificador del mantenimiento para el cual se realizará el procesamiento
  * de la información */
  public mantenimientoId: number;
  /** Acción ejecutada por el componente que lo invoca */
  public accion: string;
  /** Petición actual de mantenimiento actividad*/
  requestMantenimientoActividad: any;
  /** Petición actual de mantenimiento*/
  requestMantenimiento: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param router Componente usado para redireccionar entre componentes
  * @param formularioService Componente usado para Agrupar elementos en el formulario
  * @param workflowService Componente usado para invocar los servicios de workflow
  * @param snackBar Componente usado para abrir un recuadro modal
   */
  constructor(
    private route: ActivatedRoute,
    private formularioService: FormularioServiceService,
    private workflowService: WorkflowService,
    private snackBar: MatSnackBar,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.processing = true;
    this.route.paramMap.subscribe(params => {
      this.proceso = params.get('proceso');
      this.actividad = params.get('actividad');
      this.mantenimientoId = +params.get('mantenimientoId');
      this.accion = params.get('accion');
      this.mantenimientoActividad = null;

      this.cancelPreviousRequest();
      if (this.mantenimientoId !== null && this.mantenimientoId !== 0 && this.mantenimientoId !== undefined) {
        this.requestMantenimientoActividad = this.workflowService.workMantenimiento(this.mantenimientoId)
          .subscribe((mantenimientoActividad) => {
            this.mantenimientoActividad = mantenimientoActividad;
            this.formulario = null;
            this.formularioService.getForm(this.mantenimientoActividad).subscribe((formulario) => {
              this.formulario = formulario;
              this.processing = false;
            });
          }, error => {
            this.processing = false;
            this.snackBar.open('La actividad a realizar se encuentra inactiva o no esta creada.', 'X', {
              duration: 60000,
              panelClass: ['error-snackbar']
            });
          });
      } else {
        this.requestMantenimientoActividad = this.workflowService.get(this.proceso, this.actividad).subscribe((mantenimientoActividad) => {
          this.mantenimientoActividad = mantenimientoActividad;
          this.formulario = null;
          this.formularioService.getForm(this.mantenimientoActividad).subscribe((formulario) => {
            this.formulario = formulario;
            this.processing = false;
          });
        }, error => {
          this.processing = false;
          this.snackBar.open('La actividad a realizar se encuentra inactiva o no esta creada.', 'X', {
            duration: 60000,
            panelClass: ['error-snackbar']
          });
        });
      }
    });
  }

  /** Método encargado de devolver a la pagina principal el componente */
  private cancelPreviousRequest() {
    if (this.requestMantenimientoActividad) {
      this.requestMantenimientoActividad.unsubscribe();
    }
    if (this.requestMantenimiento) {
      this.requestMantenimiento.unsubscribe();
    }
  }
}
