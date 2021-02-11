import { EquipodisponibilidadCreateComponent } from './../../equipodisponibilidad/equipodisponibilidad-create/equipodisponibilidad-create.component';
import { EquipodisponibilidadService } from './../../equipodisponibilidad/services/equipodisponibilidad.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { RecursoService } from '../services/recurso.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

/** Componente encargado de gestionar los recursos */
@Component({
  selector: 'sigma-administracion-recurso-admin',
  templateUrl: './recurso-admin.component.html'
})
export class RecursoAdminComponent implements OnInit {
  /** variable usada para la posición de grupo en el componente */
  selectedTab = 0;

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio Recurso usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicio: RecursoService,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicio.positionTab$.subscribe((position: any) => {
      if (position) {
        this.selectedTab = position;

        if (window.location.pathname == this.constants.path_administracion_recurso_frontend) {
          this.servicio.changeSelectedTab(null);
        }
      }
    });
  }

}
