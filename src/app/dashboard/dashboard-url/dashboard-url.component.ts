import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DashboardViewService } from '../services/dashboard-view.service';

/** Componente encargado de gestionar las URL de los dashboard */
@Component({
  selector: 'sigma-dashboard-view-url',
  templateUrl: 'dashboard-url.component.html',
  styleUrls: ['./dashboard-url.component.scss']
})
export class DashboardUrlComponent implements OnChanges {

  /** Objeto que recíbe lista de componentes para mostrar */
  componente: any;
  /** Objeto marcador para un valor seguro de usar como HTML.*/
  selector: SafeHtml;
  /** Variable URL recibida en la invocación del componente */
  @Input('urlInterna') urlInterna: string;
  /** componente hijo */
  @ViewChild('container', { read: ViewContainerRef }) entry: ViewContainerRef;
  /** objeto booleano que devuelve el componente una vez procesada la información */
  @Output('renderComponent') renderComponent = new EventEmitter<boolean>();

  /**
  * Método encargado de construir una instancia de la clase
  * @param resolver componente usado para la gestion de componentes del dashboard
  * @param servicio servicio DashboardView usado para visualizar los dashboard
  */
  constructor(
    private resolver: ComponentFactoryResolver,
    private servicio: DashboardViewService) {
  }

  /** Método encargado de ejecutarse una vez que cargue el componente
   * @param newChanges objeto con nuevos cambios a usar
  */
  ngOnChanges(newChanges: any) {
    if (typeof newChanges.urlInterna.currentValue !== 'undefined') {
      this.urlInterna = newChanges.urlInterna.currentValue;
      this.entry.clear();
      const component = this.servicio.getComponent(this.urlInterna);
      if (typeof component !== 'undefined') {
        this.renderComponent.emit(true);
        const factory = this.resolver.resolveComponentFactory(component);
        this.entry.createComponent(factory);
      } else {
        this.renderComponent.emit(false);
      }

    }
  }

}
