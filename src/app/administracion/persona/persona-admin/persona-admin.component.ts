import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
import { PersonanovedadService } from '../../personanovedad/services/personanovedad.service';
import { PersonaService } from '../services/persona.service';
import { Persona } from '../models/persona.model';

/** Componente encargado de gestionar las personas */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-persona-admin',
  templateUrl: './persona-admin.component.html'
})
export class PersonaAdminComponent implements OnInit {

  /** Objeto usado para enviar al servicio de CRUD*/
  persona: Persona = new Persona();
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param servicioPersonaNovedad Servicio PersonaNovedad usado en el componente para gestionar las peticiones
  */
  constructor(
    private router: Router,
    private servicio: PersonaService,
    private servicioPersonaNovedad: PersonanovedadService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }
}
