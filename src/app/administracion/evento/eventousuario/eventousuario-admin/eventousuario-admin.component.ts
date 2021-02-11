import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';
import { MatDialog } from '@angular/material';
import { EventousuarioService } from '../services/eventousuario.service';

/** Clase encargada de la gestion del componente */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-eventousuario-admin',
  templateUrl: './eventousuario-admin.component.html'
})
export class EventousuarioAdminComponent implements OnInit {

  /** Entrada objeto numero de evento */
  // tslint:disable-next-line:no-input-rename
  @Input('evento') evento: number;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;

  /**
  * Método encargado de construir una instancia de la clase
  * 
  * @param router Componente usado para redireccionar entre componentes
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private router: Router,
    private servicio: EventousuarioService,
    private dialog: MatDialog,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }
}
