import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';

/** Componente encargado del proceso de redirección al login al home*/
@Component({
  selector: 'app-site-home',
  templateUrl: './site-home.component.html',
  styleUrls: ['./site-home.component.scss']
})
export class SiteHomeComponent implements OnInit {

  /** objeto que recibe valores standard para el componente */
  public settings: Settings;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    public appSettings: AppSettings,
    public router: Router,
  ) {
    this.settings = this.appSettings.settings;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.settings.rtl = false;
  }

  /** Método encargado de redireccionar la página al home */
  login() {
    this.router.navigate(['/administracion/dashboard/home']);
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
