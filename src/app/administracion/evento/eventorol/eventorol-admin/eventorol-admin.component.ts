import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';
import { EventousuarioService } from '../../eventousuario/services/eventousuario.service';
import { MatDialog, MatDialogConfig } from '@angular/material';

/** Clase encargada de la gestion del componente */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-eventorol-admin',
  templateUrl: './eventorol-admin.component.html'
})
export class EventorolAdminComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('eventoId') eventoId: number;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  constructor(
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
