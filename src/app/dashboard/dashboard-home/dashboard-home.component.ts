import { Component, OnInit } from '@angular/core';
import { AbstractForWidget } from 'src/app/shared/models/abstract-for-widget';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';

/** Componente encargado de gestionar el dashboard del home */
@Component({
  selector: 'dashboard-home',
  templateUrl: './dashboard-home.component.html'
})
export class DashboardHomeComponent implements OnInit {

  /** Objeto que recíbe lista de componentes para mostrar */
  componente: any;

  /**
  * Método encargado de construir una instancia de la clase
  * @param http Servicio http usado en el componente para gestionar las peticiones
  * @param appSettings Componente usado para completar URLs a usar
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private router: Router,
  ) {
    const widgets_url_service = this.appSettings.settings.hostApi + '/api/administracion/widget/';
    this.componente = [];
    this.http.get(widgets_url_service)
      .subscribe((arg: any) => {
        this.componente = arg.map((item: any) => {
          return { ...item, ...this.interna_externa(item.url), ...{ render: true } };
        });
      });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.componente = this.componente.map((item: any) => {
      return { ...item, ...this.interna_externa(item.url) }
    });
  }

  /** Método encargado de redireccionar a la página correspondiente 
   * del item seleccionado
   * @param item objeto item seleccionado
  */
  ver_mas(item: any) {
    if (item.tipo == 'externa') {
      const win = window.open(item.urlVerMas, '_blank');
      win.focus();
    } else {
      this.router.navigate([item.urlVerMas]);
    }
  }

  /** Método encargado de renderizar el componente
   * @param event objeto recibído del componente sigma-dashboard-view-url
   * @param item objeto seleccionado del objeto componente
   */
  renderComponent(event: boolean, item: any) {
    item.render = event;
    for (let i = 0; i < this.componente.length; i++) {
      if (this.componente[i].id == item.id) {
        this.componente[i] = item;
      }
    };
  }

  /** Método encargado de recibir URL de Items y retornar el tipo 
   * 'externa' o 'interna'
   * @param path objeto con tiene ruta URL
  */
  interna_externa(path: string) {
    const path_sub = path.substring(0, 4);
    let tipo = {};
    switch (path_sub.toUpperCase()) {
      case 'HTTP':
        tipo = { tipo: 'externa' };
        break;
      default:
        tipo = { tipo: 'interna' };
        break;
    }
    return tipo;
  }
}
