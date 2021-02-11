import { Component, OnInit, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { FormularioDirective } from '../../directives/fomulario.directive';
import { WorkflowFormulario } from '../../models/workflow.formulario.model';
import { FormComponent } from '../../interfaces/workflow-forms.interface';
import { WorkflowService } from '../../services/workflow-service.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

/** Componente encargado de gestionar las vistas de formulario */
@Component({
  selector: 'app-formulario-viewer',
  templateUrl: './formulario-viewer.component.html'
})
export class FormularioViewerComponent implements OnInit {

  /** Formulario para el cual se realizará el procesamiento
  * de la información */
  @Input() formulario: WorkflowFormulario;
  /** accion para el cual se realizará el procesamiento
  * de la información */
  @Input() accion: string;
  /** Formulario en la que se procesará la información */
  @ViewChild(FormularioDirective) formularioHost: FormularioDirective;
  /** objeto que se recibirá el componente a mostrar*/
  componentRef: any;
  /** Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;

  /**
  * Método encargado de construir una instancia
  * @param componentFactoryResolver componente para visualizar el formulario
  */
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.updateData();
  }

  /** Método encargado de actualizar la data del componente */
  public updateData() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.formulario.component);

    const viewContainerRef = this.formularioHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (<FormComponent>this.componentRef.instance).data = this.formulario.data;
    (<FormComponent>this.componentRef.instance).accion = this.accion;
  }
}
